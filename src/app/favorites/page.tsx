'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowLeft, Heart, ShoppingBag, Star, Filter, Grid, List, TrendingUp, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFavorites } from '@/lib/favorites-context'
import { useCart } from '@/lib/cart-context'

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { addToCart } = useCart()

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredFavorites = favorites.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleToggleFavorite = (product: any) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const addAllToCart = () => {
    favorites.forEach(product => addToCart(product))
  }

  const totalValue = favorites.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = favorites.reduce((sum, item) => {
    const savings = item.originalPrice ? item.originalPrice - item.price : 0
    return sum + savings
  }, 0)

  const categories = [...new Set(favorites.map(item => item.category))]
  const brands = [...new Set(favorites.map(item => item.brand))]

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">My Favorites</h1>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {favorites.length} items
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 border-gray-300"
                  />
                </div>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Recently Added</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Link href="/products">
                <Button variant="outline" className="border-gray-300">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-500 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
                <p className="text-gray-600 mb-6">
                  Start adding your favorite products to create your personal collection!
                </p>
              </div>
              <div className="space-y-3">
                <Link href="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Explore Products
                  </Button>
                </Link>
                <Link href="/deals">
                  <Button variant="outline" className="w-full">
                    View Today's Deals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-500 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No favorites found</h3>
                <p>Try adjusting your search terms</p>
              </div>
              <Button 
                onClick={() => setSearchQuery('')} 
                variant="outline"
              >
                Clear search
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-8 h-8 text-red-500 mr-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {favorites.length}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Total Favorites</div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600 mr-2" />
                    <div className="text-2xl font-bold text-green-600">
                      ৳{totalValue.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="w-8 h-8 text-blue-600 mr-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {categories.length}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-orange-600 font-bold text-sm">৳</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      ৳{totalSavings.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </CardContent>
              </Card>
            </div>

            {/* Category and Brand Pills */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Categories:</span>
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-gray-100 text-gray-700">
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-gray-600 mr-2">Brands:</span>
                {brands.slice(0, 5).map((brand) => (
                  <Badge key={brand} variant="outline" className="border-gray-300">
                    {brand}
                  </Badge>
                ))}
                {brands.length > 5 && (
                  <Badge variant="outline" className="border-gray-300">
                    +{brands.length - 5} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-4 gap-6'
                : 'space-y-6'
            }>
              {filteredFavorites.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
                  {viewMode === 'grid' ? (
                    <Link href={`/products/${product.id}`}>
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            -{product.discount}%
                          </span>
                        )}
                        <Button
                          size="sm"
                          className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => {
                            e.preventDefault()
                            handleToggleFavorite(product)
                          }}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">({product.reviews || 128})</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ৳{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(product)
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              handleToggleFavorite(product)
                            }}
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Link href={`/products/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-2">{product.description}</p>
                          <p className="text-sm text-gray-600 mb-3">{product.brand}</p>
                          <div className="flex items-center mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({product.reviews || 128} reviews)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold text-gray-900">${product.price}</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAddToCart(product)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                              >
                                <ShoppingBag className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                onClick={() => handleToggleFavorite(product)}
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <Heart className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto border border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Ready to make a purchase?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add all your favorites to cart or continue shopping for more amazing products.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={addAllToCart}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add All to Cart (${totalValue.toFixed(2)})
                    </Button>
                    <Link href="/cart">
                      <Button variant="outline" className="border-gray-300">
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="border-gray-300">
                        Continue Shopping
                      </Button>
                </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}