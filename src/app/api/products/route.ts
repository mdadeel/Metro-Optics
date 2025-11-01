import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

// Product type definition (replaces Prisma types)
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string | null;
  rating: number;
  reviews: number;
  stock: number;
  images?: string[] | null;
  badge?: string | null;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Helper function to get sort options
function getSortOption(sortBy: string | null): { rating: 'desc' } | { reviews: 'desc' } | { price: 'asc' | 'desc' } | { name: 'asc' } {
  switch (sortBy) {
    case 'price-low': return { price: 'asc' as const }
    case 'price-high': return { price: 'desc' as const }
    case 'rating': return { rating: 'desc' as const }
    case 'name': return { name: 'asc' as const }
    case 'reviews': return { reviews: 'desc' as const }
    default: return { rating: 'desc' as const }
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

    let products: Product[] = []
    
    try {
      // Build where clause for Firestore
      const whereClause: any = {
        ...(category && { category }),
        ...(brand && { brand }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        ...(rating && { rating: { gte: parseFloat(rating) } }),
        ...(inStock === 'true' && { stock: { gt: 0 } }),
        ...(featured === 'true' && {
          OR: [
            { badge: { not: null } },
            { rating: { gte: 4.5 } },
            { reviews: { gt: 100 } }
          ]
        })
      }

      // Fetch products from Firestore
      products = await db.product.findMany({ 
        where: whereClause,
        orderBy: getSortOption(sortBy), 
      }) as Product[]

      // Apply search filter in memory (case-insensitive search)
      if (search) {
        const searchLower = search.toLowerCase()
        products = products.filter(product => {
          const nameMatch = product.name.toLowerCase().includes(searchLower)
          const brandMatch = product.brand?.toLowerCase().includes(searchLower) || false
          const descMatch = product.description.toLowerCase().includes(searchLower)
          return nameMatch || brandMatch || descMatch
        })
      }

      // Apply limit after filtering
      if (limit) {
        products = products.slice(0, parseInt(limit, 10))
      }
    } catch (dbError) {
      console.error('Database error in products API:', dbError)
      // Log detailed error for debugging
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      const errorStack = dbError instanceof Error ? dbError.stack : undefined
      console.error('Database error details:', { errorMessage, errorStack })
      
      // Return error response with details for debugging (in production, you may want to hide details)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: process.env.NODE_ENV === 'development' ? errorMessage : 'Failed to fetch products',
          products: [] // Return empty array for backward compatibility
        },
        { 
          status: 503, // Service Unavailable
          headers: {
            'Cache-Control': 'no-cache',
          }
        }
      )
    }

    // Transform products to include a single image field and slug for frontend compatibility
    const transformedProducts = products.map(product => ({
      ...product,
      slug: product.slug || generateSlug(product.name),
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