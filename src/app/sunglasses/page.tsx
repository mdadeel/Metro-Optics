'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Star, Sun, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'

export default function SunglassesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [selectedProtection, setSelectedProtection] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [sunglasses, setSunglasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    async function fetchSunglasses() {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=sunglasses', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setSunglasses(data)
        }
      } catch (error) {
        console.error('Failed to fetch sunglasses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSunglasses()
  }, [])

  const filteredSunglasses = sunglasses.filter(glasses => {
    const matchesSearch = glasses.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStyle = selectedStyle === 'all' || glasses.style === selectedStyle
    const matchesProtection = selectedProtection === 'all' || glasses.protection === selectedProtection
    return matchesSearch && matchesStyle && matchesProtection
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
                <h1 className="text-xl font-bold text-gray-900">Sunglasses</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search sunglasses..."
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
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">UV Protection Meets Style</h2>
            <p className="text-xl mb-6">Premium sunglasses with 100% UV protection. Look sharp while staying safe.</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>UV400 Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>4.9/5 Customer Rating</span>
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
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Styles</option>
              <option value="aviator">Aviator</option>
              <option value="wayfarer">Wayfarer</option>
              <option value="cat-eye">Cat Eye</option>
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="sport">Sport</option>
              <option value="oversized">Oversized</option>
            </select>
            <select
              value={selectedProtection}
              onChange={(e) => setSelectedProtection(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Protection Levels</option>
              <option value="uv400">UV400</option>
              <option value="polarized">Polarized</option>
              <option value="photochromic">Photochromic</option>
              <option value="mirrored">Mirrored</option>
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
            {filteredSunglasses.map((glasses: any) => (
              <Card key={glasses.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={glasses.image}
                      alt={glasses.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {glasses.discount && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{glasses.discount}%
                      </div>
                    )}
                    {glasses.polarized && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        POLARIZED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {glasses.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
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
                          {glasses.style || 'Classic'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {glasses.protection || 'UV400'}
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

        {filteredSunglasses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🕶️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sunglasses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}