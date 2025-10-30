import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Find product by either ID or slug
    const product = await db.product.findFirst({
      where: {
        OR: [
          { id: params.productId },
          { slug: params.productId }
        ]
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product to include a single image field for frontend compatibility
    const transformedProduct = {
      ...product,
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : null,
      images: product.images // Keep images array as well for flexibility
    }

    return NextResponse.json(transformedProduct, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' // Cache for 5 minutes
      }
    })
  } catch (error) {
    console.error('Individual product API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}