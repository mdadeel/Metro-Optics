#!/usr/bin/env node

/**
 * Pre-build script to check required environment variables
 * Provides helpful error messages if variables are missing
 */

const fs = require('fs');
const path = require('path');

// Load .env.local and .env files if they exist
function loadEnvFiles() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = path.join(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        // Skip comments and empty lines
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        // Match key=value pattern (handles quoted and unquoted values)
        const match = trimmed.match(/^([^=#\s]+)\s*=\s*(.+)$/);
        if (match && !process.env[match[1].trim()]) {
          let value = match[2].trim();
          // Remove surrounding quotes (single or double)
          value = value.replace(/^["']|["']$/g, '');
          process.env[match[1].trim()] = value;
        }
      });
    }
  }
}

// Check if we're on Vercel or CI (where .env files won't exist)
const isVercel = !!process.env.VERCEL;
const isCI = !!process.env.CI;

// Only load local env files if not on Vercel/CI
if (!isVercel && !isCI) {
  loadEnvFiles();
}

const requiredVars = {
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: {
    required: true,
    description: 'Firebase project ID',
    example: 'your-project-id',
    note: 'Get this from Firebase Console → Project Settings'
  },
  JWT_SECRET: {
    required: true, // Required for production builds
    description: 'JWT secret for authentication (min 32 chars, required)',
    example: 'your-secret-key-minimum-32-characters-long'
  }
};

const optionalVars = {
  FIREBASE_SERVICE_ACCOUNT_KEY: {
    description: 'Firebase service account JSON (for server-side admin operations)',
    example: '{"type":"service_account","project_id":"..."}',
    note: 'Optional: Can use Application Default Credentials instead'
  },
  NEXT_PUBLIC_FIREBASE_API_KEY: {
    description: 'Firebase API key (for client-side operations)',
    example: 'AIzaSy...'
  },
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {
    description: 'Firebase Auth domain',
    example: 'your-project.firebaseapp.com'
  },
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {
    description: 'Firebase Storage bucket',
    example: 'your-project.appspot.com'
  },
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: {
    description: 'Firebase Messaging sender ID',
    example: '123456789'
  },
  NEXT_PUBLIC_FIREBASE_APP_ID: {
    description: 'Firebase App ID',
    example: '1:123456789:web:abcdef'
  }
};


function checkEnvironmentVariables() {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const [varName, config] of Object.entries(requiredVars)) {
    if (!process.env[varName]) {
      missing.push({ name: varName, ...config });
    }
  }

  // Check optional variables (warnings only)
  for (const [varName, config] of Object.entries(optionalVars)) {
    if (!process.env[varName]) {
      warnings.push({ name: varName, ...config });
    }
  }

  // Print errors
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:\n');
    missing.forEach(({ name, description, example, note }) => {
      console.error(`  ${name}:`);
      console.error(`    Description: ${description}`);
      if (example) {
        console.error(`    Examples:`);
        if (typeof example === 'object') {
          Object.entries(example).forEach(([key, value]) => {
            console.error(`      ${key}: ${value}`);
          });
        } else {
          console.error(`      ${example}`);
        }
      }
      if (note) {
        console.error(`    Note: ${note}`);
      }
      console.error('');
    });

    console.error('\n📝 To fix:');
    if (isVercel) {
      console.error('  This is a Vercel build. Set Firebase config in:');
      console.error('  Vercel Dashboard → Your Project → Settings → Environment Variables');
      console.error('  Add: NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id');
      console.error('  Make sure to select the correct environment (Production/Preview/Development)');
    } else {
      console.error('  1. For local development: Create .env.local file with Firebase config');
      console.error('  2. For Vercel: Go to Settings → Environment Variables');
      console.error('  3. See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions');
    }
    console.error('');

    process.exit(1);
  }

  // Print warnings
  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('\n⚠️  Missing optional environment variables (recommended for production):\n');
    warnings.forEach(({ name, description, example }) => {
      console.warn(`  ${name}: ${description}`);
      if (example) {
        console.warn(`    Example: ${example}`);
      }
      console.warn('');
    });
  }

  // Success message
  if (missing.length === 0) {
    console.log('✅ All required environment variables are set\n');
  }
}

// Run check
checkEnvironmentVariables();

