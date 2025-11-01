import { db } from '../src/lib/db'
import glassesData from '../src/data/glasses.json'
import { generateSlug } from '../src/lib/utils'

async function main() {
  console.log('🌱 Seeding Firestore database...')
  
  // Clear existing products (optional, for fresh seed)
  await db.product.deleteMany()
  console.log('✅ Cleared existing products')

  // Create products
  let count = 0
  for (const product of glassesData.products) {
    await db.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        reviews: product.reviews,
        stock: 100, // Default stock
        images: [product.image], // Store as array
        badge: product.badge,
        slug: generateSlug(product.name)
      }
    })
    count++
  }
  
  console.log(`✅ Seeded ${count} products to Firestore`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

