"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, ShoppingCart, Baby } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type KidsProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  inStock: boolean;
  category: string;
  badge?: string;
  slug?: string;
};

export default function KidsPage() {
  const [products, setProducts] = useState<KidsProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<KidsProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchKidsProducts() {
      try {
        const response = await fetch('/api/products', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          const kidsProducts = data.filter(product => 
            product.age?.includes('kids') || 
            product.gender?.includes('boys') || 
            product.gender?.includes('girls')
          )
          setProducts(kidsProducts)
          setFilteredProducts(kidsProducts)
        }
      } catch (error) {
        console.error('Failed to fetch kids products:', error)
      }
    }
    fetchKidsProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Baby className="w-8 h-8 mr-2" />
              <h1 className="text-4xl font-bold">Kids Collection</h1>
              <Baby className="w-8 h-8 ml-2" />
            </div>
            <p className="text-xl">Durable & fun designs for children</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search kids eyewear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No kids products found</h3>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
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
                      <Badge className="bg-green-600 text-white">
                        {product.badge}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.brand}
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
  )
}