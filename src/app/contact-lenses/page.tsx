'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Star, Eye as ContactIcon, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'

export default function ContactLensesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedUsage, setSelectedUsage] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [contactLenses, setContactLenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    async function fetchContactLenses() {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=contact-lenses', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setContactLenses(data)
        }
      } catch (error) {
        console.error('Failed to fetch contact lenses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContactLenses()
  }, [])

  const filteredContactLenses = contactLenses.filter(lens => {
    const matchesSearch = lens.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || lens.type === selectedType
    const matchesUsage = selectedUsage === 'all' || lens.usage === selectedUsage
    return matchesSearch && matchesType && matchesUsage
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
                <h1 className="text-xl font-bold text-gray-900">Contact Lenses</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search contact lenses..."
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Crystal Clear Vision</h2>
            <p className="text-xl mb-6">Premium contact lenses for ultimate comfort and clarity. Free consultation included.</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <span>High Moisture Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>4.7/5 Customer Rating</span>
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="soft">Soft Lenses</option>
              <option value="rigid">Rigid Gas Permeable</option>
              <option value="toric">Toric (Astigmatism)</option>
              <option value="multifocal">Multifocal</option>
              <option value="colored">Colored</option>
            </select>
            <select
              value={selectedUsage}
              onChange={(e) => setSelectedUsage(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Usage Types</option>
              <option value="daily">Daily Disposable</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
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
            {filteredContactLenses.map((lens: any) => (
              <Card key={lens.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={lens.image}
                      alt={lens.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {lens.discount && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{lens.discount}%
                      </div>
                    )}
                    {lens.isBestseller && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        BESTSELLER
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {lens.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(lens.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">({lens.reviews || 128})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-900">৳{lens.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/ {lens.packageSize || '30'} lenses</span>
                        {lens.originalPrice && lens.originalPrice > lens.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">৳{lens.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {lens.type || 'Soft'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lens.usage || 'Daily'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(lens)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToFavorites(lens)}
                        className={isFavorite(lens.id) ? 'text-red-600 border-red-600' : ''}
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

        {filteredContactLenses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No contact lenses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}