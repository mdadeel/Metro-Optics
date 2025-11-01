/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('=== Create Admin User ===\n')
    
    const email = await question('Admin email: ')
    if (!email || !email.includes('@')) {
      console.error('Invalid email address')
      process.exit(1)
    }
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existing) {
      const update = await question(`User ${email} already exists. Update to admin? (y/n): `)
      if (update.toLowerCase() === 'y') {
        await prisma.user.update({
          where: { email },
          data: { role: 'admin' },
        })
        console.log(`✅ Updated ${email} to admin role`)
        process.exit(0)
      } else {
        console.log('Cancelled')
        process.exit(0)
      }
    }
    
    const name = await question('Admin name: ') || 'Admin User'
    const password = await question('Admin password (min 8 chars, must include uppercase, lowercase, number, special char): ')
    
    // Validate password
    if (password.length < 8) {
      console.error('Password must be at least 8 characters')
      process.exit(1)
    }
    if (!/[A-Z]/.test(password)) {
      console.error('Password must contain at least one uppercase letter')
      process.exit(1)
    }
    if (!/[a-z]/.test(password)) {
      console.error('Password must contain at least one lowercase letter')
      process.exit(1)
    }
    if (!/[0-9]/.test(password)) {
      console.error('Password must contain at least one number')
      process.exit(1)
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      console.error('Password must contain at least one special character')
      process.exit(1)
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    })
    
    console.log(`\n✅ Admin user created successfully!`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`\n⚠️  Remember to keep this password secure!`)
    
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()

