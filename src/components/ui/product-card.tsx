import { useState } from "react"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  category: string
  brand: string
  image: string
  rating: number
  reviews: number
  badge?: string
  description: string
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  onAddToCart?: () => void
  onToggleFavorite?: () => void
  isFavorite?: boolean
}

import { memo, useCallback } from "react";

const ProductCard = memo(({ 
  product, 
  viewMode = "grid", 
  onToggleFavorite, 
  isFavorite = false 
}: ProductCardProps) => {
  const [hovered, setHovered] = useState(false)

  const handleToggleFavorite = useCallback(() => {
    if (onToggleFavorite) onToggleFavorite()
  }, [onToggleFavorite])

  if (viewMode === "list") {
    return (
      <GlassCard variant="frosted" className="hover:scale-[1.02] transition-all duration-300">
        <div className="flex gap-6">
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                hovered ? "scale-110" : "scale-100"
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                if (target.src !== '/placeholder-product.jpg') {
                  target.src = '/placeholder-product.jpg'
                }
              }}
            />
            
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-full",
                  product.badge === "Best Seller" && "bg-red-500 text-white",
                  product.badge === "Premium" && "bg-purple-500 text-white",
                  product.badge === "New" && "bg-green-500 text-white",
                  product.badge === "Sale" && "bg-orange-500 text-white"
                )}>
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-purple-600 font-medium mb-1">{product.brand}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isFavorite 
                      ? "bg-red-500 text-white shadow-lg" 
                      : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:shadow-lg"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating) 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GlassCard 
        variant="frosted" 
        className="h-full transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      >
        {/* Product Image */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-100">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              hovered ? "scale-110" : "scale-100"
            )}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== '/placeholder-product.jpg') {
                target.src = '/placeholder-product.jpg'
              }
            }}
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4">
              <Badge className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full",
                product.badge === "Best Seller" && "bg-red-500 text-white",
                product.badge === "Premium" && "bg-purple-500 text-white",
                product.badge === "New" && "bg-green-500 text-white",
                product.badge === "Sale" && "bg-orange-500 text-white"
              )}>
                {product.badge}
              </Badge>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className={cn(
            "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300",
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isFavorite 
                  ? "bg-red-500 text-white shadow-lg" 
                  : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:shadow-lg"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">{product.brand}</p>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ৳{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            </div>
            
            {product.originalPrice > product.price && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
});

ProductCard.displayName = 'ProductCard';

export { ProductCard };