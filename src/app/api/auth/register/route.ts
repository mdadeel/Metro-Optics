import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, generateToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { rateLimit, getClientIP } from '@/lib/ratelimit'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 registrations per hour per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000) // 3 attempts per hour
    
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: 'Too many registration attempts. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists in database
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user with hashed password in database
    const hashedPassword = await hashPassword(validatedData.password)
    const newUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: 'user',
      },
    })
    
    // Create user session (don't include password)
    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone || undefined,
      avatar: newUser.avatar || undefined,
    }
    
    // Generate JWT token
    const token = generateToken(userSession)
    
    // Set HTTP-only cookie with JWT
    const response = NextResponse.json({
      message: 'Registration successful',
      user: userSession
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return response
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}