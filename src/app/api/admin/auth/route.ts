import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }

    // Mock token validation - in production, validate the token properly
    if (token === 'mock_admin_token') {
      return NextResponse.json({
        success: true,
        admin: {
          id: '1',
          name: 'Admin User',
          email: 'admin@opticabd.com',
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - in production, use proper authentication
    if (email === 'admin@opticabd.com' && password === 'admin123') {
      const response = NextResponse.json({
        success: true,
        admin: {
          id: '1',
          name: 'Admin User',
          email: 'admin@opticabd.com',
          role: 'admin'
        }
      })

      // Set a simple token in a cookie (in production, use secure HTTP-only cookies)
      response.cookies.set('admin_token', 'mock_admin_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}