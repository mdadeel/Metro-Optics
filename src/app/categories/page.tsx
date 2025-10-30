'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Glasses, Sun, Eye, Baby, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getPlaceholderUrl } from '@/lib/image-generator'

const categories = [
  {
    id: 'eyeglasses',
    name: 'Eyeglasses',
    description: 'Perfect vision correction for every lifestyle',
    icon: Glasses,
    image: getPlaceholderUrl(400, 300, "Eyeglasses"),
    itemCount: '1,245',
    href: '/eyeglasses',
    color: 'blue'
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'UV protection & style for sunny days',
    icon: Sun,
    image: getPlaceholderUrl(400, 300, "Sunglasses"),
    itemCount: '892',
    href: '/sunglasses',
    color: 'orange'
  },
  {
    id: 'contact-lenses',
    name: 'Contact Lenses',
    description: 'Comfortable vision without frames',
    icon: Eye,
    image: getPlaceholderUrl(400, 300, "Contact Lenses"),
    itemCount: '456',
    href: '/contact-lenses',
    color: 'purple'
  },
  {
    id: 'kids',
    name: 'Kids Collection',
    description: 'Durable & fun designs for children',
    icon: Baby,
    image: getPlaceholderUrl(400, 300, "Kids Eyewear"),
    itemCount: '234',
    href: '/kids',
    color: 'green'
  },
  {
    id: 'deals',
    name: "Today's Deals",
    description: 'Limited time offers & discounts',
    icon: TrendingUp,
    image: getPlaceholderUrl(400, 300, "Special Deals"),
    itemCount: '89',
    href: '/deals',
    color: 'red'
  },
  {
    id: 'brands',
    name: 'Brands',
    description: 'Premium international eyewear brands',
    icon: Package,
    image: getPlaceholderUrl(400, 300, "Brands"),
    itemCount: '45',
    href: '/brands',
    color: 'gray'
  }
]

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of eyewear categories, each designed to meet your specific vision and style needs.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-white/90 text-${category.color}-600 border-0`}
                  >
                    {category.itemCount} items
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <Button 
                  asChild
                  className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700 text-white`}
                >
                  <Link href={category.href}>
                    Shop {category.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our expert team is here to help you find the perfect eyewear for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/eye-test">Book Eye Test</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
