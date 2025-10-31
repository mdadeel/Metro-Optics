'use client';

import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  gender: string[];
  age: string[];
  frameType: string;
  material: string;
  color: string;
  shape: string;
  features: string[];
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  // Favorites
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  
  // User
  user: {
    name: string;
    email: string;
    isLoggedIn: boolean;
  } | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Favorites
      favorites: [],
      addToFavorites: (product) => {
        set((state) => {
          const exists = state.favorites.some((item) => item.id === product.id);
          if (!exists) {
            return { favorites: [...state.favorites, product] };
          }
          return state;
        });
      },
      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        }));
      },
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.some((item) => item.id === productId);
      },

      // User
      user: null,
      login: (email, name) => {
        set({ user: { email, name, isLoggedIn: true } });
      },
      logout: () => {
        set({ user: null });
      },

}));