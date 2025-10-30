'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Star, ChevronDown, SlidersHorizontal, X, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'

interface Product {
  id: number
  slug: string
  name: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  image: string
  rating: number
  reviews: number
  discount?: number
  description: string
  inStock: boolean
  badge?: string
}

interface Filters {
  category: string
  brand: string
  priceRange: number[]
  rating: number
  inStock: boolean
  sortBy: string
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const [filters, setFilters] = useState<Filters>({
    category: '',
    brand: '',
    priceRange: [0, 5000],
    rating: 0,
    inStock: true,
    sortBy: 'featured'
  })

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        
        // Build query string from filters
        const queryParams = new URLSearchParams()
        
        if (filters.category) queryParams.append('category', filters.category)
        if (filters.brand) queryParams.append('brand', filters.brand)
        if (filters.priceRange[0] > 0) queryParams.append('minPrice', filters.priceRange[0].toString())
        if (filters.priceRange[1] < 5000) queryParams.append('maxPrice', filters.priceRange[1].toString())
        if (filters.rating > 0) queryParams.append('rating', filters.rating.toString())
        if (filters.inStock) queryParams.append('inStock', 'true')
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
        if (searchQuery) queryParams.append('search', searchQuery)
        
        const response = await fetch(`/api/products?${queryParams.toString()}`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          setTotalPages(Math.ceil(data.length / 12))
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [filters, searchQuery])

  const categories = [
    { name: 'Eyeglasses', count: 1245 },
    { name: 'Sunglasses', count: 892 },
    { name: 'Contact Lenses', count: 456 },
    { name: 'Kids Collection', count: 234 }
  ]

  const brands = [
    { name: 'Ray-Ban', count: 234 },
    { name: 'Oakley', count: 189 },
    { name: 'Gucci', count: 156 },
    { name: 'Warby Parker', count: 145 },
    { name: 'Nike', count: 98 },
    { name: 'Disney', count: 67 },
    { name: 'Persol', count: 89 },
    { name: 'Prada', count: 76 }
  ]

  const priceRanges = [
    { label: 'Under ৳2000', min: 0, max: 2000 },
    { label: '৳2000 to ৳4000', min: 2000, max: 4000 },
    { label: '৳4000 to ৳6000', min: 4000, max: 6000 },
    { label: 'Over ৳6000', min: 6000, max: 10000 }
  ]

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }

    // Rating filter
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false
    }

    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const addToCartHandler = (product: Product) => {
    addToCart(product)
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 5000],
      rating: 0,
      inStock: true,
      sortBy: 'featured'
    })
  }

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const activeFilterCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== true
  ).length

  const productsPerPage = 12
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

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
              <Link href="/" className="text-2xl font-bold text-gray-900">Metro Optics</Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-700">All Eyewear</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search eyeglasses, sunglasses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-gray-300"
                  />
                </div>
              </div>

              {/* Sort */}
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
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

              {/* Mobile Filter */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterPanel
                    filters={filters}
                    categories={categories}
                    brands={brands}
                    priceRanges={priceRanges}
                    updateFilter={updateFilter}
                    clearFilters={clearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-600">
                    Clear all
                  </Button>
                )}
              </div>
              <FilterPanel
                filters={filters}
                categories={categories}
                brands={brands}
                priceRanges={priceRanges}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Search and Filter Bar */}
            <div className="lg:hidden mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
                <div className="flex items-center gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger className="w-32 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low</SelectItem>
                      <SelectItem value="price-high">Price: High</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none px-2"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none px-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProducts.length} Products Found
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
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
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-6 opacity-50 text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms, or explore our full collection.</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={clearFilters} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Clear Filters
                  </Button>
                  <Link href="/products">
                    <Button variant="outline">
                      Go back to all products
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-4 gap-6'
                    : 'space-y-6'
                }>
                  {paginatedProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
                      {viewMode === 'grid' ? (
                        <Link href={`/products/${product.slug}`}>
                          <div className="relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={250}
                              height={250}
                              className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.discount && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                -{product.discount}%
                              </span>
                            )}
                            {product.badge && (
                              <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                {product.badge}
                              </span>
                            )}
                            <Button
                              size="sm"
                              className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(product)
                              }}
                            >
                              <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current text-red-500' : ''}`} />
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
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                addToCartHandler(product)
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                              disabled={!product.inStock}
                            >
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </CardContent>
                        </Link>
                      ) : (
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <Link href={`/products/${product.slug}`}>
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={150}
                                height={150}
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </Link>
                            <div className="flex-1">
                              <Link href={`/products/${product.slug}`}>
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
                                      className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
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
                                    onClick={() => toggleFavorite(product)}
                                    variant="outline"
                                    size="sm"
                                    className={isFavorite(product.id) ? 'border-red-500 text-red-500' : 'border-gray-300'}
                                  >
                                    <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                                  </Button>
                                  <Button
                                    onClick={() => addToCartHandler(product)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                    disabled={!product.inStock}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(i + 1)}
                        className="w-10"
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ filters, categories, brands, priceRanges, updateFilter, clearFilters }: any) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category: any) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id={category.name}
                  checked={filters.category === category.name}
                  onCheckedChange={(checked) => 
                    updateFilter('category', checked ? category.name : '')
                  }
                />
                <label htmlFor={category.name} className="ml-2 text-sm text-gray-700">
                  {category.name}
                </label>
              </div>
              <span className="text-xs text-gray-500">({category.count})</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand: any) => (
            <div key={brand.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id={brand.name}
                  checked={filters.brand === brand.name}
                  onCheckedChange={(checked) => 
                    updateFilter('brand', checked ? brand.name : '')
                  }
                />
                <label htmlFor={brand.name} className="ml-2 text-sm text-gray-700">
                  {brand.name}
                </label>
              </div>
              <span className="text-xs text-gray-500">({brand.count})</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={5000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {priceRanges.map((range: any) => (
            <Button
              key={range.label}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => updateFilter('priceRange', [range.min, range.max])}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) => 
                  updateFilter('rating', checked ? rating : 0)
                }
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-1">& up</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
        <div className="flex items-center">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => 
              updateFilter('inStock', checked)
            }
          />
          <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
            In Stock Only
          </label>
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  )
}