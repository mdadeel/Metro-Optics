# Security Fixes Implementation Guide

## Quick Fix Priority List

### 1. Fix Admin Authentication (CRITICAL)

**Replace:** `src/app/api/admin/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, comparePassword, generateToken, verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = adminLoginSchema.parse(body)
    
    // Find admin user in database
    const admin = await db.user.findUnique({
      where: { email },
      // Add a role field to User model or use separate Admin model
    })
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Verify password (store hashed password in DB)
    const isValid = await comparePassword(password, admin.password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate secure JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: 'admin',
    })
    
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    })
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }
    
    // Verify JWT token
    const admin = verifyToken(token)
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      admin,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

### 2. Fix JWT Secret (CRITICAL)

**Update:** `src/lib/auth.ts`

```typescript
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// CRITICAL: Fail fast if JWT_SECRET is not set in production
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production')
  }
  console.warn('⚠️ JWT_SECRET not set - using development fallback (INSECURE)')
}

// Validate secret strength
if (JWT_SECRET && JWT_SECRET.length < 32) {
  console.warn('⚠️ JWT_SECRET is too short. Minimum 32 characters recommended.')
}

const getSecret = () => {
  if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required')
    }
    return 'development-secret-key-do-not-use-in-production-minimum-32-chars'
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
  id: number | string
  name?: string
  email: string
  role?: string
  phone?: string
  avatar?: string
  [key: string]: string | number | undefined
}

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
```

---

### 3. Move Users to Database

**Update Prisma Schema:** `prisma/schema.prisma`

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // Store bcrypt hash
  phone     String?
  role      String   @default("user") // "user" or "admin"
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Update Login Route:** `src/app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { comparePassword, generateToken } from '@/lib/auth'
import { db } from '@/lib/db'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    // Find user in database
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password
    const isPasswordValid = await comparePassword(validatedData.password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create user session
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    
    // Generate JWT token
    const token = generateToken(userSession)
    
    const response = NextResponse.json({
      message: 'Login successful',
      user: userSession,
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
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
```

---

### 4. Add Rate Limiting

**Install:** `npm install @upstash/ratelimit @upstash/redis`

**Create:** `src/lib/ratelimit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// For production, use Upstash Redis
// For development, use in-memory limiter
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPstash_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined

export const loginRateLimit = new Ratelimit({
  redis: redis || undefined,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
  prefix: '@ratelimit/login',
})

export const apiRateLimit = new Ratelimit({
  redis: redis || undefined,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: '@ratelimit/api',
})
```

**Update Login Route:**

```typescript
import { loginRateLimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || headers().get('x-forwarded-for') || 'unknown'
  const { success, limit, reset, remaining } = await loginRateLimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { 
        error: 'Too many login attempts. Please try again later.',
        retryAfter: Math.round((reset - Date.now()) / 1000)
      },
      { status: 429 }
    )
  }
  
  // ... rest of login logic
}
```

---

### 5. Fix CORS Configuration

**Update:** `server.ts`

```typescript
cors: {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}
```

---

### 6. Add Security Headers

**Create:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  )
  
  // HTTPS enforcement
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }
  
  return response
}

export const config = {
  matcher: '/:path*',
}
```

---

### 7. Add Input Sanitization

**Install:** `npm install dompurify isomorphic-dompurify`

**Create:** `src/lib/sanitize.ts`

```typescript
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  })
}

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}
```

**Update Review Route:**

```typescript
import { sanitizeInput, sanitizeHtml } from '@/lib/sanitize'

export async function POST(request: NextRequest, { params }) {
  const body = await request.json()
  
  const newReview = {
    userName: sanitizeInput(body.userName),
    comment: sanitizeHtml(body.comment), // Allow some HTML
    title: sanitizeInput(body.title),
    // ...
  }
}
```

---

### 8. Strengthen Password Requirements

**Update:** `src/app/api/auth/register/route.ts`

```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
})
```

---

## Environment Variables Required

Create `.env.example`:

```env
# Required
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
DATABASE_URL=file:./prisma/dev.db

# Optional but recommended
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
UPSTASH_REDIS_REST_URL=https://your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
NODE_ENV=production
```

---

## Implementation Checklist

- [ ] Remove hardcoded admin credentials
- [ ] Implement database-based admin auth
- [ ] Fix JWT secret handling
- [ ] Move users to database
- [ ] Add rate limiting
- [ ] Fix CORS
- [ ] Add security headers
- [ ] Add input sanitization
- [ ] Strengthen password requirements
- [ ] Add authentication to reviews
- [ ] Set environment variables
- [ ] Test all fixes
- [ ] Update documentation

