'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  }

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : 'auto')
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: i === lines - 1 ? '70%' : '100%'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

interface ProductCardSkeletonProps {
  count?: number
}

export function ProductCardSkeleton({ count = 4 }: ProductCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in-up-smooth" style={{ animationDelay: `${i * 100}ms` }}>
          {/* Product Image Skeleton */}
          <Skeleton variant="rectangular" height={256} className="rounded-t-lg" />
          
          {/* Product Info Skeleton */}
          <div className="p-4 space-y-3">
            {/* Brand and Category */}
            <div className="flex justify-between">
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={60} />
            </div>
            
            {/* Product Name */}
            <Skeleton variant="text" lines={2} />
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} variant="text" width={16} height={16} className="rounded-sm" />
                ))}
              </div>
              <Skeleton variant="text" width={40} />
            </div>
            
            {/* Price */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={60} height={16} />
              </div>
              <Skeleton variant="text" width={50} height={24} className="rounded-full" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Skeleton variant="rectangular" height={36} className="flex-1 rounded-md" />
              <Skeleton variant="rectangular" width={36} height={36} className="rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface CategoryCardSkeletonProps {
  count?: number
}

export function CategoryCardSkeleton({ count = 4 }: CategoryCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="group relative overflow-hidden rounded-lg border border-gray-200 animate-fade-in-up-smooth" style={{ animationDelay: `${i * 100}ms` }}>
          <Skeleton variant="rectangular" height={192} className="rounded-lg" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
            <Skeleton variant="text" width={120} height={24} className="bg-white/20 mb-2" />
            <Skeleton variant="text" width={80} height={16} className="bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface HeroSkeletonProps {
  show?: boolean
}

export function HeroSkeleton({ show = true }: HeroSkeletonProps) {
  if (!show) return null

  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
      <Skeleton variant="rectangular" height="100%" className="rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4">
            <Skeleton variant="text" width={120} height={32} className="bg-white/20 rounded-full mb-6" />
            <Skeleton variant="text" width={400} height={80} className="bg-white/20" />
            <Skeleton variant="text" width={300} height={40} className="bg-white/20" />
            <Skeleton variant="text" width={500} height={24} className="bg-white/20" />
            <div className="flex space-x-4 pt-4">
              <Skeleton variant="rectangular" width={180} height={48} className="bg-white/20 rounded-lg" />
              <Skeleton variant="rectangular" width={140} height={48} className="bg-white/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardSkeletonProps {
  count?: number
}

export function FeatureCardSkeleton({ count = 4 }: FeatureCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="text-center animate-fade-in-up-smooth" style={{ animationDelay: `${i * 100}ms` }}>
          <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-4" />
          <Skeleton variant="text" width={150} height={24} className="mx-auto mb-2" />
          <Skeleton variant="text" width={200} height={16} className="mx-auto" />
        </div>
      ))}
    </div>
  )
}