import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const result = await db.$queryRaw`SELECT 1+1 AS result`
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}
