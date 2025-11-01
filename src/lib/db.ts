// Firebase Firestore database wrapper
// This file replaces Prisma and provides a similar interface for Firestore
import { getDb, Firestore } from './firebase-admin'
import { 
  CollectionReference, 
  Query, 
  DocumentData,
  WhereFilterOp,
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
    
    findFirst: async (args?: { where?: any }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.users)
      let query: Query = collectionRef as any
      
      if (args?.where) {
        Object.entries(args.where).forEach(([field, value]) => {
          query = query.where(field, '==', value) as any
        })
      }
      
      const snapshot = await query.limit(1).get()
      if (snapshot.empty) return null
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    },
    
    create: async (args: { data: any }) => {
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
    
    update: async (args: { where: { id: string }; data: any }) => {
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
      where?: any; 
      orderBy?: any;
      take?: number;
    }) => {
      const firestore = getDb()
      const collectionRef = firestore.collection(collections.products)
      
      // Fetch all products first for complex filtering (OR conditions, multiple filters)
      let products: any[] = []
      
      try {
        // If we have OR conditions or complex filters, fetch all and filter in memory
        if (args?.where?.OR || (args?.where && Object.keys(args.where).length > 1)) {
          const snapshot = await collectionRef.get()
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } else {
          // Build query for simple filters
          let query: Query = collectionRef as any
          let hasFilter = false
          
          if (args?.where) {
            const whereClause = args.where
            
            if (whereClause.category) {
              query = query.where('category', '==', whereClause.category) as any
              hasFilter = true
            }
            if (whereClause.brand) {
              query = query.where('brand', '==', whereClause.brand) as any
              hasFilter = true
            }
            if (whereClause.price?.gte) {
              query = query.where('price', '>=', whereClause.price.gte) as any
              hasFilter = true
            }
            if (whereClause.price?.lte) {
              query = query.where('price', '<=', whereClause.price.lte) as any
              hasFilter = true
            }
            if (whereClause.rating?.gte) {
              query = query.where('rating', '>=', whereClause.rating.gte) as any
              hasFilter = true
            }
            if (whereClause.stock?.gt !== undefined) {
              query = query.where('stock', '>', whereClause.stock.gt) as any
              hasFilter = true
            }
            if (whereClause.slug) {
              query = query.where('slug', '==', whereClause.slug) as any
              hasFilter = true
            }
          }
          
          // Apply ordering before limit for better performance
          if (args?.orderBy) {
            const orderByKey = Object.keys(args.orderBy)[0]
            const orderByDirection = args.orderBy[orderByKey] === 'desc' ? 'desc' : 'asc'
            query = query.orderBy(orderByKey, orderByDirection as OrderByDirection) as any
          }
          
          // Apply limit
          if (args?.take) {
            query = query.limit(args.take) as any
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
              return whereClause.OR.some((condition: any) => {
                if (condition.badge?.not === null || condition.badge?.not === undefined) {
                  return product.badge != null
                }
                if (condition.rating?.gte) {
                  return (product.rating || 0) >= condition.rating.gte
                }
                if (condition.reviews?.gt) {
                  return (product.reviews || 0) > condition.reviews.gt
                }
                return false
              })
            })
          }
          
          // Apply additional filters in memory if not already applied
          if (whereClause.category && !products.every((p: any) => p.category === whereClause.category)) {
            products = products.filter((p: any) => p.category === whereClause.category)
          }
          if (whereClause.brand && !products.every((p: any) => p.brand === whereClause.brand)) {
            products = products.filter((p: any) => p.brand === whereClause.brand)
          }
          if (whereClause.price?.gte) {
            products = products.filter((p: any) => (p.price || 0) >= whereClause.price.gte)
          }
          if (whereClause.price?.lte) {
            products = products.filter((p: any) => (p.price || 0) <= whereClause.price.lte)
          }
          if (whereClause.rating?.gte) {
            products = products.filter((p: any) => (p.rating || 0) >= whereClause.rating.gte)
          }
          if (whereClause.stock?.gt !== undefined) {
            products = products.filter((p: any) => (p.stock || 0) > whereClause.stock.gt)
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
    
    findFirst: async (args: { where?: any }) => {
      const firestore = getDb()
      let query: Query = firestore.collection(collections.products) as any
      
      if (args.where) {
        if (args.where.OR) {
          // Handle OR by checking each condition
          const conditions = args.where.OR
          for (const condition of conditions) {
            if (condition.slug) {
              query = query.where('slug', '==', condition.slug) as any
              break
            }
            if (condition.id) {
              // Try direct document fetch first
              try {
                const doc = await firestore.collection(collections.products).doc(condition.id).get()
                if (doc.exists) {
                  return { id: doc.id, ...doc.data() }
                }
              } catch (e) {
                // Fall through to query
              }
              query = query.where('__name__', '==', condition.id) as any
              break
            }
          }
        } else {
          if (args.where.slug) {
            query = query.where('slug', '==', args.where.slug) as any
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
    
    create: async (args: { data: any }) => {
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