"use client"

import { AdminProvider } from "@/lib/admin-context"
import { AdminProtection } from "@/components/admin/admin-protection"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Star,
  Plus,
  MoreHorizontal
} from "lucide-react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function AdminDashboardContent() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12.3%",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Users",
      value: "5,678",
      change: "+23.1%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "890",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "৳45.6K",
      change: "+15.4%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ]

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      product: "Wayfarer Classic",
      amount: "৳3,500",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      product: "Aviator Premium",
      amount: "৳4,200",
      status: "processing",
      date: "2024-01-15"
    },
    {
      id: "#12347",
      customer: "Bob Johnson",
      product: "Round Vintage",
      amount: "৳2,800",
      status: "pending",
      date: "2024-01-14"
    }
  ]

  const topProducts = [
    {
      name: "Wayfarer Classic",
      sales: 234,
      revenue: "৳819,000",
      rating: 4.8,
      image: "/api/placeholder/40/40"
    },
    {
      name: "Aviator Premium",
      sales: 189,
      revenue: "৳793,800",
      rating: 4.9,
      image: "/api/placeholder/40/40"
    },
    {
      name: "Round Vintage",
      sales: 156,
      revenue: "৳436,800",
      rating: 4.7,
      image: "/api/placeholder/40/40"
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Store
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : 
                                  order.status === 'processing' ? 'secondary' : 'outline'}
                          className={order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                     order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                     'bg-gray-100 text-gray-800'}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Update status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {product.rating}
                          <span>•</span>
                          <span>{product.sales} sold</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminProtection>
        <AdminDashboardContent />
      </AdminProtection>
    </AdminProvider>
  )
}