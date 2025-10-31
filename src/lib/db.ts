import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'info', 'warn']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Initialize database connection and handle errors
async function initializeDb() {
  try {
    await db.$connect();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't throw error here as it would break the app
    console.warn('Database connection failed, some features may not work properly');
  }
}

// Initialize on module load
initializeDb().catch(console.error);