import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "product" | "hero" | "card"
}

export function LoadingSkeleton({ className, variant = "product" }: LoadingSkeletonProps) {
  if (variant === "product") {
    return (
      <div className={cn("bg-white rounded-2xl p-6 space-y-4", className)}>
        <div className="relative w-full h-64 bg-gray-200 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", className)}>
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-gray-200 rounded-full w-48 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-full w-48 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-xl p-6 space-y-4", className)}>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
    </div>
  )
}