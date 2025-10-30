import { db } from './src/lib/db';

async function checkProducts() {
  try {
    // Get first few products to verify
    const sampleProducts = await db.product.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        slug: true,
        images: true
      }
    });
    
    console.log('Sample products with image data:');
    sampleProducts.forEach(product => {
      console.log(`Name: ${product.name}`);
      console.log(`Slug: ${product.slug}`);
      console.log(`Images: ${JSON.stringify(product.images)}`);
      console.log(`Price: ${product.price}, Category: ${product.category}`);
      console.log('---');
    });
    
    await db.$disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error checking products:', error);
    process.exit(1);
  }
}

checkProducts();