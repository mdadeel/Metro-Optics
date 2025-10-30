import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// Mock cart database - in production, this would be a real database
const userCarts: { [userId: number]: CartItem[] } = {}

const cartItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string(),
})

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const cart = userCarts[user.id] || []
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = cartItemSchema.parse(body)

    if (!userCarts[user.id]) {
      userCarts[user.id] = []
    }

    // Check if item already exists in cart
    const existingItemIndex = userCarts[user.id].findIndex(item => item.productId === validatedData.productId)
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      userCarts[user.id][existingItemIndex].quantity += validatedData.quantity
    } else {
      // Add new item
      userCarts[user.id].push({
        id: Date.now(), // unique cart item id
        ...validatedData
      })
    }

    return NextResponse.json({ 
      message: 'Item added to cart',
      cart: userCarts[user.id]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/cart - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItemId, quantity } = body

    if (!userCarts[user.id]) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const itemIndex = userCarts[user.id].findIndex(item => item.id === cartItemId)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      userCarts[user.id].splice(itemIndex, 1)
    } else {
      // Update quantity
      userCarts[user.id][itemIndex].quantity = quantity
    }

    return NextResponse.json({ 
      message: 'Cart updated',
      cart: userCarts[user.id]
    })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(authToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 })
    }

    if (!userCarts[user.id]) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const initialLength = userCarts[user.id].length
    userCarts[user.id] = userCarts[user.id].filter(item => item.id !== parseInt(cartItemId))

    if (userCarts[user.id].length === initialLength) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Item removed from cart',
      cart: userCarts[user.id]
    })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}