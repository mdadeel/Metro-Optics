'use client'

import { useState, useEffect } from 'react'
import { useFeaturedProducts, useSearchProducts } from '@/hooks/use-products'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Star, Truck, Shield, RefreshCw, Globe, CreditCard, ArrowRight, Sparkles, TrendingUp, Package, Eye, Glasses, MapPin, Phone, Mail, Sun, Eye as ContactIcon, Baby, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useAuth } from '@/lib/auth-context'
import FeaturedProducts from '@/components/ui/featured-products'
import { CategoryCardSkeleton, FeatureCardSkeleton } from '@/components/ui/skeleton-loader'
import { ProductCardSkeleton, SearchLoading, EmptyStateWithLoading } from '@/components/ui/loading-states'
import { getPlaceholderUrl } from '@/lib/image-generator'
import { generateAriaLabel, handleKeyboardNavigation, announceToScreenReader } from '@/lib/accessibility'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { cart } = useCart()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()
  
  // Use React Query for data fetching
  const { data: products = [], isLoading: productsLoading, error: productsError } = useFeaturedProducts()
  const { data: searchResults = [], isLoading: isSearching } = useSearchProducts(searchQuery, searchQuery.length > 2)
  
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [featuresLoading, setFeaturesLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for categories and features (static data)
    setTimeout(() => {
      setCategoriesLoading(false)
      setFeaturesLoading(false)
    }, 500)
  }, [])

  // Update search results display when React Query data changes
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowSearchResults(true)
    } else if (searchQuery.length <= 2) {
      setShowSearchResults(false)
    }
  }, [searchResults, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleProductClick = (productId: number) => {
    setShowSearchResults(false)
    setSearchQuery('')
    window.location.href = `/products/${productId}`
  }

  

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const heroSlides = [
    {
      title: "Premium Eyewear",
      subtitle: "2024 Collection",
      description: "Discover our curated selection of international brands with authentic quality and modern designs.",
      cta: "View All Products",
      bgImage: getPlaceholderUrl(1920, 600, "Minimal eyeglasses display"),
      badge: "NEW ARRIVAL"
    }
  ]

  const categories = [
    { 
      name: 'Eyeglasses', 
      icon: Glasses, 
      image: getPlaceholderUrl(300, 200, "Eyeglasses"),
      itemCount: '1,245',
      color: 'bg-blue-500',
      description: 'Perfect vision correction'
    },
    { 
      name: 'Sunglasses', 
      icon: Sun, 
      image: getPlaceholderUrl(300, 200, "Sunglasses"),
      itemCount: '892',
      color: 'bg-yellow-500',
      description: 'UV protection & style'
    },
    { 
      name: 'Contact Lenses', 
      icon: ContactIcon, 
      image: getPlaceholderUrl(300, 200, "Contact Lenses"),
      itemCount: '456',
      color: 'bg-purple-500',
      description: 'Comfortable vision'
    },
    { 
      name: 'Kids Collection', 
      icon: Baby, 
      image: getPlaceholderUrl(300, 200, "Kids Collection"),
      itemCount: '234',
      color: 'bg-green-500',
      description: 'Durable & fun designs'
    }
  ]

  const features = [
    { 
      icon: Truck, 
      title: 'Free Delivery Bangladesh', 
      description: 'On orders above ৳2000',
      color: 'text-blue-600'
    },
    { 
      icon: Shield, 
      title: '100% Authentic Products', 
      description: 'Genuine international brands',
      color: 'text-green-600'
    },
    { 
      icon: Eye, 
      title: 'Free Eye Testing', 
      description: 'At our Dhaka showroom',
      color: 'text-purple-600'
    },
    { 
      icon: RefreshCw, 
      title: '7-Day Returns', 
      description: 'Hassle-free returns policy',
      color: 'text-orange-600'
    }
  ]

  const trustBadges = [
    { name: 'Secure Shopping', icon: Shield },
    { name: 'Authentic Frames', icon: Glasses },
    { name: 'Expert Support', icon: TrendingUp },
    { name: 'Bangladesh Delivery', icon: Truck }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Announcement Bar - Enhanced Mobile */}
      <div className="bg-blue-600 text-white py-2 px-3 sm:px-4 text-center overflow-hidden relative">
        <div className="flex items-center justify-center animate-marquee">
          <Sparkles className="h-3 w-3 mr-1 sm:mr-2 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="hidden sm:inline">চশ্মা মেলা:</span>
            <span className="sm:hidden">চশ্মা মেলা:</span> Up to 50% off + Free Delivery | Code: VISION2024
          </p>
        </div>
      </div>

      {/* Header - Enhanced Mobile Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden flex items-center justify-center w-10 h-10 p-0 hover:bg-gray-100 touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </Button>

            {/* Logo - Enhanced Mobile */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-1 lg:flex-none justify-center lg:justify-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Glasses className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Metro Optics</h1>
                <p className="text-xs text-gray-500">Bangladesh Optical Shop</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Metro Optics</h1>
              </div>
            </Link>

            {/* Mobile Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
              <Link href="/favorites" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
                <Star className="h-5 w-5 text-gray-700" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4 sm:mx-8">
              <div className="relative w-full group">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      onKeyDown={(e) => handleKeyboardNavigation(e, {
                        onEscape: () => {
                          setIsSearchFocused(false)
                          setSearchQuery('')
                        },
                        onArrowDown: () => {
                          if (searchResults.length > 0) {
                            // Focus first search result
                            const firstResult = document.querySelector('[data-search-result="0"]') as HTMLElement
                            firstResult?.focus()
                          }
                        }
                      })}
                      placeholder="Search eyeglasses, sunglasses & lenses..."
                      aria-label={generateAriaLabel('search', 'products')}
                      aria-expanded={showSearchResults}
                      aria-controls="search-results"
                      aria-autocomplete="list"
                      role="combobox"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isSearchFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                      }`}
                    />
                    <Button 
                      type="submit"
                      className="absolute inset-y-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-l-none h-full px-4 sm:px-6 text-sm sm:text-base"
                    >
                      Search
                    </Button>
                  </div>
                </form>
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div 
                    id="search-results"
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                    role="listbox"
                    aria-label="Search results"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500" role="status" aria-live="polite">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2" role="presentation">
                        {searchResults.map((product: any, index) => (
                          <div
                            key={product.id}
                            data-search-result={index}
                            onClick={() => handleProductClick(product.id)}
                            onKeyDown={(e) => handleKeyboardNavigation(e, {
                              onEnter: () => handleProductClick(product.id),
                              onSpace: () => handleProductClick(product.id),
                              onArrowDown: () => {
                                const nextResult = document.querySelector(`[data-search-result="${index + 1}"]`) as HTMLElement
                                nextResult?.focus()
                              },
                              onArrowUp: () => {
                                const prevResult = document.querySelector(`[data-search-result="${index - 1}"]`) as HTMLElement
                                prevResult?.focus()
                              }
                            })}
                            tabIndex={0}
                            role="option"
                            aria-selected={false}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              loading="lazy"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">৳{product.price}</p>
                              {product.discount && (
                                <p className="text-xs text-red-600">-{product.discount}%</p>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="px-4 py-2 border-t border-gray-100">
                          <button
                            onClick={handleSearch}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded"
                          >
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      </div>
                    ) : searchQuery.length > 2 ? (
                      <div className="p-6 text-center text-gray-500" role="status" aria-live="polite">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found for "{searchQuery}"</h3>
                        <p className="text-sm text-gray-600">Try a different search term or browse our categories.</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link href="/deals" className="text-red-600 hover:text-red-700 font-semibold flex items-center text-sm lg:text-base">
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Deals</span>
                <span className="lg:hidden">Hot</span>
              </Link>
              
              <Link href="/favorites" className="relative text-gray-700 hover:text-blue-600 transition-colors flex items-center group">
                <Star className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium ml-1 hidden lg:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {favorites.length}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors flex items-center group">
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium ml-1 hidden lg:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium ml-1 hidden lg:inline">Dashboard</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium ml-1 hidden lg:inline">Account</span>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

  

          {/* Mobile Search */}
          <div className="md:hidden pb-3 pt-2">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    placeholder="Search for eyeglasses..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </form>
              
              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-1"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product: any) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">৳{product.price}</p>
                            {product.discount && (
                              <p className="text-xs text-red-600">-{product.discount}%</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="px-3 py-2 border-t border-gray-100">
                        <button
                          onClick={handleSearch}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          View all results
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.length > 2 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <Search className="w-10 h-10 mx-auto mb-2 opacity-50 text-gray-400" />
                      <h3 className="font-semibold text-gray-800 mb-1">No products found</h3>
                      <p className="text-xs text-gray-600">Try a different search term.</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-in-left">
            {/* Mobile Search Bar */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="Search eyeglasses, sunglasses..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    />
                  </div>
                </form>
                
                {/* Mobile Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-1"></div>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((product: any) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 touch-manipulation"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-gray-900 text-sm">৳{product.price}</p>
                              {product.discount && (
                                <p className="text-xs text-red-600">-{product.discount}%</p>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="px-3 py-2 border-t border-gray-100">
                          <button
                            onClick={handleSearch}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium w-full text-center py-1"
                          >
                            View all results
                          </button>
                        </div>
                      </div>
                    ) : searchQuery.length > 2 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        <Search className="w-10 h-10 mx-auto mb-2 opacity-50 text-gray-400" />
                        <h3 className="font-semibold text-gray-800 mb-1">No products found</h3>
                        <p className="text-xs text-gray-600">Try a different search term.</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="px-2 py-2 space-y-1">
              <Link
                href="/deals"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Hot Deals</span>
                  <p className="text-xs text-red-500">Limited time offers</p>
                </div>
                <ChevronDown className="h-4 w-4 text-red-400 rotate-270" />
              </Link>
              
              <Link
                href="/eyeglasses"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Glasses className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Eyeglasses</span>
                  <p className="text-xs text-gray-500">Vision correction</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
              </Link>
              
              <Link
                href="/sunglasses"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sun className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Sunglasses</span>
                  <p className="text-xs text-gray-500">UV protection</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
              </Link>
              
              <Link
                href="/contact-lenses"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Contact Lenses</span>
                  <p className="text-xs text-gray-500">Comfortable vision</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <Link
                href="/favorites"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center relative">
                  <Star className="h-5 w-5 text-pink-600" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Favorites</span>
                  <p className="text-xs text-gray-500">
                    {favorites.length > 0 ? `${favorites.length} saved items` : 'Save items'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
              </Link>
              
              <Link
                href="/cart"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center relative">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">Shopping Cart</span>
                  <p className="text-xs text-gray-500">
                    {cartItemsCount > 0 ? `${cartItemsCount} items` : 'Empty cart'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
              </Link>
              
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">My Dashboard</span>
                    <p className="text-xs text-gray-500">Orders & Account</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 rotate-270" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 touch-manipulation shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Sign In</span>
                    <p className="text-xs text-white/80">Account access</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/60 rotate-270" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section - Mobile First */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroSlides[0].bgImage}
            alt={heroSlides[0].title}
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
            quality={85}
          />
        </div>
        
        {/* Overlay Gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="animate-fade-in">
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  {heroSlides[0].badge}
                </span>
              </div>
              
              <div className="animate-fade-in-up-smooth animate-stagger-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {heroSlides[0].title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
                  {heroSlides[0].description}
                </p>
              </div>
              
              <div className="animate-fade-in-up-smooth animate-stagger-2 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Shop Now
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 touch-manipulation"
                  asChild
                >
                  <Link href="#featured">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    View Collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        

      </section>

      {/* Features Section - Enhanced Mobile */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Metro Optics?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for premium eyewear in Bangladesh
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="group p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ${feature.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-gray-600">
                <badge.icon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <div className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <FeaturedProducts />
        </div>
      </div>

      {/* Categories */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Premium eyewear for every need and style</p>
            </div>
            <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-medium flex items-center mt-3 sm:mt-0 text-sm sm:text-base">
              View All Categories
              <ChevronDown className="ml-1 h-4 w-4 rotate-270" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categoriesLoading ? (
              <CategoryCardSkeleton count={4} />
            ) : (
              categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className={`group relative overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover-lift-subtle animate-fade-in-up-smooth animate-stagger-${index + 1}`}
                >
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                      <category.icon className="h-8 w-8 sm:h-10 sm:w-10 mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-sm sm:text-base font-semibold text-center group-hover:scale-105 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-xs text-white/80 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {category.description}
                      </p>
                      <div className="mt-2 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        {category.itemCount} items
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Category Navigation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect eyewear solution for your needs from our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link 
              href="/eyeglasses"
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Glasses className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Eyeglasses</h3>
                  <p className="text-sm text-gray-600 mt-1">Perfect vision correction</p>
                </div>
                <div className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
                  Shop Now →
                </div>
              </div>
            </Link>

            <Link 
              href="/sunglasses"
              className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Sunglasses</h3>
                  <p className="text-sm text-gray-600 mt-1">UV protection & style</p>
                </div>
                <div className="text-orange-600 font-medium text-sm group-hover:text-orange-700">
                  Shop Now →
                </div>
              </div>
            </Link>

            <Link 
              href="/contact-lenses"
              className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ContactIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Contact Lenses</h3>
                  <p className="text-sm text-gray-600 mt-1">Comfortable vision</p>
                </div>
                <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700">
                  Shop Now →
                </div>
              </div>
            </Link>

            <Link 
              href="/kids"
              className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Baby className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">Kids Collection</h3>
                  <p className="text-sm text-gray-600 mt-1">Durable & fun designs</p>
                </div>
                <div className="text-green-600 font-medium text-sm group-hover:text-green-700">
                  Shop Now →
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link 
              href="/brands"
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Brands</h3>
                  <p className="text-sm text-gray-600 mt-1">Premium international brands</p>
                </div>
                <div className="text-gray-700 font-medium text-sm group-hover:text-gray-800">
                  Explore Brands →
                </div>
              </div>
            </Link>

            <Link 
              href="/eye-test"
              className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-indigo-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Eye Test</h3>
                  <p className="text-sm text-gray-600 mt-1">Professional eye testing</p>
                </div>
                <div className="text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                  Book Appointment →
                </div>
              </div>
            </Link>

            <Link 
              href="/today-deals"
              className="group relative bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-red-200"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">Today's Deals</h3>
                  <p className="text-sm text-gray-600 mt-1">Limited time offers</p>
                </div>
                <div className="text-red-600 font-medium text-sm group-hover:text-red-700">
                  View Deals →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Eyewear</h2>
              <p className="text-gray-600 mt-2">Premium frames and lenses selected for you</p>
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <EmptyStateWithLoading loading={productsLoading} empty={products.length === 0}>
              {products.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
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
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ৳{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
            </EmptyStateWithLoading>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Metro Optics?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Bangladesh's trusted optical shop with authentic international brands
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuresLoading ? (
              <FeatureCardSkeleton count={4} />
            ) : (
              features.map((feature, index) => (
                <div key={index} className={`text-center group hover-lift-subtle animate-fade-in-up-smooth animate-stagger-${index + 1}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4 group-hover:shadow-lg transition-all duration-500 ${feature.color.replace('text-', 'bg-').replace('-600', '/20')} hover-glow`}>
                    <feature.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.color} group-hover:scale-110 transition-transform duration-500`} />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modern Professional Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 sm:col-span-2">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Glasses className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Metro Optics</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Premium Eyewear Since 2020</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-md">
                Bangladesh's trusted optical destination. We bring you authentic international brands with professional eye care services, ensuring clarity and style for every vision.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm">Shop 12, Block C, Dhanmondi, Dhaka-1205</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm">+880 2 5500 1234 | +880 1712 345678</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm">care@metrooptics.com</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Follow us:</span>
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Products</h4>
              <ul className="space-y-3">
                <li><Link href="/eyeglasses" className="text-gray-300 hover:text-blue-400 transition-colors">Eyeglasses</Link></li>
                <li><Link href="/sunglasses" className="text-gray-300 hover:text-blue-400 transition-colors">Sunglasses</Link></li>
                <li><Link href="/contact-lenses" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Lenses</Link></li>
                <li><Link href="/kids" className="text-gray-300 hover:text-blue-400 transition-colors">Kids Collection</Link></li>
                <li><Link href="/brands" className="text-gray-300 hover:text-blue-400 transition-colors">All Brands</Link></li>
                <li><Link href="/deals" className="text-gray-300 hover:text-blue-400 transition-colors">Special Offers</Link></li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                <li><Link href="/eye-test" className="text-gray-300 hover:text-blue-400 transition-colors">Free Eye Testing</Link></li>
                <li><Link href="/prescription" className="text-gray-300 hover:text-blue-400 transition-colors">Prescription Upload</Link></li>
                <li><Link href="/virtual-try" className="text-gray-300 hover:text-blue-400 transition-colors">Virtual Try-On</Link></li>
                <li><Link href="/home-delivery" className="text-gray-300 hover:text-blue-400 transition-colors">Home Delivery</Link></li>
                <li><Link href="/insurance" className="text-gray-300 hover:text-blue-400 transition-colors">Insurance Support</Link></li>
                <li><Link href="/corporate" className="text-gray-300 hover:text-blue-400 transition-colors">Corporate Plans</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-300 hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-blue-400 transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-blue-400 transition-colors">Shipping Info</Link></li>
                <li><Link href="/size-guide" className="text-gray-300 hover:text-blue-400 transition-colors">Size Guide</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2024 Metro Optics. All rights reserved. | Bangladesh's Premier Optical Shop
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Showroom: Dhanmondi, Dhaka | Operating: 10AM - 8PM Daily
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-end space-x-6 text-sm">
                <Link href="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors text-xs">Admin</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">We accept:</span>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">VISA</span>
                    </div>
                    <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">MC</span>
                    </div>
                    <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">bKash</span>
                    </div>
                    <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">Nagad</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Secured by SSL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Free Delivery ৳2000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}