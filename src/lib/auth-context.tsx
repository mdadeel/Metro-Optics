'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'
import { handleApiError, safeApiCall } from '@/lib/error-handler'

interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  memberSince: string
  totalOrders: number
  totalSpent: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const result = await safeApiCall(async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (!response.ok) {
        if (response.status === 401) {
          return null; // Not logged in, not an error
        }
        throw new Error(`Auth check failed: ${response.status}`)
      }
      return response.json()
    })
    
    if (result.data) {
      setUser(result.data.user)
    } else if (result.error) {
      console.error('Auth check error:', result.error)
    }
    
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    const result = await safeApiCall(async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      return response.json()
    })

    if (result.data) {
      setUser(result.data.user)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.data.user.name}!`,
      })
      return { success: true }
    } else {
      return { success: false, error: result.error }
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    const result = await safeApiCall(async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      return response.json()
    })

    if (result.data) {
      setUser(result.data.user)
      toast({
        title: "Registration Successful",
                  description: `Welcome to Metro Optics, ${result.data.user.name}!`,      })
      return { success: true }
    } else {
      return { success: false, error: result.error }
    }
  }

  const logout = async () => {
    const result = await safeApiCall(async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`)
      }
      
      return response.json()
    })
    
    setUser(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}