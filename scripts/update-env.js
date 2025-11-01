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

  // Get Firebase Configuration
  console.log('🔥 Firebase Configuration');
  console.log('Get your Firebase config from: Firebase Console → Project Settings → General → Your apps\n');
  
  const projectId = await question('Enter NEXT_PUBLIC_FIREBASE_PROJECT_ID: ');
  if (!projectId || !projectId.trim()) {
    console.error('❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
    process.exit(1);
  }

  // Update or add Firebase Project ID
  if (envContent.includes('NEXT_PUBLIC_FIREBASE_PROJECT_ID=')) {
    envContent = envContent.replace(/NEXT_PUBLIC_FIREBASE_PROJECT_ID=.*/g, `NEXT_PUBLIC_FIREBASE_PROJECT_ID="${projectId.trim()}"`);
  } else {
    envContent += `\nNEXT_PUBLIC_FIREBASE_PROJECT_ID="${projectId.trim()}"\n`;
  }
  
  // Optional Firebase config
  const addFirebaseConfig = await question('\nAdd full Firebase client config? (y/n): ');
  if (addFirebaseConfig.toLowerCase() === 'y') {
    const apiKey = await question('NEXT_PUBLIC_FIREBASE_API_KEY: ');
    const authDomain = await question('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ');
    const storageBucket = await question('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ');
    const messagingSenderId = await question('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ');
    const appId = await question('NEXT_PUBLIC_FIREBASE_APP_ID: ');
    
    const firebaseVars = {
      'NEXT_PUBLIC_FIREBASE_API_KEY': apiKey.trim(),
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': authDomain.trim(),
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': storageBucket.trim(),
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': messagingSenderId.trim(),
      'NEXT_PUBLIC_FIREBASE_APP_ID': appId.trim(),
    };
    
    for (const [key, value] of Object.entries(firebaseVars)) {
      if (value) {
        if (envContent.includes(`${key}=`)) {
          envContent = envContent.replace(new RegExp(`${key}=.*`, 'g'), `${key}="${value}"`);
        } else {
          envContent += `${key}="${value}"\n`;
        }
      }
    }
  }
  
  // Service Account Key (optional)
  const addServiceAccount = await question('\nAdd Firebase Service Account Key? (y/n): ');
  if (addServiceAccount.toLowerCase() === 'y') {
    console.log('\n⚠️  Paste the entire service account JSON. Press Enter when done, then Ctrl+D (or Ctrl+Z on Windows):');
    let serviceAccountJson = '';
    for await (const line of readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })) {
      serviceAccountJson += line + '\n';
    }
    
    if (serviceAccountJson.trim()) {
      try {
        // Validate JSON
        JSON.parse(serviceAccountJson);
        if (envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY=')) {
          envContent = envContent.replace(/FIREBASE_SERVICE_ACCOUNT_KEY=.*/g, `FIREBASE_SERVICE_ACCOUNT_KEY='${serviceAccountJson.trim().replace(/'/g, "\\'")}'`);
        } else {
          envContent += `FIREBASE_SERVICE_ACCOUNT_KEY='${serviceAccountJson.trim().replace(/'/g, "\\'")}'\n`;
        }
      } catch (e) {
        console.error('❌ Invalid JSON. Service account key not added.');
      }
    }
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


  // Write .env.local
  fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
  console.log(`\n✅ Updated ${envPath}`);

  // Ask about Vercel
  console.log('\n🚀 Vercel Deployment');
  const setupVercel = await question('Do you want instructions for setting up Vercel? (y/n): ');
  if (setupVercel.toLowerCase() === 'y') {
    console.log('\n📝 To set Firebase config in Vercel:');
    console.log('   1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log(`   2. Add: NEXT_PUBLIC_FIREBASE_PROJECT_ID = ${projectId.trim()}`);
    console.log('   3. Add other Firebase variables if needed');
    console.log('   4. Select: Production, Preview, Development');
    console.log('   5. Save');
  }

  rl.close();

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run db:seed (to seed products)');
  console.log('  2. Run: npm run create-admin (to create admin user)');
  console.log('');
}

main().catch(console.error);

