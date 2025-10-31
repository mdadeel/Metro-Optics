'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Truck, 
  Clock, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Package,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

const shippingOptions = [
  {
    name: 'Standard Delivery',
    duration: '2-3 business days',
    price: '৳150',
    freeThreshold: 'Orders over ৳2,000',
    description: 'Regular delivery within Dhaka city',
    icon: Truck,
    color: 'blue'
  },
  {
    name: 'Express Delivery',
    duration: '1-2 business days',
    price: '৳300',
    freeThreshold: 'Orders over ৳5,000',
    description: 'Fast delivery for urgent orders',
    icon: Clock,
    color: 'green'
  },
  {
    name: 'Same Day Delivery',
    duration: 'Same day',
    price: '৳500',
    freeThreshold: 'Orders over ৳10,000',
    description: 'Delivery within 6 hours (Dhaka only)',
    icon: Package,
    color: 'red'
  }
]

const deliveryAreas = [
  {
    city: 'Dhaka',
    areas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Wari', 'Old Dhaka'],
    deliveryTime: '1-2 days',
    status: 'Available'
  },
  {
    city: 'Chittagong',
    areas: ['Panchlaish', 'Kotwali', 'Halishahar', 'Nasirabad'],
    deliveryTime: '2-3 days',
    status: 'Available'
  },
  {
    city: 'Sylhet',
    areas: ['Zindabazar', 'Ambarkhana', 'Uposhohor'],
    deliveryTime: '3-4 days',
    status: 'Available'
  },
  {
    city: 'Rajshahi',
    areas: ['Shaheb Bazar', 'Kazla', 'Binodpur'],
    deliveryTime: '3-4 days',
    status: 'Available'
  }
]

const trackingSteps = [
  {
    step: 1,
    title: 'Order Confirmed',
    description: 'Your order has been received and confirmed',
    icon: CheckCircle,
    color: 'green'
  },
  {
    step: 2,
    title: 'Processing',
    description: 'Your eyewear is being prepared for shipment',
    icon: Package,
    color: 'blue'
  },
  {
    step: 3,
    title: 'Shipped',
    description: 'Your order is on its way to you',
    icon: Truck,
    color: 'orange'
  },
  {
    step: 4,
    title: 'Delivered',
    description: 'Your order has been delivered successfully',
    icon: CheckCircle,
    color: 'green'
  }
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
            <p className="text-lg text-gray-600">
              Fast, reliable, and secure delivery across Bangladesh. Learn about our shipping options and delivery times.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-${option.color}-100 rounded-lg flex items-center justify-center`}>
                      <option.icon className={`w-6 h-6 text-${option.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {option.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Delivery Fee:</span>
                      <span className="font-semibold text-lg">{option.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Free Shipping:</span>
                      <span className="text-sm font-medium">{option.freeThreshold}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{area.city}</CardTitle>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {area.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{area.deliveryTime}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Coverage Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {area.areas.map((subArea, subIndex) => (
                        <Badge key={subIndex} variant="secondary" className="text-xs">
                          {subArea}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Tracking */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order Tracking</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {index < trackingSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Signature Required</p>
                    <p className="text-sm text-gray-600">All deliveries require recipient signature</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Packaging</p>
                    <p className="text-sm text-gray-600">All eyewear is packaged securely to prevent damage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Insurance Included</p>
                    <p className="text-sm text-gray-600">All shipments are insured against loss or damage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">+880-1234-567890</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@metrooptics.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Track Your Order</p>
                    <p className="text-sm text-gray-600">Use your order number to track delivery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our collection and enjoy fast, reliable delivery across Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
