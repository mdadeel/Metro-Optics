import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Initialize database connection with timeout
async function initializeDb() {
  try {
    // Add timeout to prevent hanging
    const connectionPromise = db.$connect()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    )
    
    await Promise.race([connectionPromise, timeoutPromise])
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database connection failed:', error)
    }
    // Don't throw error here as it would break the app
    // Connection will be retried on first query
  }
}

// Initialize on module load (non-blocking)
if (typeof window === 'undefined') {
  initializeDb().catch(() => {
    // Silent fail - connection will retry on first use
  })
}