# DATABASE_URL Error - Quick Fix

## 🚨 Error You're Seeing

```
Error: Environment variable not found: DATABASE_URL.
  -->  prisma/schema.prisma:7
```

## ✅ Solution

### Set DATABASE_URL in Vercel:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Add Environment Variable:**
   ```
   Name: DATABASE_URL
   Value: (see options below)
   ```

3. **Choose Your Database:**

   **Option A: Vercel Postgres (Recommended)**
   - In Vercel: **Storage** → **Create Database** → **Postgres**
   - Vercel automatically sets `DATABASE_URL`
   - Update `prisma/schema.prisma`: Change `provider = "sqlite"` to `provider = "postgresql"`

   **Option B: SQLite (Not Recommended for Vercel)**
   - Value: `file:./dev.db`
   - ⚠️ **Warning**: SQLite doesn't persist on Vercel serverless

   **Option C: External PostgreSQL**
   - Sign up for [Supabase](https://supabase.com) or [Neon](https://neon.tech)
   - Copy connection string: `postgresql://user:password@host:5432/database`
   - Set as `DATABASE_URL` in Vercel

4. **Redeploy**
   - Push changes or trigger redeploy in Vercel
   - Build should now succeed

## 📋 Required Environment Variables

Set these in **Vercel → Settings → Environment Variables**:

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ Yes | `postgresql://...` or `file:./dev.db` |
| `JWT_SECRET` | ⚠️ Recommended | Random 32+ char string |
| `ALLOWED_ORIGINS` | ⚠️ Recommended | `https://yourdomain.vercel.app` |

## 🔧 If Using PostgreSQL

After setting up PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then commit and push - migrations will run automatically on deploy.

## ✅ Verify Fix

After setting `DATABASE_URL` and redeploying:

1. **Check Build Logs** - Should see:
   ```
   ✓ Generated Prisma Client
   ✓ Compiled successfully
   ```

2. **Test Health Endpoint:**
   ```
   https://yourdomain.vercel.app/api/health
   ```

## 📖 More Help

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

**Quick Action**: Set `DATABASE_URL` in Vercel → Settings → Environment Variables → Redeploy ✅

