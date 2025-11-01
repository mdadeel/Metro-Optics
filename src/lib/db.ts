// Firebase Firestore database wrapper
// This file replaces Prisma and provides a similar interface for Firestore
import { getDb } from './firebase-admin'
import { 
  Query,
  OrderByDirection 
} from 'firebase-admin/firestore'

// Firestore collections
export const collections = {
  users: 'users',
  products: 'products',
  reviews: 'reviews',
  posts: 'posts',
} as const

// Database helper functions
export const db = {
  // Users collection
  user: {
    findUnique: async (args: { where: { id?: string; email?: string } }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.users)
      
      if (args.where.id) {
        const doc = await collectionRef.doc(args.where.id).get()
        return doc.exists ? { id: doc.id, ...doc.data() } : null
      }
      
      if (args.where.email) {
        const snapshot = await collectionRef.where('email', '==', args.where.email).limit(1).get()
        if (snapshot.empty) return null
        const doc = snapshot.docs[0]
        return { id: doc.id, ...doc.data() }
      }
      
      return null
    },
    
    findFirst: async (args?: { where?: Record<string, unknown> }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.users)
      let query: Query = collectionRef as Query
      
      if (args?.where) {
        Object.entries(args.where).forEach(([field, value]) => {
          query = query.where(field, '==', value) as Query
        })
      }
      
      const snapshot = await query.limit(1).get()
      if (snapshot.empty) return null
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    },
    
    create: async (args: { data: Record<string, unknown> }) => {
      const firestore = getDb()
      const docRef = firestore.collection(collections.users).doc()
      const data = {
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await docRef.set(data)
      return { id: docRef.id, ...data }
    },
    
    update: async (args: { where: { id: string }; data: Record<string, unknown> }) => {
      const firestore = getDb()
      const docRef = firestore.collection(collections.users).doc(args.where.id)
      const data = {
        ...args.data,
        updatedAt: new Date(),
      }
      await docRef.update(data)
      const updated = await docRef.get()
      return { id: updated.id, ...updated.data() }
    },
  },
  
  // Products collection
  product: {
    findMany: async (args?: { 
      where?: Record<string, unknown> & { OR?: Array<Record<string, unknown>> }; 
      orderBy?: Record<string, 'asc' | 'desc'>;
      take?: number;
    }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.products)
      
      // Fetch all products first for complex filtering (OR conditions, multiple filters)
      let products: Array<Record<string, unknown> & { id: string }> = []
      
      try {
        // If we have OR conditions or complex filters, fetch all and filter in memory
        if (args?.where?.OR || (args?.where && Object.keys(args.where).length > 1)) {
          const snapshot = await collectionRef.get()
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } else {
          // Build query for simple filters
          let query: Query = collectionRef as Query
          let hasFilter = false
          
          if (args?.where) {
            const whereClause = args.where
            
            if (whereClause.category) {
              query = query.where('category', '==', whereClause.category) as Query
              hasFilter = true
            }
            if (whereClause.brand) {
              query = query.where('brand', '==', whereClause.brand) as Query
              hasFilter = true
            }
            if (whereClause.price?.gte) {
              query = query.where('price', '>=', whereClause.price.gte) as Query
              hasFilter = true
            }
            if (whereClause.price?.lte) {
              query = query.where('price', '<=', whereClause.price.lte) as Query
              hasFilter = true
            }
            if (whereClause.rating?.gte) {
              query = query.where('rating', '>=', whereClause.rating.gte) as Query
              hasFilter = true
            }
            if (whereClause.stock?.gt !== undefined) {
              query = query.where('stock', '>', whereClause.stock.gt) as Query
              hasFilter = true
            }
            if (whereClause.slug) {
              query = query.where('slug', '==', whereClause.slug) as Query
              hasFilter = true
            }
          }
          
          // Apply ordering before limit for better performance
          if (args?.orderBy) {
            const orderByKey = Object.keys(args.orderBy)[0]
            const orderByDirection = args.orderBy[orderByKey] === 'desc' ? 'desc' : 'asc'
            query = query.orderBy(orderByKey, orderByDirection as OrderByDirection) as Query
          }
          
          // Apply limit
          if (args?.take) {
            query = query.limit(args.take) as Query
          }
          
          const snapshot = hasFilter || args?.orderBy ? await query.get() : await collectionRef.get()
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        }
        
        // Apply in-memory filters for OR conditions and complex filters
        if (args?.where) {
          const whereClause = args.where
          
          // Handle OR conditions
          if (whereClause.OR && Array.isArray(whereClause.OR)) {
            products = products.filter(product => {
              return whereClause.OR.some((condition: Record<string, unknown>) => {
                if (condition.badge && typeof condition.badge === 'object' && ('not' in condition.badge)) {
                  const badgeCondition = condition.badge as { not?: null }
                  if (badgeCondition.not === null || badgeCondition.not === undefined) {
                    return product.badge != null
                  }
                }
                if (condition.rating && typeof condition.rating === 'object' && 'gte' in condition.rating) {
                  const ratingCondition = condition.rating as { gte: number }
                  return (Number(product.rating) || 0) >= ratingCondition.gte
                }
                if (condition.reviews && typeof condition.reviews === 'object' && 'gt' in condition.reviews) {
                  const reviewsCondition = condition.reviews as { gt: number }
                  return (Number(product.reviews) || 0) > reviewsCondition.gt
                }
                return false
              })
            })
          }
          
          // Apply additional filters in memory if not already applied
          if (whereClause.category && typeof whereClause.category === 'string') {
            const categoryValue = whereClause.category
            if (!products.every((p) => p.category === categoryValue)) {
              products = products.filter((p) => p.category === categoryValue)
            }
          }
          if (whereClause.brand && typeof whereClause.brand === 'string') {
            const brandValue = whereClause.brand
            if (!products.every((p) => p.brand === brandValue)) {
              products = products.filter((p) => p.brand === brandValue)
            }
          }
          if (whereClause.price && typeof whereClause.price === 'object' && 'gte' in whereClause.price) {
            const minPrice = Number((whereClause.price as { gte: number }).gte)
            products = products.filter((p) => (Number(p.price) || 0) >= minPrice)
          }
          if (whereClause.price && typeof whereClause.price === 'object' && 'lte' in whereClause.price) {
            const maxPrice = Number((whereClause.price as { lte: number }).lte)
            products = products.filter((p) => (Number(p.price) || 0) <= maxPrice)
          }
          if (whereClause.rating && typeof whereClause.rating === 'object' && 'gte' in whereClause.rating) {
            const minRating = Number((whereClause.rating as { gte: number }).gte)
            products = products.filter((p) => (Number(p.rating) || 0) >= minRating)
          }
          if (whereClause.stock && typeof whereClause.stock === 'object' && 'gt' in whereClause.stock) {
            const stockValue = Number((whereClause.stock as { gt: number }).gt)
            products = products.filter((p) => (Number(p.stock) || 0) > stockValue)
          }
        }
        
        // Apply sorting in memory if needed (for OR conditions)
        if (args?.orderBy && args?.where?.OR) {
          const orderByKey = Object.keys(args.orderBy)[0]
          const orderByDirection = args.orderBy[orderByKey] === 'desc' ? -1 : 1
          products.sort((a, b) => {
            const aVal = a[orderByKey] || 0
            const bVal = b[orderByKey] || 0
            return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * orderByDirection
          })
        }
        
        // Apply limit in memory if needed
        if (args?.take && (args?.where?.OR || products.length > (args.take || 0))) {
          products = products.slice(0, args.take)
        }
        
  } catch (error) {
        console.error('Firestore query error:', error)
        return []
      }
      
      return products
    },
    
    findFirst: async (args: { where?: Record<string, unknown> & { OR?: Array<Record<string, unknown>> } }) => {
      const firestore = getDb()
      let query: Query = firestore.collection(collections.products) as Query
      
      if (args.where) {
        if (args.where.OR) {
          // Handle OR by checking each condition
          const conditions = args.where.OR
          for (const condition of conditions) {
            if (condition.slug) {
              query = query.where('slug', '==', condition.slug) as Query
              break
            }
            if (condition.id) {
              // Try direct document fetch first
              try {
                const doc = await firestore.collection(collections.products).doc(condition.id).get()
                if (doc.exists) {
                  return { id: doc.id, ...doc.data() }
                }
              } catch {
                // Fall through to query
              }
              query = query.where('__name__', '==', condition.id) as Query
              break
            }
          }
        } else {
          if (args.where.slug) {
            query = query.where('slug', '==', args.where.slug) as Query
          }
          if (args.where.id) {
            const doc = await firestore.collection(collections.products).doc(args.where.id).get()
            if (doc.exists) {
              return { id: doc.id, ...doc.data() }
            }
          }
        }
      }
      
      const snapshot = await query.limit(1).get()
      if (snapshot.empty) return null
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    },
    
    findUnique: async (args: { where: { id?: string; slug?: string } }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.products)
      
      if (args.where.id) {
        const doc = await collectionRef.doc(args.where.id).get()
        return doc.exists ? { id: doc.id, ...doc.data() } : null
      }
      
      if (args.where.slug) {
        const snapshot = await collectionRef.where('slug', '==', args.where.slug).limit(1).get()
        if (snapshot.empty) return null
        const doc = snapshot.docs[0]
        return { id: doc.id, ...doc.data() }
      }
      
      return null
    },
    
    create: async (args: { data: Record<string, unknown> }) => {
      const firestore = getDb()
      const docRef = firestore.collection(collections.products).doc()
      const data = {
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await docRef.set(data)
      return { id: docRef.id, ...data }
    },
    
    deleteMany: async () => {
      const firestore = getDb()
      const snapshot = await firestore.collection(collections.products).get()
      const batch = firestore.batch()
      snapshot.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
      return { count: snapshot.docs.length }
    },
  },
}

export default db