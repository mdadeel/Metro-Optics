"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, ShoppingCart, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types/product"

export default function BrandsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data: Product[] = await response.json()
          setProducts(data)
          const uniqueBrands = [...new Set(data.map((p: Product) => p.brand).filter((brand): brand is string => Boolean(brand)))] as string[]
          setBrands(uniqueBrands)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand && product.brand === selectedBrand)
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedBrand, searchQuery])

  const getBrandStats = (brand) => {
    const brandProducts = products.filter(p => p.brand && p.brand === brand)
    const avgRating = brandProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / brandProducts.length
    const totalReviews = brandProducts.reduce((sum, p) => sum + (p.reviews || 0), 0)
    const minPrice = Math.min(...brandProducts.map(p => p.price))
    const maxPrice = Math.max(...brandProducts.map(p => p.price))
    
    return {
      count: brandProducts.length,
      avgRating: avgRating.toFixed(1),
      totalReviews,
      priceRange: maxPrice > minPrice ? `৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}` : `৳${minPrice.toLocaleString()}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Building className="w-8 h-8 mr-2" />
              <h1 className="text-4xl font-bold">Premium Brands</h1>
              <Building className="w-8 h-8 ml-2" />
            </div>
            <p className="text-xl">Authentic international eyewear brands</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search brands or products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedBrand("all")
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands Grid */}
        {selectedBrand === "all" && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Brand</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map(brand => {
                const stats = getBrandStats(brand)
                return (
                  <Card key={brand} className="group hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedBrand(brand)}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{stats.count} products</p>
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{stats.avgRating} ({stats.totalReviews})</span>
                        </div>
                        <p>{stats.priceRange}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedBrand !== "all" ? `${selectedBrand} Products` : "All Products"}
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="text-gray-500">
                <Building className="w-16 h-16 mx-auto mb-6 opacity-50 text-gray-400" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms, or explore our full collection.</p>
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => {
                  setSelectedBrand("all")
                  setSearchQuery("")
                }} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Clear Filters
                </Button>
                <Link href="/brands">
                  <Button variant="outline">
                    Go back to all brands
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {product.badge && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-indigo-600 text-white">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.brand || 'Brand N/A'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${product.slug}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}