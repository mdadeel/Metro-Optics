'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Eye, Minus, Plus, Check, ZoomIn, Package, Award, Users, Clock, X, ShoppingBag, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from '@/lib/favorites-context';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('features');
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsStats, setReviewsStats] = useState<any>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSubmitted, setShowReviewSubmitted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch individual product by slug using the new API route
        const response = await fetch(`/api/products/${params.slug}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const product = await response.json();
          setProduct(product);
        } else if (response.status === 404) {
          // Product not found, the component will render the not found UI
          setProduct(null);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  useEffect(() => {
    if (product) {
      async function fetchReviews() {
        try {
          setLoadingReviews(true);
          // Use the slug in the URL as it matches the route parameter
          const response = await fetch(`/api/products/${params.slug}/reviews`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setReviews(data.reviews || []);
            setReviewsStats(data.stats || null);
          }
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
          setReviews([]);
          setReviewsStats(null);
        } finally {
          setLoadingReviews(false);
        }
      }
      fetchReviews();
    }
  }, [product, params.slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRating || !reviewComment.trim()) {
      alert('Please provide a rating and review comment');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      const response = await fetch(`/api/products/${params.slug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // In a real app, this would come from auth context
          userName: 'Current User', // In a real app, this would come from auth context
          rating: selectedRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const newReview = await response.json();
        
        // Update reviews state with the new review
        setReviews([newReview, ...reviews]);
        
        // Update stats
        if (reviewsStats) {
          const newTotal = reviewsStats.total + 1;
          const newAverage = ((reviewsStats.averageRating * reviewsStats.total) + selectedRating) / newTotal;
          setReviewsStats({
            ...reviewsStats,
            total: newTotal,
            averageRating: parseFloat(newAverage.toFixed(2)),
            ratingDistribution: reviewsStats.ratingDistribution.map((dist: any) => 
              dist.rating === selectedRating 
                ? {...dist, count: dist.count + 1, percentage: ((dist.count + 1) / newTotal) * 100}
                : dist
            )
          });
        }
        
        // Reset form
        setSelectedRating(0);
        setReviewTitle('');
        setReviewComment('');
        
        // Show success message
        setShowReviewSubmitted(true);
        setTimeout(() => setShowReviewSubmitted(false), 3000);
      } else {
        console.error('Failed to submit review');
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-200"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading amazing eyewear...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl p-12">
            {/* Animated Icon Container */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Eye className="w-16 h-16 text-orange-400" />
              </div>
              {/* Orbiting dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full animate-spin"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-spin delay-150"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-spin delay-300"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-spin delay-450"></div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">
              The eyewear you're looking for seems to have vanished!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
              We couldn't find the specific product you're looking for. It might have been sold out, removed, or the link might be incorrect. 
              But don't worry - we have many other amazing eyewear options for you to explore!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                asChild
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5" />
                  Back to Products
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                asChild
                className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 text-lg font-semibold"
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            {/* Additional Options */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/eyeglasses">
                    <Eye className="w-4 h-4 mr-1" />
                    Eyeglasses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/sunglasses">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Sunglasses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/contact-lenses">
                    <Search className="w-4 h-4 mr-1" />
                    Contact Lenses
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/deals">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Hot Deals
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleToggleFavorite = () => {
    const isFavorited = favorites.some(fav => fav.id === product.id);
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  const isFavorited = favorites.some(fav => fav.id === product.id);

  // Generate mock images and specifications for demo
  const productImages = [
    product.image,
    `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=600&h=600&fit=crop`,
    `https://images.unsplash.com/photo-${1500000000001 + product.id}?w=600&h=600&fit=crop`,
    `https://images.unsplash.com/photo-${1500000000002 + product.id}?w=600&h=600&fit=crop`
  ];
  
  const productFeatures = product.features || [
    'Polarized Lenses',
    'UV400 Protection',
    'Scratch Resistant Coating',
    'Anti-Glare Treatment',
    'Lightweight Frame',
    'Comfortable Nose Pads',
    'Durable Hinges',
    'High Quality Materials'
  ];
  
  const productSpecifications = {
    'Brand': product.brand,
    'Category': product.category,
    'Material': product.material || 'Premium Acetate',
    'Color': product.color || 'Assorted Colors',
    'Frame Type': product.frameType || 'Full Rim',
    'Shape': product.shape || 'Universal',
    'Lens Width': '52mm',
    'Bridge Width': '18mm',
    'Temple Length': '140mm',
    'Weight': '25g',
    'Protection': 'UV400',
    'Warranty': '1 Year'
  };

  const relatedProducts = []; // This would come from an API

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Metro Optics</h1>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover-lift-subtle" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in-up-smooth animate-stagger-1">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg hover-lift-subtle relative group">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-600 hover:bg-red-700 animate-pulse-once">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageLoading(true);
                  }}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-300 hover-lift-subtle ${
                    selectedImage === index 
                      ? 'border-blue-600 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up-smooth animate-stagger-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="animate-fade-in-up-smooth">
                  {product.category}
                </Badge>
                {product.inStock ? (
                  <Badge variant="outline" className="text-green-600 border-green-600 animate-fade-in-up-smooth animate-stagger-1">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="animate-fade-in-up-smooth animate-stagger-1">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 animate-fade-in-up-smooth animate-stagger-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4 animate-fade-in-up-smooth animate-stagger-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-colors duration-300 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.reviews} reviews</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.brand}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 animate-fade-in-up-smooth animate-stagger-4">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed animate-fade-in-up-smooth animate-stagger-5">
              {product.description}
            </p>

            {/* Key Features - Prominent Display */}
            <div className="animate-fade-in-up-smooth animate-stagger-5">
              <h3 className="font-semibold mb-3 text-lg">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {productFeatures.slice(0, 4).map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover-lift-subtle">
                    <Check className="w-3 h-3" />
                    {feature}
                  </span>
                ))}
                {productFeatures.length > 4 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    +{productFeatures.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up-smooth animate-stagger-5">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover-lift-subtle">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover-lift-subtle">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover-lift-subtle">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">7 Days Return</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg hover-lift-subtle">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-700">Authentic</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4 animate-fade-in-up-smooth animate-stagger-5">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="hover-scale"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover-scale"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 hover-lift text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleToggleFavorite}
                  className={`hover-lift-subtle ${isFavorited ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {showAddedToCart && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg animate-bounce-subtle">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Added to cart successfully!</span>
                  </div>
                </div>
              )}
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full animate-fade-in-up-smooth animate-stagger-5">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="space-y-3 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover-lift-subtle animate-fade-in-up-smooth" style={{animationDelay: `${index * 100}ms`}}>
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="space-y-3 mt-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  {Object.entries(productSpecifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200 last:border-0 hover:bg-white hover:px-3 hover:-mx-3 transition-all duration-200 rounded">
                      <span className="text-sm font-medium text-gray-600">{key}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4 mt-6">
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {reviewsStats?.averageRating || product.rating}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(reviewsStats?.averageRating || product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">
                          Based on {reviewsStats?.total || product.reviews} reviews
                        </p>
                      </div>
                      
                      <div className="lg:col-span-2">
                        {reviewsStats?.ratingDistribution?.map((dist: any) => (
                          <div key={dist.rating} className="flex items-center gap-3 mb-2">
                            <span className="w-8 text-sm font-medium">{dist.rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${dist.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">{dist.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Add Review Form */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Write a Review</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setSelectedRating(star)}
                                className={`${
                                  star <= selectedRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                } hover:text-yellow-400 focus:outline-none`}
                              >
                                <Star className="w-6 h-6" fill={star <= selectedRating ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Summarize your experience"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Share your experience with this product"
                          ></textarea>
                        </div>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700" 
                          disabled={isSubmittingReview}
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                      
                      {showReviewSubmitted && (
                        <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span>Thank you for your review! It has been submitted successfully.</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Reviews List */}
                    <div className="space-y-6">
                      <h4 className="font-semibold text-lg">Customer Reviews</h4>
                      
                      {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-semibold">{review.userName}</h5>
                                  {review.verified && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      <Check className="w-3 h-3" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600">{review.date}</span>
                                </div>
                                <p className="font-medium mb-1">{review.title}</p>
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Product Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Package, title: 'Secure Packaging', description: 'Carefully packed for safe delivery' },
            { icon: Users, title: 'Expert Support', description: 'Professional optometrist assistance' },
            { icon: Award, title: 'Quality Guaranteed', description: '100% authentic products' },
            { icon: Clock, title: 'Fast Delivery', description: 'Quick delivery across Bangladesh' }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover-lift-subtle animate-fade-in-up-smooth" style={{animationDelay: `${index * 100}ms`}}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={productImages[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-full object-contain animate-scale-in-smooth"
          />
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}