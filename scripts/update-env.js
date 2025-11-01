#!/usr/bin/env node

/**
 * Helper script to update .env.local with database connection
 * Usage: node scripts/update-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🔧 Metro Optics Environment Setup\n');
  console.log('This script will help you set up your .env.local file.\n');

  const envPath = path.join(process.cwd(), '.env.local');
  const examplePath = path.join(process.cwd(), '.env.example');
  
  let envContent = '';

  // Load existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
    console.log('✅ Found existing .env.local\n');
  } else if (fs.existsSync(examplePath)) {
    envContent = fs.readFileSync(examplePath, 'utf-8');
    console.log('📝 Using .env.example as template\n');
  }

  // Get DATABASE_URL
  console.log('📊 Database Configuration');
  console.log('Get your connection string from: Supabase Dashboard → Settings → Database → Connection string\n');
  
  const dbUrl = await question('Enter DATABASE_URL (Supabase PostgreSQL connection string): ');
  if (!dbUrl || !dbUrl.trim()) {
    console.error('❌ DATABASE_URL is required');
    process.exit(1);
  }

  // Update or add DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${dbUrl.trim()}"`);
  } else {
    envContent += `\nDATABASE_URL="${dbUrl.trim()}"\n`;
  }

  // Get JWT_SECRET
  console.log('\n🔐 JWT Secret Configuration');
  const hasJwt = envContent.includes('JWT_SECRET=');
  const jwtSecret = await question(`Enter JWT_SECRET ${hasJwt ? '(press Enter to keep existing)' : '(min 32 chars, or press Enter to generate)'}: `);
  
  if (!jwtSecret.trim() && !hasJwt) {
    // Generate JWT secret
    const crypto = require('crypto');
    const generatedSecret = crypto.randomBytes(32).toString('hex');
    envContent += `JWT_SECRET="${generatedSecret}"\n`;
    console.log(`✅ Generated JWT_SECRET: ${generatedSecret.substring(0, 20)}...`);
  } else if (jwtSecret.trim()) {
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET="${jwtSecret.trim()}"`);
    } else {
      envContent += `JWT_SECRET="${jwtSecret.trim()}"\n`;
    }
  }

  // Add Supabase URL and key (optional)
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    const addSupabase = await question('\nAdd Supabase client keys? (y/n): ');
    if (addSupabase.toLowerCase() === 'y') {
      const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL (https://vxaoggvubqzlmogkzsvc.supabase.co): ');
      const supabaseKey = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY: ');
      if (supabaseUrl.trim()) {
        envContent += `NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl.trim()}"\n`;
      }
      if (supabaseKey.trim()) {
        envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseKey.trim()}"\n`;
      }
    }
  }

  // Write .env.local
  fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
  console.log(`\n✅ Updated ${envPath}`);

  // Ask about Vercel
  console.log('\n🚀 Vercel Deployment');
  const setupVercel = await question('Do you want instructions for setting up Vercel? (y/n): ');
  if (setupVercel.toLowerCase() === 'y') {
    console.log('\n📝 To set DATABASE_URL in Vercel:');
    console.log('   1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('   2. Add: DATABASE_URL = ' + dbUrl.trim());
    console.log('   3. Select: Production, Preview, Development');
    console.log('   4. Save');
  }

  rl.close();

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run db:generate');
  console.log('  2. Run: npm run db:push');
  console.log('  3. Run: npm run db:seed (optional)');
  console.log('');
}

main().catch(console.error);

