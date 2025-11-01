/**
 * Simple in-memory rate limiting
 * For production, use @upstash/ratelimit with Redis
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Simple rate limiter
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = identifier
  
  // Clean up expired entries (simple cleanup - not optimized)
  if (Object.keys(store).length > 10000) {
    // Prevent memory leak - clear old entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })
  }
  
  // Check if entry exists and is still valid
  const entry = store[key]
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }
  
  // Increment count
  entry.count++
  
  // Check if limit exceeded
  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    }
  }
  
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Get client IP from NextRequest
 */
export function getClientIP(request: { ip?: string | null, headers: { get: (name: string) => string | null } }): string {
  // Try NextRequest IP first
  if (request.ip) {
    return request.ip
  }
  
  // Try various headers (behind proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

