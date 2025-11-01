"use client"

import { useState } from "react"
import { generateSlug } from "@/lib/utils"
import { AdminProvider } from "@/lib/admin-context"
import { AdminProtection } from "@/components/admin/admin-protection"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Package,
  Eye
} from "lucide-react"

// Mock data - in real app, this would come from API
const categories: Category[] = [
  {
    id: 1,
    name: "Sunglasses",
    description: "Stylish sunglasses for UV protection",
    productCount: 156,
    status: "active" as const,
    featured: true,
    image: "/api/placeholder/80/80",
    slug: "sunglasses"
  },
  {
    id: 2,
    name: "Eyeglasses",
    description: "Prescription and non-prescription eyeglasses",
    productCount: 234,
    status: "active" as const,
    featured: true,
    image: "/api/placeholder/80/80",
    slug: "eyeglasses"
  },
  {
    id: 3,
    name: "Contact Lenses",
    description: "Daily and monthly disposable contact lenses",
    productCount: 89,
    status: "active" as const,
    featured: false,
    image: "/api/placeholder/80/80",
    slug: "contact-lenses"
  },
  {
    id: 4,
    name: "Accessories",
    description: "Cases, cleaning solutions, and more",
    productCount: 45,
    status: "inactive" as const,
    featured: false,
    image: "/api/placeholder/80/80",
    slug: "accessories"
  }
]

export default function CategoriesManagement() {
  return (
    <AdminProvider>
      <AdminProtection>
        <CategoriesManagementContent />
      </AdminProtection>
    </AdminProvider>
  )
}

type Category = {
  id: number;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  image: string;
  slug: string;
};

function CategoriesManagementContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const CategoryForm = ({ category, onClose }: { category?: Category, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: category?.name || "",
      description: category?.description || "",
      slug: category?.slug || "",
      status: category?.status || "active",
      featured: category?.featured || false
    })

    const handleNameChange = (name: string) => {
      setFormData({
        ...formData,
        name,
        slug: formData.slug || generateSlug(name)
      })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Handle form submission
      console.log("Form data:", formData)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="url-friendly-name"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="featured">Featured Category</Label>
            <p className="text-sm text-gray-500">Show on homepage</p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="status">Active Status</Label>
            <p className="text-sm text-gray-500">Category is visible to customers</p>
          </div>
          <Switch
            id="status"
            checked={formData.status === "active"}
            onCheckedChange={(checked) => setFormData({...formData, status: checked ? "active" : "inactive"})}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {category ? "Update Category" : "Add Category"}
          </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500">Manage product categories</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={category.status === 'active' ? 'default' : 'secondary'}
                      className={category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {category.status}
                    </Badge>
                    {category.featured && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {category.productCount} products
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /{category.slug}
                      </code>
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={category.status === 'active' ? 'default' : 'secondary'}
                        className={category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {category.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {category.featured ? (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {editingCategory && (
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <CategoryForm 
                category={editingCategory} 
                onClose={() => setEditingCategory(null)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}