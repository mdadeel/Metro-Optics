"use client"

import { useState } from "react"
import { AdminProvider } from "@/lib/admin-context"
import { AdminProtection } from "@/components/admin/admin-protection"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Eye,
  Image as ImageIcon,
  Type,
  Star,
  Package
} from "lucide-react"

// Mock data - in real app, this would come from API
const homepageData = {
  hero: {
    title: "Find Your Perfect Vision",
    subtitle: "Premium eyewear collection for every style",
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundImage: "/api/placeholder/1920/600",
    enabled: true
  },
  featuredProducts: {
    title: "Featured Products",
    subtitle: "Handpicked selection of our best sellers",
    enabled: true,
    productIds: [1, 2, 3, 4]
  },
  categories: {
    title: "Shop by Category",
    subtitle: "Find exactly what you're looking for",
    enabled: true,
    categoryIds: [1, 2, 3, 4]
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Real reviews from satisfied customers",
    enabled: true,
    testimonials: [
      {
        id: 1,
        name: "Sarah Ahmed",
        rating: 5,
        comment: "Amazing quality and fast delivery! Very satisfied with my purchase.",
        avatar: "/api/placeholder/60/60"
      },
      {
        id: 2,
        name: "Rahim Khan",
        rating: 5,
        comment: "Great collection of eyewear. Found exactly what I was looking for.",
        avatar: "/api/placeholder/60/60"
      }
    ]
  },
  services: {
    title: "Why Choose OpticaBD",
    enabled: true,
    services: [
      {
        id: 1,
        title: "Free Shipping",
        description: "On orders over ৳1000",
        icon: "Package"
      },
      {
        id: 2,
        title: "24/7 Support",
        description: "Dedicated customer service",
        icon: "Star"
      },
      {
        id: 3,
        title: "Quality Guarantee",
        description: "100% authentic products",
        icon: "Star"
      }
    ]
  }
}

export default function HomepageManagement() {
  return (
    <AdminProvider>
      <AdminProtection>
        <HomepageManagementContent />
      </AdminProtection>
    </AdminProvider>
  )
}

function HomepageManagementContent() {
  const [activeTab, setActiveTab] = useState("hero")
  const [editingSection, setEditingSection] = useState<any>(null)

  const HeroSectionForm = ({ data, onClose }: { data: any, onClose: () => void }) => {
    const [formData, setFormData] = useState(data)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log("Hero data:", formData)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="heroEnabled">Show Hero Section</Label>
          <Switch
            id="heroEnabled"
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData({...formData, enabled: checked})}
          />
        </div>

        <div>
          <Label htmlFor="heroTitle">Main Title</Label>
          <Input
            id="heroTitle"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="heroSubtitle">Subtitle</Label>
          <Input
            id="heroSubtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="heroButtonText">Button Text</Label>
            <Input
              id="heroButtonText"
              value={formData.buttonText}
              onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="heroButtonLink">Button Link</Label>
            <Input
              id="heroButtonLink"
              value={formData.buttonLink}
              onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="heroImage">Background Image URL</Label>
          <Input
            id="heroImage"
            value={formData.backgroundImage}
            onChange={(e) => setFormData({...formData, backgroundImage: e.target.value})}
            placeholder="/api/placeholder/1920/600"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    )
  }

  const SectionForm = ({ section, data, onClose }: { section: string, data: any, onClose: () => void }) => {
    const [formData, setFormData] = useState(data)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log(`${section} data:`, formData)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${section}Enabled`}>Show Section</Label>
          <Switch
            id={`${section}Enabled`}
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData({...formData, enabled: checked})}
          />
        </div>

        <div>
          <Label htmlFor={`${section}Title`}>Section Title</Label>
          <Input
            id={`${section}Title`}
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor={`${section}Subtitle`}>Section Subtitle</Label>
          <Input
            id={`${section}Subtitle`}
            value={formData.subtitle}
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
            <p className="text-gray-500">Customize your homepage content</p>
          </div>
          
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Homepage
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="products">Featured Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hero Section</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSection(homepageData.hero)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={homepageData.hero.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {homepageData.hero.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <h3 className="text-2xl font-bold">{homepageData.hero.title}</h3>
                    <p className="text-gray-600">{homepageData.hero.subtitle}</p>
                    <div className="flex items-center gap-4">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                        {homepageData.hero.buttonText}
                      </Button>
                      <span className="text-sm text-gray-500">Link: {homepageData.hero.buttonLink}</span>
                    </div>
                    <div className="mt-4 p-4 bg-gray-200 rounded-lg text-center text-gray-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      Background Image: {homepageData.hero.backgroundImage}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Products */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Featured Products Section</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSection(homepageData.featuredProducts)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={homepageData.featuredProducts.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {homepageData.featuredProducts.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{homepageData.featuredProducts.title}</h3>
                    <p className="text-gray-600 mb-4">{homepageData.featuredProducts.subtitle}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {homepageData.featuredProducts.productIds.map((id: number) => (
                        <div key={id} className="bg-white p-4 rounded-lg border">
                          <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
                          <p className="text-sm font-medium">Product {id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Categories Section</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSection(homepageData.categories)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={homepageData.categories.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {homepageData.categories.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{homepageData.categories.title}</h3>
                    <p className="text-gray-600 mb-4">{homepageData.categories.subtitle}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {homepageData.categories.categoryIds.map((id: number) => (
                        <div key={id} className="bg-white p-4 rounded-lg border text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                          <p className="text-sm font-medium">Category {id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Content */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Testimonials</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingSection(homepageData.testimonials)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={homepageData.testimonials.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {homepageData.testimonials.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {homepageData.testimonials.testimonials.map((testimonial: any) => (
                        <div key={testimonial.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="font-medium">{testimonial.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{testimonial.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Services</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingSection(homepageData.services)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={homepageData.services.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {homepageData.services.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {homepageData.services.services.map((service: any) => (
                        <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{service.title}</p>
                              <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingSection && (
          <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Edit {activeTab === 'hero' ? 'Hero Section' : 
                         activeTab === 'products' ? 'Featured Products' :
                         activeTab === 'categories' ? 'Categories' : 'Content Section'}
                </DialogTitle>
              </DialogHeader>
              {activeTab === 'hero' ? (
                <HeroSectionForm data={editingSection} onClose={() => setEditingSection(null)} />
              ) : (
                <SectionForm 
                  section={activeTab} 
                  data={editingSection} 
                  onClose={() => setEditingSection(null)} 
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}