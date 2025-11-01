#!/bin/bash
# Script to remove unwanted files from git tracking

echo "Checking for unwanted files in git..."

# Remove database files if tracked
git rm --cached prisma/dev.db 2>/dev/null && echo "Removed prisma/dev.db from tracking"
git rm --cached db/custom.db 2>/dev/null && echo "Removed db/custom.db from tracking"
git rm --cached *.db 2>/dev/null && echo "Removed *.db files from tracking"

# Remove log files if tracked
git rm --cached dev.log 2>/dev/null && echo "Removed dev.log from tracking"
git rm --cached server.log 2>/dev/null && echo "Removed server.log from tracking"
git rm --cached *.log 2>/dev/null && echo "Removed *.log files from tracking"

# Remove build artifacts if tracked
git rm --cached *.tsbuildinfo 2>/dev/null && echo "Removed *.tsbuildinfo from tracking"
git rm --cached -r .next/ 2>/dev/null && echo "Removed .next/ from tracking"
git rm --cached -r node_modules/ 2>/dev/null && echo "Removed node_modules/ from tracking"

# Remove env files if tracked (be careful!)
if [ -f .env ]; then
  echo "Warning: .env file exists. Make sure it's not committed!"
  git rm --cached .env 2>/dev/null && echo "Removed .env from tracking"
fi

if [ -f .env.local ]; then
  git rm --cached .env.local 2>/dev/null && echo "Removed .env.local from tracking"
fi

echo ""
echo "Done! Files removed from tracking (but kept locally)"
echo "Run 'git commit' to save these changes"

