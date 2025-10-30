'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Shield, Truck, RefreshCw, CreditCard, ChevronRight, Check, Package, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('standard')

  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'VISION2024') {
      setPromoApplied(true)
      setPromoDiscount(15)
    } else if (promoCode.toUpperCase() === 'SIGHT10') {
      setPromoApplied(true)
      setPromoDiscount(10)
    } else if (promoCode.toUpperCase() === 'WELCOME') {
      setPromoApplied(true)
      setPromoDiscount(20)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = subtotal * (promoDiscount / 100)
  const shippingCost = shippingMethod === 'express' ? 150 : (subtotal > 2000 ? 0 : 80)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal - discountAmount + shippingCost + tax

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      clearCart()
    }, 2000)
  }

  const recommendedProducts = [
    {
      id: 101,
      name: 'Wireless Bluetooth Headphones',
      price: 49.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      rating: 4.5,
      reviews: 234
    },
    {
      id: 102,
      name: 'Smart Watch Pro',
      price: 199.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 103,
      name: 'Portable Power Bank',
      price: 24.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1593672694428-6d0c8ce47c12?w=200&h=200&fit=crop',
      rating: 4.3,
      reviews: 156
    }
  ]

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">OpticaBD</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any eyewear to your cart yet. Start shopping for perfect glasses!
            </p>
            <div className="space-y-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold w-full">
                <Link href="/" className="flex items-center justify-center">
                  Start Shopping
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Link href="/deals" className="block">
                <Button variant="outline" className="w-full">
                  View Today&apos;s Deals
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">You might also like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="Metro Optics Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Metro Optics</h1>
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <h2 className="text-lg font-semibold text-gray-700 hidden sm:block">Eyewear Cart ({cart.length} items)</h2>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-700 sm:hidden">Cart ({cart.length})</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ৳{total.toFixed(0)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <span className="ml-2 text-sm text-gray-600">Checkout</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <span className="ml-2 text-sm text-gray-600">Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      {item.discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Brand: {item.brand}</p>
                          <p className="text-sm text-green-600 mb-2">
                            ✓ In Stock - Delivery within 3-5 days
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-blue-600">${item.price}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                  -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Promo Code</h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1"
                  />
                  <Button
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    variant="outline"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {promoApplied && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Promo code applied! You saved ${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Try: MEGA2024, SAVE10, or WELCOME
                </p>
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="standard"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor="standard" className="font-medium">Standard Shipping</label>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="express"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor="express" className="font-medium">Express Shipping</label>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">$15.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({promoDiscount}%)</span>
                      <span className="font-medium text-green-600">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingMethod === 'express' ? '$15.00' : (shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-lg text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost > 0 && shippingMethod === 'standard' && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Add ${(50 - subtotal + 1).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Link href="/" className="w-full">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Fast Delivery Worldwide</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <span>30-Day Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Authentic Products</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Accepted Payment Methods</p>
                  <div className="flex space-x-2">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">VISA</div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">MC</div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">AMEX</div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">PP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}