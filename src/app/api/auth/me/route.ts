import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('auth-token')?.value
    
    if (!authToken) {
      // Return null user instead of 401 to allow unauthenticated users
      return NextResponse.json({
        user: null,
        authenticated: false
      })
    }
    
    // Verify JWT token
    const userSession = verifyToken(authToken)
    
    if (!userSession) {
      // Return null user instead of 401 to allow unauthenticated users
      return NextResponse.json({
        user: null,
        authenticated: false
      })
    }
    
    return NextResponse.json({
      user: userSession,
      authenticated: true
    })
    
  } catch (error) {
    console.error('Auth check error:', error)
    // Return null user on error to prevent frontend breaking
    return NextResponse.json({
      user: null,
      authenticated: false,
      error: 'Failed to verify authentication'
    })
  }
}