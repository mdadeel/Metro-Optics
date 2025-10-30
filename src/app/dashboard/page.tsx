'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { User, ShoppingBag, Package, Heart, Settings, LogOut, Eye, MapPin, Phone, Mail, Calendar, CreditCard, Truck, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Download, Filter, Search, Shield, Star, TrendingUp, Award, Camera, Calendar as CalendarIcon, Bell, Gift, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const wishlist = [
    {
      id: 1,
      name: 'Trendy Round Frame',
      price: 3299,
      originalPrice: 4299,
      image: '/api/placeholder/200/200',
      inStock: true,
    },
    {
      id: 2,
      name: 'Vintage Browline',
      price: 4199,
      originalPrice: 5199,
      image: '/api/placeholder/200/200',
      inStock: false,
    },
    {
      id: 3,
      name: 'Kids Colorful Frame',
      price: 1899,
      originalPrice: 2399,
      image: '/api/placeholder/200/200',
      inStock: true,
    },
  ];

  // Enhanced user data with loyalty points
  const userStats = {
    ...user,
    loyaltyPoints: 2450,
    tier: 'Gold',
    savedItems: wishlist.length,
    upcomingAppointments: 1,
    reviewsCount: 12,
    averageRating: 4.8
  };

  // Quick actions data
  const quickActions = [
    { 
      icon: Camera, 
      label: 'Virtual Try-On', 
      description: 'Try glasses virtually',
      color: 'bg-purple-100 text-purple-600',
      href: '/virtual-try-on'
    },
    { 
      icon: CalendarIcon, 
      label: 'Book Eye Test', 
      description: 'Schedule appointment',
      color: 'bg-blue-100 text-blue-600',
      href: '/eye-test'
    },
    { 
      icon: Gift, 
      label: 'Rewards', 
      description: `${userStats.loyaltyPoints} points available`,
      color: 'bg-yellow-100 text-yellow-600',
      href: '/rewards'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      description: '2 new updates',
      color: 'bg-red-100 text-red-600',
      href: '/notifications'
    }
  ];

  // Enhanced spending analytics
  const spendingAnalytics = {
    thisMonth: 12500,
    lastMonth: 8900,
    averageOrderValue: 3200,
    totalSaved: 2300,
    favoriteCategory: 'Eyeglasses'
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 8997,
      items: [
        { name: 'Classic Black Frame', quantity: 1, price: 2999 },
        { name: 'Blue Light Blocking', quantity: 1, price: 1999 },
        { name: 'Premium Cleaning Kit', quantity: 1, price: 499 },
        { name: 'Hard Case', quantity: 2, price: 750 },
      ],
      tracking: 'BD123456789',
      estimatedDelivery: '2024-01-18',
      progress: 100,
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'in-transit',
      total: 4599,
      items: [
        { name: 'Premium Aviator', quantity: 1, price: 4599 },
      ],
      tracking: 'BD987654321',
      estimatedDelivery: '2024-01-25',
      progress: 60,
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-22',
      status: 'processing',
      total: 6998,
      items: [
        { name: 'Designer Cat Eye', quantity: 1, price: 5299 },
        { name: 'Daily Contact Lenses', quantity: 1, price: 1599 },
        { name: 'Lens Solution', quantity: 1, price: 100 },
      ],
      tracking: 'BD456789123',
      estimatedDelivery: '2024-01-28',
      progress: 30,
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-10',
      status: 'cancelled',
      total: 3499,
      items: [
        { name: 'Sport Sunglasses', quantity: 1, price: 3499 },
      ],
      tracking: null,
      estimatedDelivery: null,
      progress: 0,
    },
  ];

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Rahman Ahmed',
      address: 'House 12, Road 8, Dhanmondi',
      city: 'Dhaka',
      postalCode: '1205',
      phone: '+880 1712-345678',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Office',
      name: 'Rahman Ahmed',
      address: 'Plot 45, Gulshan Avenue',
      city: 'Dhaka',
      postalCode: '1213',
      phone: '+880 1712-345678',
      isDefault: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-transit':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const OrderTracking = ({ order }) => {
    const steps = [
      { name: 'Order Placed', completed: true },
      { name: 'Processing', completed: order.progress >= 25 },
      { name: 'Shipped', completed: order.progress >= 50 },
      { name: 'In Transit', completed: order.progress >= 75 },
      { name: 'Delivered', completed: order.progress === 100 },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Order Tracking</h4>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status.replace('-', ' ')}</span>
          </Badge>
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Progress value={order.progress} className="h-2" />
        {order.tracking && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Tracking Number:</p>
            <p className="font-mono font-semibold">{order.tracking}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Metro Optics</h1>
                </div>
              </Link>
              <Separator orientation="vertical" className="h-4 sm:h-6 hidden sm:block" />
              <h2 className="text-sm sm:text-lg font-semibold text-gray-700 hidden sm:block">My Dashboard</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-700 sm:hidden">Dashboard</h2>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={logout}>
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Mobile Bottom Sheet */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="lg:sticky lg:top-20 lg:mt-0 mt-4">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-base sm:text-lg">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Member since {user.memberSince}
                  </Badge>
                </div>
                <Separator className="my-6" />
                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'orders', label: 'My Orders', icon: Package },
                    { id: 'appointments', label: 'Eye Tests', icon: CalendarIcon },
                    { id: 'wishlist', label: 'Wishlist', icon: Heart },
                    { id: 'addresses', label: 'Addresses', icon: MapPin },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Welcome Section */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Welcome back, {user.name}!
                        </h2>
                        <p className="text-gray-600">
                          {userStats.tier} member since {user.memberSince} • {userStats.loyaltyPoints} loyalty points
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1">
                          <Award className="w-4 h-4 mr-1" />
                          {userStats.tier} Tier
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{user.totalOrders}</p>
                          <p className="text-xs text-green-600 mt-1">+2 this month</p>
                        </div>
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Total Spent</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">৳{user.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-green-600 mt-1">+40% vs last month</p>
                        </div>
                        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Loyalty Points</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.loyaltyPoints}</p>
                          <p className="text-xs text-purple-600 mt-1">Redeem now</p>
                        </div>
                        <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Reviews</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.reviewsCount}</p>
                          <p className="text-xs text-yellow-600 mt-1">⭐ {userStats.averageRating}</p>
                        </div>
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={index}
                            href={action.href}
                            className="group block p-4 border rounded-lg hover:shadow-md transition-all hover:scale-105"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{action.label}</p>
                                <p className="text-xs text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Spending Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Spending Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">This Month</span>
                          <span className="font-semibold">৳{spendingAnalytics.thisMonth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last Month</span>
                          <span className="font-semibold">৳{spendingAnalytics.lastMonth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Average Order Value</span>
                          <span className="font-semibold">৳{spendingAnalytics.averageOrderValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Saved</span>
                          <span className="font-semibold text-green-600">৳{spendingAnalytics.totalSaved.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                            <div>
                              <p className="font-semibold text-sm">{order.id}</p>
                              <p className="text-xs text-gray-600">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">৳{order.total}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Orders
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Orders</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{order.id}</h3>
                            <p className="text-sm text-gray-600">Order Date: {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">৳{order.total}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.name} x{item.quantity}</span>
                                  <span className="font-medium">৳{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.status !== 'cancelled' && (
                            <div>
                              <OrderTracking order={order} />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 mt-6">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Package className="w-4 h-4 mr-2" />
                              Return/Exchange
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Eye Test Appointments</h2>
                  <Button>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </div>

                <div className="grid gap-6">
                  {/* Upcoming Appointment */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Upcoming Appointment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <CalendarIcon className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-medium">January 25, 2024</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-600">Time</p>
                                <p className="font-medium">10:30 AM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-medium">Metro Optics</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <User className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-600">Doctor</p>
                                <p className="font-medium">Dr. Sarah Ahmed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Test Details</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Comprehensive Eye Examination</li>
                              <li>• Vision Acuity Test</li>
                              <li>• Eye Pressure Check</li>
                              <li>• Retinal Examination</li>
                            </ul>
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm">Cancel</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Past Appointments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Previous Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            date: '2023-12-15',
                            doctor: 'Dr. Sarah Ahmed',
                            location: 'Metro Optics',
                            prescription: 'Updated: -2.50 / -1.25 x 180',
                            nextVisit: '6 months'
                          },
                          {
                            date: '2023-06-20',
                            doctor: 'Dr. Michael Khan',
                            location: 'Majhar Gate, Agrabad',
                            prescription: 'Updated: -2.25 / -1.00 x 175',
                            nextVisit: '6 months'
                          }
                        ].map((apt, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-semibold">{apt.date}</p>
                                <p className="text-sm text-gray-600">{apt.doctor} • {apt.location}</p>
                              </div>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Prescription:</p>
                                <p className="font-medium">{apt.prescription}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Next Visit:</p>
                                <p className="font-medium">{apt.nextVisit}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Eye Health Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-green-600" />
                        Eye Health Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Regular Check-ups</h4>
                          <p className="text-sm text-gray-600">Visit your eye doctor every 1-2 years for comprehensive exams</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-semibold mb-2">UV Protection</h4>
                          <p className="text-sm text-gray-600">Always wear sunglasses with UV protection outdoors</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Monitor className="w-6 h-6 text-purple-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Screen Time</h4>
                          <p className="text-sm text-gray-600">Follow 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Wishlist</h2>
                  <p className="text-gray-600">{wishlist.length} items</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden group">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-red-600 text-white">Out of Stock</Badge>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                          <Heart className="w-4 h-4 text-red-600 fill-current" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold text-emerald-600">৳{item.price}</span>
                            <span className="text-sm text-gray-500 line-through ml-2">৳{item.originalPrice}</span>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                          </Badge>
                        </div>
                        <Button
                          className="w-full"
                          disabled={!item.inStock}
                        >
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Addresses</h2>
                  <Button>
                    <MapPin className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{address.type}</h3>
                            <p className="text-sm text-gray-600">{address.name}</p>
                          </div>
                          {address.isDefault && (
                            <Badge className="bg-emerald-100 text-emerald-800">Default</Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{address.address}</p>
                          <p>{address.city}, {address.postalCode}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">Edit</Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">Remove</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input value={user.name} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input value={user.email} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <Input value={user.phone} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                        <Input type="date" className="mt-1" />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive order updates and offers via email</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Get order status updates via SMS</p>
                      </div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-gray-600">Subscribe to our newsletter for exclusive offers</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-gray-600">Get reminders for upcoming eye test appointments</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Sharing</p>
                        <p className="text-sm text-gray-600">Share purchase data for personalized recommendations</p>
                      </div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics</p>
                        <p className="text-sm text-gray-600">Help us improve with usage analytics</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Two-Factor Authentication
                      <Badge className="ml-auto bg-green-100 text-green-800">Enabled</Badge>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Update Phone Number
                    </Button>
                    <Separator />
                    <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                      <select className="border rounded px-3 py-1 text-sm">
                        <option>English</option>
                        <option>বাংলা</option>
                      </select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Currency</p>
                        <p className="text-sm text-gray-600">Display prices in</p>
                      </div>
                      <select className="border rounded px-3 py-1 text-sm">
                        <option>BDT (৳)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-gray-600">Choose your color theme</p>
                      </div>
                      <select className="border rounded px-3 py-1 text-sm">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}