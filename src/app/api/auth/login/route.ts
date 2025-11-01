import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { comparePassword, generateToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { rateLimit, getClientIP } from '@/lib/ratelimit'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user by email in database
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password using bcrypt
    const isPasswordValid = await comparePassword(validatedData.password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create user session with JWT (don't include password)
    const userSession = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role,
      phone: user.phone || undefined,
      avatar: user.avatar || undefined,
    }
    
    // Generate JWT token
    const token = generateToken(userSession)
    
    // Set HTTP-only cookie with JWT
    const response = NextResponse.json({
      message: 'Login successful',
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
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}