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
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match && !process.env[match[1].trim()]) {
          process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
        }
      });
    }
  }
}

// Load environment files
loadEnvFiles();

const requiredVars = {
  DATABASE_URL: {
    required: true,
    description: 'Database connection string',
    example: {
      sqlite: 'file:./dev.db',
      postgres: 'postgresql://user:password@host:5432/database?schema=public'
    },
    note: 'For Vercel, use PostgreSQL (not SQLite). See VERCEL_DEPLOYMENT_GUIDE.md'
  }
};

const optionalVars = {
  JWT_SECRET: {
    description: 'JWT secret for authentication (min 32 chars)',
    example: 'your-secret-key-minimum-32-characters-long'
  },
  ALLOWED_ORIGINS: {
    description: 'Comma-separated allowed origins for CORS',
    example: 'http://localhost:3000,https://yourdomain.vercel.app'
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
    console.error('  1. For local development: Create .env.local file');
    console.error('  2. For Vercel: Go to Settings → Environment Variables');
    console.error('  3. See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions\n');

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

