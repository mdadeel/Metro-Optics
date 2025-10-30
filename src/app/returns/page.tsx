'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  CreditCard,
  Phone,
  Mail,
  AlertTriangle,
  Shield
} from 'lucide-react'
import Link from 'next/link'

const returnPolicy = [
  {
    item: 'Eyeglass Frames',
    returnWindow: '30 days',
    condition: 'Must be in original condition with tags',
    refundMethod: 'Original payment method',
    eligible: true
  },
  {
    item: 'Sunglasses',
    returnWindow: '30 days',
    condition: 'Must be in original condition with tags',
    refundMethod: 'Original payment method',
    eligible: true
  },
  {
    item: 'Prescription Lenses',
    returnWindow: 'Not eligible',
    condition: 'Custom-made items cannot be returned',
    refundMethod: 'N/A',
    eligible: false
  },
  {
    item: 'Contact Lenses',
    returnWindow: '7 days',
    condition: 'Unopened packages only',
    refundMethod: 'Original payment method',
    eligible: true
  }
]

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Contact us within the return window to start the process',
    icon: Phone,
    color: 'blue'
  },
  {
    step: 2,
    title: 'Package Items',
    description: 'Pack items securely in original packaging',
    icon: Package,
    color: 'orange'
  },
  {
    step: 3,
    title: 'Ship Back',
    description: 'Send items back using our prepaid return label',
    icon: RotateCcw,
    color: 'green'
  },
  {
    step: 4,
    title: 'Receive Refund',
    description: 'Get your refund within 5-7 business days',
    icon: CreditCard,
    color: 'purple'
  }
]

const exchangeReasons = [
  'Wrong size',
  'Different color preferred',
  'Style not suitable',
  'Defective item',
  'Changed mind',
  'Better option available'
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
            <p className="text-lg text-gray-600">
              We want you to be completely satisfied with your purchase. Learn about our easy return and exchange policy.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Return Policy Overview */}
        <div className="mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">30-Day Return Policy</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We offer a hassle-free 30-day return policy for most items. Your satisfaction is our priority.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-sm text-gray-600">Simple process</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-semibold">Quick Refunds</p>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-sm text-gray-600">Prepaid return labels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Policy Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return Policy by Item Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {returnPolicy.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.item}</CardTitle>
                    {item.eligible ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Not Eligible
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Return Window:</span>
                    <span className="font-medium">{item.returnWindow}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Condition:</span>
                    <p className="text-sm mt-1">{item.condition}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Refund Method:</span>
                    <span className="text-sm font-medium">{item.refundMethod}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Return</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {index < returnSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Reasons */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Exchange Reasons</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {exchangeReasons.map((reason, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm font-medium text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Prescription Lenses</p>
                    <p className="text-sm text-gray-600">Custom-made prescription lenses cannot be returned</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Damaged Items</p>
                    <p className="text-sm text-gray-600">Items damaged by misuse are not eligible for return</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Original Packaging</p>
                    <p className="text-sm text-gray-600">Items must be returned in original packaging</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
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
                    <p className="text-sm text-gray-600">returns@metrooptics.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Return Portal</p>
                    <p className="text-sm text-gray-600">Track your return status</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Return?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our support team to initiate your return or exchange process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/help">Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
