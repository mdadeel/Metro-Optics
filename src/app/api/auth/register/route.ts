import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, generateToken } from '@/lib/auth'

// Mock user database with hashed passwords - in production, this would be a real database
let users = [
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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user with hashed password
    const hashedPassword = await hashPassword(validatedData.password)
    const newUser = {
      id: users.length + 1,
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      phone: validatedData.phone,
      avatar: '/api/placeholder/100/100',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalOrders: 0,
      totalSpent: 0,
    }
    
    users.push(newUser)
    
    // Create user session
    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      avatar: newUser.avatar,
      memberSince: newUser.memberSince,
      totalOrders: newUser.totalOrders,
      totalSpent: newUser.totalSpent,
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