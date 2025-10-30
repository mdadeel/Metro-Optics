import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Mock reviews data stored in memory (in a real application, this would come from a database)
const mockReviews = [
  {
    id: 1,
    productId: 'cmhaweccl0000f8hab2345678', // This will be replaced with actual Product IDs
    userId: 1,
    userName: 'Saiful Islam',
    rating: 5,
    title: 'Perfect fit and style',
    comment: 'These glasses look amazing and the fit is perfect. The quality is great and the delivery was fast.',
    date: '2024-09-15',
    verified: true,
  },
  {
    id: 2,
    productId: 'cmhaweccl0000f8hab2345678', // This will be replaced with actual Product IDs
    userId: 2,
    userName: 'Fatima Rahman',
    rating: 4,
    title: 'Good quality',
    comment: 'Nice frames, comfortable to wear all day. Just wish the color was slightly different.',
    date: '2024-09-10',
    verified: true,
  },
  {
    id: 3,
    productId: 'cmhaweccl0001f8hab2345679', // This will be replaced with actual Product IDs
    userId: 3,
    userName: 'Ahmed Hassan',
    rating: 5,
    title: 'Best sunglasses ever!',
    comment: 'The polarized lenses work great for driving. Very stylish and comfortable.',
    date: '2024-09-05',
    verified: true,
  },
  {
    id: 4,
    productId: 'cmhaweccl0002f8hab2345680', // This will be replaced with actual Product IDs
    userId: 4,
    userName: 'Ayesha Akter',
    rating: 4,
    title: 'Good for computer work',
    comment: 'The blue light blocking feature helps reduce eye strain during long work hours.',
    date: '2024-08-28',
    verified: false,
  },
  {
    id: 5,
    productId: 'cmhaweccl0000f8hab2345678', // This will be replaced with actual Product IDs
    userId: 5,
    userName: 'Rahimul Islam',
    rating: 5,
    title: 'Outstanding quality',
    comment: 'Very happy with my purchase. The frames are sturdy and the lenses are clear.',
    date: '2024-08-20',
    verified: true,
  },
];

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'newest';
    const rating = searchParams.get('rating');
    const verifiedOnly = searchParams.get('verified') === 'true';
    
    // Find the product by either slug or ID
    const product = await db.product.findFirst({
      where: {
        OR: [
          { slug: params.productId },
          { id: params.productId }
        ]
      }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Filter reviews by product ID
    const reviews = mockReviews.filter(review => {
      // Check if review is for the specific product by ID
      const matchesProductId = review.productId === product.id;
      
      // Apply filters
      const matchesRating = !rating || review.rating === parseInt(rating);
      const matchesVerified = !verifiedOnly || review.verified;
      
      return matchesProductId && matchesRating && matchesVerified;
    });
    
    // Sort reviews
    switch (sortBy) {
      case 'oldest':
        reviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'newest':
      default:
        reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
    
    // Calculate aggregate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: totalReviews > 0 
        ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 
        : 0
    }));
    
    return NextResponse.json({
      reviews,
      stats: {
        total: totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.userName || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userName, rating, comment' },
        { status: 400 }
      );
    }
    
    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Find the product by either slug or ID
    const product = await db.product.findFirst({
      where: {
        OR: [
          { slug: params.productId },
          { id: params.productId }
        ]
      }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Create new review
    const newReview = {
      id: mockReviews.length + 1,
      productId: product.id,
      userId: body.userId,
      userName: body.userName,
      rating: body.rating,
      title: body.title || `Review for ${product.name}`,
      comment: body.comment,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      verified: false // In a real app, this would be determined by purchase verification
    };
    
    // Add to mock data (in a real app, save to DB)
    mockReviews.push(newReview);
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Reviews API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}