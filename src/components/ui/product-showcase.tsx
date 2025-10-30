import { useState } from "react"
import { GlassCard } from "./glass-card"
import { AnimatedButton } from "./animated-button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

// Use the Product interface from the store
interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  category: string
  brand: string
  gender: string[]
  age: string[]
  frameType: string
  material: string
  color: string
  shape: string
  features: string[]
  image: string
  rating: number
  reviews: number
  badge?: string
  description: string
}

interface ProductShowcaseProps {
  products: Product[]
  title: string
  subtitle?: string
}

export function ProductShowcase({ products, title, subtitle }: ProductShowcaseProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore()

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Featured Collection</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <GlassCard 
                variant="frosted" 
                className={cn(
                  "transform transition-all duration-500 hover:scale-105 hover:-translate-y-2",
                  "animate-fade-in-up"
                )}
              >
                {/* Product Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                      "w-full h-80 object-cover transition-transform duration-700",
                      hoveredProduct === product.id ? "scale-110" : "scale-100"
                    )}
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
                    hoveredProduct === product.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}>
                    <button
                      onClick={() => toggleFavorite(product)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        isFavorite(product.id) 
                          ? "bg-red-500 text-white shadow-lg" 
                          : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:shadow-lg"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", isFavorite(product.id) && "fill-current")} />
                    </button>
                    
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <div className={cn(
                    "absolute bottom-4 left-4 right-4 transition-all duration-300",
                    hoveredProduct === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <AnimatedButton
                      onClick={() => handleAddToCart(product)}
                      variant="gradient"
                      size="sm"
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </AnimatedButton>
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
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}