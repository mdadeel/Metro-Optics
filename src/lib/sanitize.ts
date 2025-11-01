/**
 * Basic input sanitization utility
 * Removes HTML tags and escapes special characters
 */

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')
  
  // Escape special characters to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length to prevent DoS
  const MAX_LENGTH = 10000
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH)
  }
  
  return sanitized
}

/**
 * Sanitize HTML while allowing some basic formatting
 * Use this for content that may need HTML (like comments)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }
  
  // Only allow safe HTML tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li']
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  
  let sanitized = html.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match
    }
    return '' // Remove disallowed tags
  })
  
  // Remove all attributes from tags
  sanitized = sanitized.replace(/<([a-z][a-z0-9]*)\b[^>]*>/gi, '<$1>')
  
  // Limit length
  const MAX_LENGTH = 10000
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH)
  }
  
  return sanitized.trim()
}

/**
 * Sanitize username - alphanumeric, spaces, hyphens, underscores only
 */
export function sanitizeUsername(username: string): string {
  if (!username || typeof username !== 'string') {
    return ''
  }
  
  // Only allow alphanumeric, spaces, hyphens, underscores
  let sanitized = username.replace(/[^a-zA-Z0-9\s\-_]/g, '')
  
  // Trim and limit length
  sanitized = sanitized.trim()
  const MAX_LENGTH = 100
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH)
  }
  
  return sanitized
}

