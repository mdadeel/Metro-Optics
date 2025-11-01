import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> | { productId: string } }
) {
  try {
    // Handle Next.js 15 params as Promise
    const resolvedParams = params instanceof Promise ? await params : params
    
    if (!resolvedParams?.productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Find product by either ID or slug
    const product = await db.product.findFirst({
      where: {
        OR: [
          { id: resolvedParams.productId },
          { slug: resolvedParams.productId }
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