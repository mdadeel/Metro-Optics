import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'unknown' as 'connected' | 'disconnected' | 'error',
    productCount: 0,
  }

  try {
    // Test database connection
    await db.$connect()
    const productCount = await db.product.count()
    health.database = 'connected'
    health.productCount = productCount
  } catch (error) {
    console.error('Health check database error:', error)
    health.database = 'error'
    health.status = 'degraded'
  }

  const statusCode = health.database === 'connected' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}