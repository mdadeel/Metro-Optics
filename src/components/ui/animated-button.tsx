import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  variant?: "default" | "gradient" | "glow" | "neon"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AnimatedButton({ 
  children, 
  onClick, 
  loading = false, 
  variant = "default",
  size = "md",
  className 
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    glow: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105",
    neon: "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg hover:shadow-green-400/50 transform hover:scale-105"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden transition-all duration-300 rounded-full font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          children
        )}
      </div>
      
      {/* Animated background effect */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 transition-transform duration-500",
          isHovered ? "translate-x-full" : "-translate-x-full"
        )}
      />
      
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 hover:opacity-20 transition-opacity duration-300" />
    </Button>
  )
}