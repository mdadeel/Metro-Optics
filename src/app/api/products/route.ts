import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to generate slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper function to get sort options
function getSortOption(sortBy: string | null) {
  switch (sortBy) {
    case 'price-low': return { price: 'asc' as const }
    case 'price-high': return { price: 'desc' as const }
    case 'rating': return { rating: 'desc' as const }
    case 'name': return { name: 'asc' as const }
    case 'reviews': return { reviews: 'desc' as const }
    default: return [
      { rating: 'desc' as const },
      { reviews: 'desc' as const }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const inStock = searchParams.get('inStock')
    const sortBy = searchParams.get('sortBy')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const products = await db.product.findMany({ 
      where: {
        ...(category && { category }),
        ...(brand && { brand }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        ...(rating && { rating: { gte: parseFloat(rating) } }),
        ...(inStock === 'true' && { stock: { gt: 0 } }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { brand: { contains: search } },
            { description: { contains: search } }
          ]
        }),
        ...(featured === 'true' && {
          OR: [
            { badge: { not: null } },
            { rating: { gte: 4.5 } },
            { reviews: { gt: 100 } }
          ]
        })
      },
      orderBy: getSortOption(sortBy), 
      take: limit ? parseInt(limit) : undefined
    })

    // Transform products to include a single image field and slug for frontend compatibility
    const transformedProducts = products.map(product => ({
      ...product,
      slug: generateSlug(product.name),
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : null,
      images: product.images // Keep images array as well for flexibility
    }))

    return NextResponse.json(transformedProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
        'ETag': `"products-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}