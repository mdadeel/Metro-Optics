'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Clock, Tag, Gift, Percent, Star, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'bundle';
  code: string;
  validUntil: string;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  categories: string[];
  image: string;
  featured: boolean;
  terms: string[];
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'Summer Spectacular Sale',
    description: 'Get 30% off on all sunglasses. Perfect timing for the sunny season ahead!',
    discount: '30% OFF',
    type: 'percentage',
    code: 'SUMMER30',
    validUntil: '2024-08-31',
    maxDiscount: 2000,
    applicableProducts: ['all'],
    categories: ['sunglasses'],
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=250&fit=crop&crop=center',
    featured: true,
    terms: [
      'Valid on all sunglasses',
      'Maximum discount ৳2000',
      'Cannot be combined with other offers',
      'Valid until August 31, 2024'
    ]
  },
  {
    id: '2',
    title: 'Blue Light Protection Bundle',
    description: 'Buy 2 blue light glasses and get 1 absolutely free. Protect your eyes all day!',
    discount: 'BUY 2 GET 1',
    type: 'bogo',
    code: 'BLUETECH3',
    validUntil: '2024-07-31',
    applicableProducts: ['blue-light'],
    categories: ['eyeglasses'],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=250&fit=crop&crop=center',
    featured: true,
    terms: [
      'Buy 2 get 1 free on blue light glasses',
      'Lowest priced item will be free',
      'Cannot be combined with other discounts',
      'Valid while stocks last'
    ]
  },
  {
    id: '3',
    title: 'First Time Shopper Special',
    description: 'New to OpticalBD? Enjoy 20% off your first order plus free shipping!',
    discount: '20% OFF',
    type: 'percentage',
    code: 'WELCOME20',
    validUntil: '2024-12-31',
    maxDiscount: 1500,
    applicableProducts: ['all'],
    categories: ['eyeglasses', 'sunglasses'],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=250&fit=crop&crop=center',
    featured: false,
    terms: [
      'Valid for first-time customers only',
      'Maximum discount ৳1500',
      'Free shipping on all orders',
      'One-time use per customer'
    ]
  },
  {
    id: '4',
    title: 'Premium Brands Week',
    description: 'Exclusive 25% off on Gucci, Prada, and Persol collections. Luxury awaits!',
    discount: '25% OFF',
    type: 'percentage',
    code: 'LUXURY25',
    validUntil: '2024-07-15',
    maxDiscount: 5000,
    applicableProducts: ['Gucci', 'Prada', 'Persol'],
    categories: ['eyeglasses', 'sunglasses'],
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=250&fit=crop&crop=center',
    featured: true,
    terms: [
      'Valid on Gucci, Prada, and Persol products',
      'Maximum discount ৳5000',
      'Limited stock available',
      'Valid until July 15, 2024'
    ]
  },
  {
    id: '5',
    title: 'Kids Collection Happy Hour',
    description: 'Buy any kids glasses and get a free cleaning kit and case. Keep them happy!',
    discount: 'FREE KIT',
    type: 'bundle',
    code: 'KIDSKIT',
    validUntil: '2024-08-15',
    minPurchase: 1500,
    applicableProducts: ['Disney'],
    categories: ['eyeglasses'],
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=250&fit=crop&crop=center',
    featured: false,
    terms: [
      'Free cleaning kit and case with kids glasses',
      'Minimum purchase ৳1500',
      'Valid on Disney collection',
      'While stocks last'
    ]
  },
  {
    id: '6',
    title: 'Weekend Flash Sale',
    description: 'Flat ৳500 off on all orders above ৳3000. Limited time weekend special!',
    discount: '৳500 OFF',
    type: 'fixed',
    code: 'WEEKEND500',
    validUntil: '2024-06-30',
    minPurchase: 3000,
    applicableProducts: ['all'],
    categories: ['eyeglasses', 'sunglasses'],
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=250&fit=crop&crop=center',
    featured: true,
    terms: [
      'Flat ৳500 off on orders above ৳3000',
      'Valid only on weekends',
      'Cannot be combined with cashback',
      'Limited to first 100 customers per day'
    ]
  }
];

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');


  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           offer.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             offer.categories.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch {
      // Fallback for browsers that don't support clipboard API or permission denied
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        document.body.removeChild(textArea);
        console.error('Failed to copy code:', fallbackErr);
      }
    }
  };

  const getOfferTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5" />;
      case 'fixed':
        return <Tag className="w-5 h-5" />;
      case 'bogo':
        return <Gift className="w-5 h-5" />;
      case 'bundle':
        return <ShoppingCart className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Tag className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Amazing Offers & Deals
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Exclusive discounts and special promotions just for you. Save big on premium eyewear!
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Offers' },
              { id: 'eyeglasses', label: 'Eyeglasses' },
              { id: 'sunglasses', label: 'Sunglasses' }
            ].map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'hover:border-emerald-600 hover:text-emerald-600'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Offers */}
      {filteredOffers.filter(offer => offer.featured).length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured Deals</h2>
              <p className="text-gray-600">Don&apos;t miss out on these limited-time offers</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {filteredOffers.filter(offer => offer.featured).map((offer) => (
                <Card key={offer.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-emerald-200">
                  <div className="relative">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                        {offer.discount}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      {getOfferTypeIcon(offer.type)}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                        <p className="text-gray-600 mb-4">{offer.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getDaysRemaining(offer.validUntil)} days left</span>
                      </div>
                      {offer.minPurchase && (
                        <div className="text-sm text-gray-600">
                          Min. ৳{offer.minPurchase}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Promo Code:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-3 py-1 rounded border font-mono text-sm">
                            {offer.code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(offer.code)}
                            className="text-xs"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all transform hover:scale-105">
                        Shop Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Offers */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Available Offers</h2>
            <p className="text-gray-600">More ways to save on your favorite eyewear</p>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No offers found</h3>
                <p>Try adjusting your search or filter</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-emerald-600 text-white px-2 py-1 text-xs">
                        {offer.discount}
                      </Badge>
                    </div>
                    {offer.featured && (
                      <div className="absolute top-3 right-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{offer.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysRemaining(offer.validUntil)} days</span>
                      </div>
                      <div className="bg-gray-100 px-2 py-1 rounded">
                        <code className="text-xs font-mono">{offer.code}</code>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all transform hover:scale-105"
                      onClick={() => copyToClipboard(offer.code)}
                    >
                      Copy Code & Shop
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Terms Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Important Terms & Conditions</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">All offers are valid for a limited time only and subject to availability.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Promo codes cannot be combined with other ongoing offers or discounts.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">OpticalBD reserves the right to modify or cancel any offer without prior notice.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">For any queries regarding offers, please contact our customer support team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}