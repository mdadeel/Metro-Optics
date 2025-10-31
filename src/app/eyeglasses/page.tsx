'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'

export default function EyeglassesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFrame, setSelectedFrame] = useState('all')
  const [selectedMaterial, setSelectedMaterial] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  type EyeglassesProduct = {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    image: string;
    type: string;
    description: string;
    inStock: boolean;
    category: string;
    frameType?: string;
    lensType?: string;
    material?: string;
    isNew?: boolean;
  };
  const [eyeglasses, setEyeglasses] = useState<EyeglassesProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    async function fetchEyeglasses() {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=eyeglasses', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setEyeglasses(data)
        }
      } catch (error) {
        console.error('Failed to fetch eyeglasses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEyeglasses()
  }, [])

  const filteredEyeglasses = eyeglasses.filter(glasses => {
    const matchesSearch = glasses.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFrame = selectedFrame === 'all' || glasses.frameType === selectedFrame
    const matchesMaterial = selectedMaterial === 'all' || glasses.material === selectedMaterial
    return matchesSearch && matchesFrame && matchesMaterial
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="Metro Optics Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Eyeglasses</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search eyeglasses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Perfect Vision, Perfect Style</h2>
            <p className="text-xl mb-6">Discover our premium collection of eyeglasses designed for clarity and comfort.</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>100% Vision Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>4.8/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Filters:</span>
            </div>
            <select
              value={selectedFrame}
              onChange={(e) => setSelectedFrame(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Frame Types</option>
              <option value="full-rim">Full Rim</option>
              <option value="half-rim">Half Rim</option>
              <option value="rimless">Rimless</option>
              <option value="cat-eye">Cat Eye</option>
              <option value="aviator">Aviator</option>
              <option value="round">Round</option>
              <option value="square">Square</option>
            </select>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Materials</option>
              <option value="acetate">Acetate</option>
              <option value="metal">Metal</option>
              <option value="titanium">Titanium</option>
              <option value="plastic">Plastic</option>
              <option value="wood">Wood</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEyeglasses.map((glasses: EyeglassesProduct) => (
              <Card key={glasses.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={glasses.image}
                      alt={glasses.name}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {glasses.discount && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{glasses.discount}%
                      </div>
                    )}
                    {glasses.isNew && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {glasses.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(glasses.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">({glasses.reviews || 128})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-900">৳{glasses.price}</span>
                        {glasses.originalPrice && glasses.originalPrice > glasses.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">৳{glasses.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {glasses.frameType || 'Full Rim'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {glasses.material || 'Acetate'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(glasses)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToFavorites(glasses)}
                        className={isFavorite(glasses.id) ? 'text-red-600 border-red-600' : ''}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredEyeglasses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No eyeglasses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}