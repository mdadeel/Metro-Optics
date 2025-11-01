# Debugging Guide: No Cards Showing in Vercel

## Quick Diagnostic Steps

### 1. Check Database Connection
Visit `/api/health` on your Vercel deployment. This will show:
- Database connection status
- Product count in database
- Overall health status

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "productCount": 50
}
```

**If database is "error":**
- Check `DATABASE_URL` environment variable in Vercel
- Verify database file exists and is accessible
- SQLite may not work well on Vercel (consider PostgreSQL)

### 2. Check Products API
Visit `/api/products` on your Vercel deployment.

**Expected Response:**
```json
[
  {
    "id": "1",
    "name": "Product Name",
    "price": 2999,
    ...
  }
]
```

**If empty array or error:**
- Check Vercel function logs for database errors
- Verify DATABASE_URL is set correctly
- Check if database file is included in deployment

### 3. Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Check for errors mentioning:
   - "Database connection failed"
   - "ENOENT" (file not found)
   - "SQLite"

### 4. Check Browser Console
1. Open browser DevTools
2. Go to Network tab
3. Check `/api/products` request:
   - Status code (should be 200)
   - Response body (should contain products array)
   - Error messages

## Common Issues and Solutions

### Issue 1: SQLite on Vercel
**Problem:** SQLite files don't persist in Vercel's serverless environment.

**Solutions:**
1. **Use Vercel Postgres** (Recommended)
   - Add Vercel Postgres to your project
   - Update Prisma schema to use PostgreSQL
   - Update DATABASE_URL to PostgreSQL connection string

2. **Use External Database**
   - Use a managed PostgreSQL database (Supabase, Neon, etc.)
   - Update DATABASE_URL accordingly

### Issue 2: Empty Database
**Problem:** Database exists but has no products.

**Solutions:**
1. **Check Seed Script:**
   - Verify `prisma/seed.ts` runs correctly
   - Check if `postbuild` script executes: `prisma db seed`
   - Manually run seed: `npm run db:seed` or `npx prisma db seed`

2. **Manual Seeding:**
   ```bash
   npx prisma db seed
   ```

### Issue 3: Environment Variables
**Problem:** DATABASE_URL not set in Vercel.

**Solutions:**
1. Go to Vercel Project Settings
2. Navigate to "Environment Variables"
3. Add `DATABASE_URL` with your database connection string
4. Redeploy the application

### Issue 4: Database File Not Deployed
**Problem:** SQLite database file not included in deployment.

**Solutions:**
1. Check `.gitignore` - `*.db` files are ignored
2. For SQLite, you need to seed the database during build
3. Consider using a cloud database instead

## Debugging Checklist

- [ ] `/api/health` shows database connected
- [ ] `/api/products` returns products array (not empty)
- [ ] Vercel logs show no database errors
- [ ] Browser console shows no API errors
- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] Database has been seeded with products
- [ ] Frontend shows proper error messages (if database fails)

## Enhanced Logging

The updated code now includes:
- Console logs showing product counts
- Detailed error messages in development
- Database connection status in health endpoint
- Better error handling in API routes

## Testing Locally

1. **Test with empty database:**
   ```bash
   rm prisma/dev.db
   npm run dev
   ```
   - Should show empty state message

2. **Test with seeded database:**
   ```bash
   npx prisma db seed
   npm run dev
   ```
   - Should show products

3. **Test database connection:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## Next Steps

If the issue persists:
1. Share the `/api/health` response
2. Share relevant Vercel logs
3. Share browser console errors
4. Verify DATABASE_URL format is correct

