'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface FavoriteItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description?: string
  discount?: number
  rating?: number
  reviews?: number
  brand?: string
}

interface FavoritesState {
  items: FavoriteItem[]
  itemCount: number
}

type FavoritesAction =
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteItem }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }

const FavoritesContext = createContext<{
  state: FavoritesState
  addToFavorites: (product: Omit<FavoriteItem, 'id'> & { id?: number }) => void
  removeFromFavorites: (id: number) => void
  clearFavorites: () => void
  isFavorite: (id: number) => boolean
  favorites: FavoriteItem[]
  getFavoritesCount: () => number
} | null>(null)

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_TO_FAVORITES': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state // Item already exists
      }
      
      const newItems = [...state.items, action.payload]
      
      return { items: newItems, itemCount: newItems.length }
    }
    
    case 'REMOVE_FROM_FAVORITES': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      
      return { items: newItems, itemCount: newItems.length }
    }
    
    case 'CLEAR_FAVORITES':
      return { items: [], itemCount: 0 }
    
    case 'LOAD_FAVORITES': {
      return { items: action.payload, itemCount: action.payload.length }
    }
    
    default:
      return state
  }
}

const initialState: FavoritesState = {
  items: [],
  itemCount: 0
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  // Load favorites from API on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          dispatch({ type: 'LOAD_FAVORITES', payload: data.favorites || [] })
        }
      } catch (error) {
        console.error('Failed to load favorites from API:', error)
        // Fallback to localStorage for demo purposes
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites)
            dispatch({ type: 'LOAD_FAVORITES', payload: parsedFavorites })
          } catch (error) {
            console.error('Failed to load favorites from localStorage:', error)
          }
        }
      }
    }
    
    loadFavorites()
  }, [])

  // Save favorites to localStorage whenever they change (fallback)
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(state.items))
  }, [state.items])

  const addToFavorites = async (product: Omit<FavoriteItem, 'id'> & { id?: number }) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          discount: product.discount
        }),
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'LOAD_FAVORITES', payload: data.favorites })
      } else {
        // Fallback to local state
        dispatch({ type: 'ADD_TO_FAVORITES', payload: product })
      }
    } catch (error) {
      console.error('Failed to add to favorites via API:', error)
      // Fallback to local state
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product })
    }
  }

  const removeFromFavorites = async (id: number) => {
    try {
      // Find the favorite item ID (different from product ID)
      const favoriteItem = state.items.find(item => item.id === id)
      if (favoriteItem && 'favoriteItemId' in favoriteItem) {
        const response = await fetch(`/api/favorites?favoriteItemId=${favoriteItem.favoriteItemId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          dispatch({ type: 'LOAD_FAVORITES', payload: data.favorites })
          return
        }
      }
      
      // Fallback to local state
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id })
    } catch (error) {
      console.error('Failed to remove from favorites via API:', error)
      // Fallback to local state
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id })
    }
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  const isFavorite = (id: number) => {
    return state.items.some(item => item.id === id)
  }

  const getFavoritesCount = () => state.itemCount

  return (
    <FavoritesContext.Provider value={{
      state,
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
      isFavorite,
      favorites: state.items,
      getFavoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}