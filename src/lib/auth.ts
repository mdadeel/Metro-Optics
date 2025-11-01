import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// CRITICAL: Fail fast if JWT_SECRET is not set in production
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET environment variable is required in production. ' +
      'Please set it in your environment variables.'
    )
  }
  console.warn('⚠️  JWT_SECRET not set - using development fallback (INSECURE)')
  console.warn('⚠️  This should NEVER be used in production!')
}

// Validate secret strength if set
if (JWT_SECRET && JWT_SECRET.length < 32) {
  console.warn('⚠️  JWT_SECRET is too short. Minimum 32 characters recommended for security.')
}

const getSecret = (): string => {
  if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production')
    }
    // Development fallback - warn but allow
    return 'development-secret-key-do-not-use-in-production-minimum-32-characters'
  }
  return JWT_SECRET
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

type UserSession = {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince?: string;
  totalOrders?: number;
  totalSpent?: number;
  [key: string]: string | number | undefined; // Allow other properties
};

export function generateToken(payload: UserSession): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, getSecret()) as UserSession
  } catch {
    return null
  }
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}