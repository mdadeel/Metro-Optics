import { PrismaClient } from '@prisma/client'
import glassesData from '../src/data/glasses.json'

const prisma = new PrismaClient()

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  // Clear existing products (optional, for fresh seed)
  await prisma.product.deleteMany({})

  // Create products
  for (const product of glassesData.products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price, // Price is already in correct format
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        reviews: product.reviews,
        stock: 100, // Default stock
        images: [product.image], // Store as JSON array
        badge: product.badge,
        slug: generateSlug(product.name) // Generate and include slug
      }
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })