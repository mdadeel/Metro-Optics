import { NextRequest, NextResponse } from 'next/server'
import { getPlaceholderUrl } from '@/lib/image-generator'
import { parse } from 'url'

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.split('/api/placeholder/')[1]
    
    if (!path) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    
    const [dimensions, text] = path.split('/')
    const [widthStr, heightStr] = dimensions.split('x')
    
    const width = parseInt(widthStr)
    const height = parseInt(heightStr)
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 })
    }
    
    const placeholderUrl = getPlaceholderUrl(width, height, text)
    
    // Redirect to the generated data URL
    return NextResponse.redirect(placeholderUrl)
  } catch (error) {
    console.error('Placeholder API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    )
  }
}
