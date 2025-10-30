import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "morphism" | "frosted"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  const variants = {
    default: "bg-white/80 backdrop-blur-md border-white/20 shadow-xl",
    morphism: "bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl",
    frosted: "bg-white/30 backdrop-blur-xl border-white/30 shadow-2xl"
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 hover:shadow-2xl",
      variants[variant],
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <CardContent className="relative z-10 p-6">
        {children}
      </CardContent>
    </Card>
  )
}