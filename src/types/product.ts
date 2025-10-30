export interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  image: string
  images?: string[]
  rating: number
  reviews: number
  inStock: boolean
  badge?: string
  description: string
  gender?: string[]
  age?: string[]
  frameType?: string
  material?: string
  color?: string
  shape?: string
  features?: string[]
}


