'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  RotateCcw,
  Shield,
  Star,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    id: 'shipping',
    question: 'How long does shipping take?',
    answer: 'We offer free shipping on orders over ৳2,000. Standard delivery takes 2-3 business days within Dhaka and 3-5 business days for other cities in Bangladesh.',
    category: 'Shipping'
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all eyewear. Items must be in original condition with tags attached. Prescription lenses cannot be returned.',
    category: 'Returns'
  },
  {
    id: 'prescription',
    question: 'How do I upload my prescription?',
    answer: 'You can upload your prescription during checkout or send it to us via WhatsApp at +880-1234-567890. We accept prescriptions from licensed optometrists.',
    category: 'Prescription'
  },
  {
    id: 'warranty',
    question: 'What warranty do you offer?',
    answer: 'All frames come with a 1-year manufacturer warranty against defects. Prescription lenses have a 6-month warranty.',
    category: 'Warranty'
  },
  {
    id: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept bKash, Nagad, Rocket, credit/debit cards, and cash on delivery. All payments are processed securely.',
    category: 'Payment'
  },
  {
    id: 'eye-test',
    question: 'Do you offer free eye testing?',
    answer: 'Yes! We provide free eye testing at our Dhaka showroom. Book an appointment online or call us at +880-1234-567890.',
    category: 'Services'
  }
]

const helpCategories = [
  {
    title: 'Ordering & Payment',
    icon: ShoppingBag,
    description: 'Questions about placing orders and payment methods',
    count: 12
  },
  {
    title: 'Shipping & Delivery',
    icon: Truck,
    description: 'Information about shipping times and delivery options',
    count: 8
  },
  {
    title: 'Returns & Exchanges',
    icon: RotateCcw,
    description: 'How to return or exchange your eyewear',
    count: 6
  },
  {
    title: 'Prescription & Eye Test',
    icon: HelpCircle,
    description: 'Help with prescriptions and eye testing services',
    count: 10
  },
  {
    title: 'Warranty & Support',
    icon: Shield,
    description: 'Product warranty and customer support information',
    count: 5
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions or get in touch with our support team.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {helpCategories.map((category, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <category.icon className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{category.title}</h3>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Live Chat</p>
                    <p className="text-xs text-gray-500">Available 9 AM - 9 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">+880-1234-567890</p>
                    <p className="text-xs text-gray-500">Call us directly</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">support@metrooptics.com</p>
                    <p className="text-xs text-gray-500">Email support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <Card key={faq.id} className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <button
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search terms or browse our help categories.
                    </p>
                    <Button onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl opacity-90">
              Our support team is here to assist you with any questions or concerns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="text-center p-6">
                <MessageCircle className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm opacity-90 mb-4">Get instant help from our support team</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="text-center p-6">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm opacity-90 mb-4">Speak directly with our experts</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Call Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="text-center p-6">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm opacity-90 mb-4">Send us a detailed message</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
