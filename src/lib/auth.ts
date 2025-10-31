import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET environment variable is not defined, using fallback key');
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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession
  } catch {
    return null
  }
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}