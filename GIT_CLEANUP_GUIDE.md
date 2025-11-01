# Git Cleanup Guide - Preventing Unwanted Files

## Files Now Ignored by .gitignore

The `.gitignore` file has been updated to exclude:

### ✅ Database Files
- `*.db` - All database files
- `db/` - Database directory
- `prisma/*.db` - Prisma database files
- `prisma/dev.db` - Development database
- `prisma/custom.db` - Custom database

### ✅ Log Files
- `*.log` - All log files
- `dev.log` - Development log
- `server.log` - Server log
- `npm-debug.log*` - npm debug logs
- `yarn-*.log` - yarn logs
- `pnpm-debug.log*` - pnpm logs

### ✅ Build Artifacts
- `.next/` - Next.js build output
- `out/` - Next.js export output
- `build/` - Build directory
- `dist/` - Distribution directory
- `*.tsbuildinfo` - TypeScript build info

### ✅ Environment Files
- `.env*` - All environment files
- `.env.local` - Local environment
- `.env.production` - Production environment

### ✅ Dependencies
- `node_modules/` - Node modules
- `/.pnp` - Yarn PnP files
- `.yarn/*` - Yarn cache

### ✅ IDE & Editor Files
- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `*.swp`, `*.swo` - Vim swap files
- `.project`, `.classpath` - Eclipse files

### ✅ OS Files
- `.DS_Store` - macOS metadata
- `Thumbs.db` - Windows thumbnails
- `desktop.ini` - Windows desktop config

### ✅ Temporary Files
- `*.tmp`, `*.temp` - Temporary files
- `.cache/` - Cache directories
- `tmp/`, `temp/` - Temporary directories

### ✅ Coverage Reports
- `coverage/` - Test coverage
- `.nyc_output/` - NYC coverage
- `*.lcov` - LCOV reports

## Current Untracked Files

These files are not tracked by git (as expected):

1. **Documentation Files** (optional - you can commit these if you want):
   - `BUG_DETECTION_PLAN.md`
   - `DEBUGGING_GUIDE.md`
   - `FIXES_APPLIED.md`

2. **Test Endpoint**:
   - `src/app/api/db-test/` - Database test endpoint (useful for debugging)

## Cleaning Up Previously Tracked Files

If you have already committed files that should be ignored:

### Option 1: Use the Cleanup Script
```bash
./cleanup-git.sh
```

### Option 2: Manual Cleanup
```bash
# Remove database files from tracking (keeps local files)
git rm --cached prisma/dev.db
git rm --cached db/custom.db

# Remove log files from tracking
git rm --cached dev.log
git rm --cached server.log

# Remove build artifacts
git rm --cached -r .next/
git rm --cached *.tsbuildinfo

# Commit the changes
git commit -m "Remove unwanted files from git tracking"
```

## Verifying .gitignore is Working

Check if files are being ignored:
```bash
# Check specific files
git check-ignore prisma/dev.db
git check-ignore dev.log

# See all ignored files
git status --ignored
```

## .gitattributes File

A `.gitattributes` file has been added to ensure:
- Text files use LF line endings
- Binary files (images, databases) are properly handled
- Consistent behavior across different operating systems

## Before Committing

Always check what you're about to commit:
```bash
# See what will be committed
git status

# See detailed changes
git diff --cached

# Check for accidental inclusion of ignored files
git ls-files | grep -E "\.(db|log|tsbuildinfo)$"
```

## Recommended Workflow

1. **Before committing:**
   ```bash
   git status  # Review what will be committed
   ```

2. **If you see unwanted files:**
   ```bash
   ./cleanup-git.sh  # Remove from tracking
   git commit -m "Your commit message"
   ```

3. **Verify before pushing:**
   ```bash
   git log --oneline -1  # Check last commit
   git show --name-status HEAD  # See files in last commit
   ```

## Common Mistakes to Avoid

❌ **Don't commit:**
- Database files (`.db`)
- Environment files (`.env*`)
- Log files (`*.log`)
- Build artifacts (`.next/`, `node_modules/`)
- Personal IDE settings

✅ **Do commit:**
- Source code (`.ts`, `.tsx`, `.js`, `.jsx`)
- Configuration files (`.json`, `.yml`)
- Documentation (`.md`) - if useful for team
- Migration files (`prisma/migrations/`)

## Environment Variables

**Important:** Never commit `.env` files with secrets!

- Add `.env*` to `.gitignore` ✅ (already done)
- Use Vercel's environment variables for production
- Create `.env.example` with placeholder values (safe to commit)

Example `.env.example`:
```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

