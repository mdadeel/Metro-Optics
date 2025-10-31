'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, Eye, TrendingUp, Sparkles, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { LoadingSkeleton, ErrorBoundary, EmptyState } from '@/components/ui/data-states'
import type { Product } from '@/types/product'

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites()

  // Use React Query for data fetching
  const { data: products = [], isLoading: loading, error } = useProducts()

  const categories = [
    { id: 'all', name: 'All Products', icon: Sparkles },
    { id: 'eyeglasses', name: 'Eyeglasses', icon: Eye },
    { id: 'sunglasses', name: 'Sunglasses', icon: TrendingUp },
    { id: 'contact-lenses', name: 'Contact Lenses', icon: Award },
  ]


  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId)
  }

  const handleFavoriteToggle = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || '',
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        reviews: product.reviews,
        inStock: product.inStock || true
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description || '',
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviews,
    })
  }

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium Eyewear</h2>
            <p className="text-gray-600">Discovering amazing frames for you...</p>
          </div>
          <LoadingSkeleton count={8} />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary error={error as Error}>
            <EmptyState
              title="Failed to load products"
              description="We couldn't load the featured products. Please try again later."
              action={{
                label: "Refresh Page",
                onClick: () => window.location.reload()
              }}
            />
          </ErrorBoundary>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full mb-6 border border-blue-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-semibold">Featured Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Premium Eyewear
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover handpicked frames and lenses that blend style, comfort, and exceptional quality
          </p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-20"></div>
          </div>
        </div>

        {/* Enhanced Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-500 hover-lift-subtle animate-fade-in-up-smooth animate-stagger-${index + 1} ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg border-0' 
                    : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 hover:border-blue-300 hover:text-blue-600 shadow-sm hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                {category.name}
                {activeCategory === category.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Button>
            )
          })}
        </div>

        {/* Enhanced Products Grid - Better Mobile/Tablet */}
        {filteredProducts.length === 0 ? (
          /* Product Not Found State */
          <div className="text-center py-12 sm:py-20">
            <div className="max-w-lg mx-auto">
              {/* Animated icon container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400" />
                </div>
                {/* Orbiting dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-spin"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-spin delay-150"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-spin delay-300"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-spin delay-450"></div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                The eyewear you&apos;re looking for seems to have vanished!
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                No products found in this category. Try exploring other categories or browse our complete collection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveCategory('all')}
                  className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Browse All Products
                </Button>
                <Button 
                  asChild
                  className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 text-sm sm:text-base"
                >
                  <Link href="/products">
                    Back to Products
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-700 hover-lift-subtle animate-fade-in-up-smooth animate-stagger-${(index % 5) + 1} overflow-hidden border border-gray-100`}>
                {/* Product Image Container - Enhanced Mobile */}
                <div className="relative h-48 sm:h-52 lg:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={85}
                      loading="lazy"
                    />
                  </Link>
                  
                  {/* Product Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-20">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse-once">
                        {product.badge}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Favorite Button - Better Touch Target */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className={`absolute top-2 right-2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-300 hover-scale shadow-md w-9 h-9 sm:w-8 sm:h-8 p-0 touch-manipulation ${
                      isFavorite(product.id) ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-red-600'
                    }`}
                    onClick={() => handleFavoriteToggle(product)}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-all duration-300 ${isFavorite(product.id) ? 'fill-current scale-110' : ''}`} 
                    />
                  </Button>

                  {/* Quick View Overlay - Enhanced Mobile */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 bg-white/95 hover:bg-white backdrop-blur-sm hover-scale shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-xs px-3 py-2 sm:py-2 touch-manipulation"
                      asChild
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Product Info - Enhanced Mobile */}
                <div className="p-3 sm:p-4">
                  {/* Brand and Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-blue-600 transition-colors duration-300">
                        {product.brand}
                      </span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-blue-600 capitalize font-medium hover:text-blue-700 transition-colors duration-300">
                        {product.category ? product.category.replace('-', ' ') : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300 group-hover:text-blue-600 text-sm sm:text-sm leading-tight min-h-[2.5rem] sm:min-h-[2rem]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-3 sm:h-3 transition-all duration-300 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1 font-medium">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price and Action - Enhanced Mobile */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Badge variant="secondary" className="text-green-600 bg-green-50 hover:bg-green-100 font-semibold text-xs px-1 py-0">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button - Enhanced Touch */}
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg touch-manipulation min-w-[36px] sm:min-w-[40px]"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}