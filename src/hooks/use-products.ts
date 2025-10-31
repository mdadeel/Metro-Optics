import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types/product'

// API functions
const fetchProducts = async (params?: {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  search?: string
}): Promise<Product[]> => {
  const searchParams = new URLSearchParams()
  
  if (params?.category) searchParams.append('category', params.category)
  if (params?.brand) searchParams.append('brand', params.brand)
  if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString())
  if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  if (params?.search) searchParams.append('search', params.search)

  const response = await fetch(`/api/products?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

const fetchProduct = async (slug: string): Promise<Product> => {
  const response = await fetch(`/api/products/${slug}`)
  if (!response.ok) {
    throw new Error('Product not found')
  }
  return response.json()
}

const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error('Search failed')
  }
  const data = await response.json()
  return data.products || data
}

// Custom hooks
export const useProducts = (params?: {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  })
}

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  })
}

export const useSearchProducts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchProducts(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled && query.length > 2,
  })
}

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ limit: 8 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProducts({ category }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category,
  })
}

export const useProductsByBrand = (brand: string) => {
  return useQuery({
    queryKey: ['products', 'brand', brand],
    queryFn: () => fetchProducts({ brand }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!brand,
  })
}
