import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import glassesData from '@/data/glasses.json'

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
      sortBy: searchParams.get('sortBy') as any || undefined,
      sortOrder: searchParams.get('sortOrder') as any || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12
    }
    
    const validatedParams = searchSchema.parse(params)
    
    // Use the same product data as the main API
    let allProducts = glassesData.products.map(product => ({
      ...product,
      slug: generateSlug(product.name),
      inStock: true // Add stock status
    }))
    
    // Filter products based on search criteria
    let filteredProducts = allProducts.filter(product => {
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
        let aValue: any = a[validatedParams.sortBy as keyof typeof a]
        let bValue: any = b[validatedParams.sortBy as keyof typeof b]
        
        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}