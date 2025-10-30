'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { handleApiError, safeApiCall } from '@/lib/error-handler'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  quantity: number
  description?: string
  discount?: number
  rating?: number
  reviews?: number
  brand?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addToCart: (product: any) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  cart: CartItem[]
  getCartCount: () => number
  getCartTotal: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let newItems: CartItem[]
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: newItems, total, itemCount }
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: newItems, total, itemCount }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: newItems, total, itemCount }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }
    
    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: action.payload, total, itemCount }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      const result = await safeApiCall(async () => {
        const response = await fetch('/api/cart', {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Failed to load cart: ${response.status}`)
        }
        const data = await response.json()
        return data.cart || []
      })
      
      if (result.data) {
        dispatch({ type: 'LOAD_CART', payload: result.data })
      } else if (result.error) {
        console.error('Cart load error:', result.error)
        // Fallback to localStorage for demo purposes
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            dispatch({ type: 'LOAD_CART', payload: parsedCart })
          } catch (parseError) {
            console.error('Failed to parse saved cart:', parseError)
          }
        }
      }
    }
    
    loadCart()
  }, [])

  // Save cart to localStorage whenever it changes (fallback)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = async (product: any) => {
    const result = await safeApiCall(async () => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`)
      }
      
      return response.json()
    })
    
    if (result.data) {
      dispatch({ type: 'LOAD_CART', payload: result.data.cart })
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    } else {
      // Fallback to local state
      dispatch({ type: 'ADD_TO_CART', payload: product })
      toast({
        title: "Added to Cart",
        description: `${product.name} added locally (sync when online)`,
        variant: "default",
      })
    }
  }

  const removeFromCart = async (id: number) => {
    const cartItem = state.items.find(item => item.id === id)
    const itemName = cartItem?.name || 'Item'
    
    const result = await safeApiCall(async () => {
      if (cartItem && 'cartItemId' in cartItem) {
        const response = await fetch(`/api/cart?cartItemId=${cartItem.cartItemId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to remove from cart: ${response.status}`)
        }
        
        return response.json()
      }
      throw new Error('Cart item not found')
    })
    
    if (result.data) {
      dispatch({ type: 'LOAD_CART', payload: result.data.cart })
      toast({
        title: "Removed from Cart",
        description: `${itemName} has been removed from your cart`,
      })
    } else {
      // Fallback to local state
      dispatch({ type: 'REMOVE_FROM_CART', payload: id })
      toast({
        title: "Removed from Cart",
        description: `${itemName} removed locally`,
        variant: "default",
      })
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    const cartItem = state.items.find(item => item.id === id)
    
    const result = await safeApiCall(async () => {
      if (cartItem && 'cartItemId' in cartItem) {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItemId: cartItem.cartItemId,
            quantity
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to update cart: ${response.status}`)
        }
        
        return response.json()
      }
      throw new Error('Cart item not found')
    })
    
    if (result.data) {
      dispatch({ type: 'LOAD_CART', payload: result.data.cart })
    } else {
      // Fallback to local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartCount = () => state.itemCount
  const getCartTotal = () => state.total

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cart: state.items,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}