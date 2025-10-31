import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

type FavoriteItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  addedAt?: string;
};

// Mock favorites database - in production, this would be a real database
const userFavorites: { [userId: number]: FavoriteItem[] } = {}

const favoriteItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  image: z.string(),
  discount: z.number().optional(),
})

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      // Return empty favorites instead of 401 for unauthenticated users
      return NextResponse.json({ favorites: [], authenticated: false })
    }

    const user = verifyToken(authToken)
    if (!user) {
      // Return empty favorites instead of 401 for invalid token
      return NextResponse.json({ favorites: [], authenticated: false })
    }

    const favorites = userFavorites[user.id] || []
    return NextResponse.json({ favorites, authenticated: true })
  } catch (error) {
    console.error('Get favorites error:', error)
    // Return empty favorites instead of 500 to prevent breaking frontend
    return NextResponse.json({ 
      favorites: [], 
      authenticated: false,
      error: 'Failed to retrieve favorites'
    })
  }
}

// POST /api/favorites - Add item to favorites
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        authenticated: false,
        favorites: [] 
      }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid token', 
        authenticated: false,
        favorites: [] 
      }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = favoriteItemSchema.parse(body)

    if (!userFavorites[user.id]) {
      userFavorites[user.id] = []
    }

    // Check if item already exists in favorites
    const existingItem = userFavorites[user.id].find(item => item.productId === validatedData.productId)
    
    if (existingItem) {
      return NextResponse.json({ 
        message: 'Item already in favorites',
        favorites: userFavorites[user.id],
        authenticated: true
      })
    }

    // Add new item
    userFavorites[user.id].push({
      id: Date.now(), // unique favorite item id
      ...validatedData,
      addedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: 'Item added to favorites',
      favorites: userFavorites[user.id],
      authenticated: true
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Add to favorites error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      authenticated: false,
      favorites: []
    }, { status: 500 })
  }
}

// DELETE /api/favorites - Remove item from favorites
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        authenticated: false,
        favorites: [] 
      }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid token', 
        authenticated: false,
        favorites: [] 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const favoriteItemId = searchParams.get('favoriteItemId')

    if (!favoriteItemId) {
      return NextResponse.json({ error: 'Favorite item ID required' }, { status: 400 })
    }

    if (!userFavorites[user.id]) {
      return NextResponse.json({ 
        error: 'Favorites not found', 
        favorites: [],
        authenticated: true
      }, { status: 404 })
    }

    const initialLength = userFavorites[user.id].length
    userFavorites[user.id] = userFavorites[user.id].filter(item => item.id !== parseInt(favoriteItemId))

    if (userFavorites[user.id].length === initialLength) {
      return NextResponse.json({ 
        error: 'Item not found in favorites', 
        favorites: userFavorites[user.id],
        authenticated: true
      }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Item removed from favorites',
      favorites: userFavorites[user.id],
      authenticated: true
    })
  } catch (error) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      authenticated: false,
      favorites: []
    }, { status: 500 })
  }
}