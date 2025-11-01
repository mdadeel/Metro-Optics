import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'reviews']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const params = {
      query: searchParams.get('query') || '',
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12
    }
    
    const validatedParams = searchSchema.parse(params)
    
    // Use the same product data as the main API
    let allProducts;
    try {
      const dbProducts = await db.product.findMany();
      console.log(`[Search API] Found ${dbProducts.length} products in database`);
      allProducts = dbProducts.map(product => ({
        ...product,
        slug: product.slug || generateSlug(product.name),
        inStock: product.stock > 0,
        image: Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : null,
      }));
    } catch (dbError) {
      console.error('Database error in search API:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      console.error('Search API database error details:', { errorMessage, errorStack: dbError instanceof Error ? dbError.stack : undefined })
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: process.env.NODE_ENV === 'development' ? errorMessage : 'Failed to search products',
          products: [],
          pagination: { currentPage: 1, totalPages: 0, totalResults: 0, hasNextPage: false, hasPreviousPage: false },
          filters: {},
          suggestions: [],
          categories: [],
          brands: []
        },
        { status: 503 }
      );
    }
    
    // Filter products based on search criteria
    const filteredProducts = allProducts.filter(product => {
      // Text search
      const matchesQuery = !validatedParams.query || 
        product.name.toLowerCase().includes(validatedParams.query.toLowerCase()) ||
        product.description.toLowerCase().includes(validatedParams.query.toLowerCase()) ||
        product.brand.toLowerCase().includes(validatedParams.query.toLowerCase()) ||
        product.category.toLowerCase().includes(validatedParams.query.toLowerCase())
      
      // Category filter
      const matchesCategory = !validatedParams.category || 
        product.category === validatedParams.category
      
      // Price range filter
      const matchesMinPrice = !validatedParams.minPrice || 
        product.price >= validatedParams.minPrice
      const matchesMaxPrice = !validatedParams.maxPrice || 
        product.price <= validatedParams.maxPrice
      
      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice
    })
    
    // Sort products
    if (validatedParams.sortBy) {
      filteredProducts.sort((a, b) => {
        const key = validatedParams.sortBy as keyof typeof a;
        let aValue = a[key];
        let bValue = b[key];
        
        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = (aValue as string).toLowerCase();
          bValue = (bValue as string).toLowerCase();
        } else if (typeof aValue === 'number') {
          // For numbers, keep as is
          aValue = aValue as number;
          bValue = bValue as number;
        }
        
        if (validatedParams.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        }
      })
    }
    
    // Pagination
    const totalResults = filteredProducts.length
    const totalPages = Math.ceil(totalResults / validatedParams.limit!)
    const startIndex = (validatedParams.page! - 1) * validatedParams.limit!
    const endIndex = startIndex + validatedParams.limit!
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    // Generate search suggestions
    const suggestions = Array.from(new Set([
      ...allProducts.map(p => p.name),
      ...allProducts.map(p => p.brand),
      ...allProducts.map(p => p.category)
    ]))
      .filter(item => item.toLowerCase().includes(validatedParams.query.toLowerCase()))
      .slice(0, 5)
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: validatedParams.page,
        totalPages,
        totalResults,
        hasNextPage: validatedParams.page! < totalPages,
        hasPreviousPage: validatedParams.page! > 1
      },
      filters: {
        query: validatedParams.query,
        category: validatedParams.category,
        minPrice: validatedParams.minPrice,
        maxPrice: validatedParams.maxPrice,
        sortBy: validatedParams.sortBy,
        sortOrder: validatedParams.sortOrder
      },
      suggestions,
      categories: Array.from(new Set(allProducts.map(p => p.category))),
      brands: Array.from(new Set(allProducts.map(p => p.brand)))
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}