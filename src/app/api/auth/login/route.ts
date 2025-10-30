import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { comparePassword, generateToken } from '@/lib/auth'

// Mock user database with hashed passwords - in production, this would be a real database
const users = [
  {
    id: 1,
    name: 'Rahman Ahmed',
    email: 'rahman.ahmed@email.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // hashed 'password123'
    phone: '+880 1712-345678',
    avatar: '/api/placeholder/100/100',
    memberSince: 'January 2023',
    totalOrders: 24,
    totalSpent: 125990,
  },
  {
    id: 2,
    name: 'Fatima Khan',
    email: 'fatima.khan@email.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // hashed 'password123'
    phone: '+880 1812-987654',
    avatar: '/api/placeholder/100/100',
    memberSince: 'March 2023',
    totalOrders: 15,
    totalSpent: 89750,
  }
]

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user by email
    const user = users.find(u => u.email === validatedData.email)
    
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
    
    // Create user session with JWT
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      memberSince: user.memberSince,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
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