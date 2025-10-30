'use client'

import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

// Full page loading spinner
export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Inline loading spinner
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size], className)} />
  )
}

// Skeleton loader for cards
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </>
  )
}

// Skeleton loader for product cards
export function ProductCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
          <div className="bg-gray-200 h-48"></div>
          <div className="p-4 space-y-2">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-6 rounded w-1/4"></div>
            <div className="bg-gray-200 h-10 rounded"></div>
          </div>
        </div>
      ))}
    </>
  )
}

// Skeleton loader for lists
export function ListSkeleton({ count = 3, lines = 3 }: { count?: number; lines?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
          {Array.from({ length: lines }).map((_, j) => (
            <div key={j} className="bg-gray-200 h-4 rounded mb-2 last:mb-0" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      ))}
    </>
  )
}

// Button loading state
export function LoadingButton({ 
  children, 
  loading, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  loading: boolean
  className?: string
  [key: string]: any 
}) {
  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

// Search loading state
export function SearchLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Searching...</p>
      </div>
    </div>
  )
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="border-b">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-4 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-b-0">
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="bg-gray-200 h-4 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Form loading overlay
export function FormLoadingOverlay({ loading }: { loading: boolean }) {
  if (!loading) return null

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-2" />
        <p className="text-sm text-gray-600">Processing...</p>
      </div>
    </div>
  )
}

// Empty state with loading
export function EmptyStateWithLoading({ 
  loading, 
  empty, 
  children 
}: { 
  loading: boolean
  empty: boolean
  children: React.ReactNode 
}) {
  if (loading) {
    return <SearchLoading />
  }

  if (empty) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return <>{children}</>
}

// Progress bar loader
export function ProgressBar({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  )
}

// Staggered animation for multiple items
export function StaggeredLoader({ items }: { items: Array<{ id: string; component: React.ReactNode }> }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={item.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {item.component}
        </div>
      ))}
    </div>
  )
}