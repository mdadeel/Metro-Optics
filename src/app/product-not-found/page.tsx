"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, ArrowLeft, ShoppingBag, Sparkles, Search } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Animated Icon Container */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Eye className="w-16 h-16 text-orange-400" />
              </div>
              {/* Orbiting dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full animate-spin"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-spin delay-150"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-spin delay-300"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-spin delay-450"></div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">
              The eyewear you&apos;re looking for seems to have vanished!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
              We couldn&apos;t find the specific product you&apos;re looking for. It might have been sold out, removed, or the link might be incorrect. 
              But don&apos;t worry - we have many other amazing eyewear options for you to explore!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                asChild
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5" />
                  Back to Products
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                asChild
                className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 text-lg font-semibold"
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            {/* Additional Options */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/eyeglasses">
                    <Eye className="w-4 h-4 mr-1" />
                    Eyeglasses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/sunglasses">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Sunglasses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/contact-lenses">
                    <Search className="w-4 h-4 mr-1" />
                    Contact Lenses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/deals">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Hot Deals
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}