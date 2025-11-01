#!/bin/bash

# Database Setup Script for Metro Optics
# This script helps set up the database connection and run migrations

set -e

echo "🚀 Metro Optics Database Setup"
echo "================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in environment"
    echo ""
    echo "Please set DATABASE_URL in .env.local:"
    echo "  DATABASE_URL=\"postgresql://postgres:password@host:port/database\""
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo "⚠️  Please update DATABASE_URL in .env.local with your Supabase connection string"
        exit 1
    else
        echo "❌ .env.example not found. Please create .env.local manually"
        exit 1
    fi
fi

echo "📦 Installing dependencies (if needed)..."
npm install --silent

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📊 Pushing schema to database..."
npx prisma db push

echo ""
read -p "🌱 Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npx prisma db seed
    echo "✅ Database seeded successfully"
else
    echo "⏭️  Skipping database seed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🧪 Testing connection..."
npm run build > /dev/null 2>&1 && echo "✅ Build successful - database connection working!" || echo "❌ Build failed - check your DATABASE_URL"

echo ""
echo "📝 Next steps:"
echo "  1. Test API: curl http://localhost:3000/api/db-test"
echo "  2. Check health: curl http://localhost:3000/api/health"
echo "  3. Add DATABASE_URL to Vercel Environment Variables"
echo ""

