"use client"

import { useState } from "react"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Home, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    badge: null
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
    badge: "Manage"
  },
  {
    title: "Categories",
    icon: Tags,
    href: "/admin/categories",
    badge: null
  },
  {
    title: "Homepage",
    icon: Home,
    href: "/admin/homepage",
    badge: null
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    badge: null
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    badge: null
  }
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { admin, logout } = useAdmin()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Metro Optics</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}>
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-red-600" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href)))?.title || "Admin"}
                </h2>
                <p className="text-sm text-gray-500">Manage your Metro Optics store</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live
              </Badge>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {admin?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {admin?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}