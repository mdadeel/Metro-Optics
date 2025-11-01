# Database Scripts

## Create Admin User

Create an admin user in the database:

```bash
npx tsx scripts/create-admin.ts
```

This interactive script will:
- Prompt for email, name, and password
- Validate password requirements
- Hash the password securely
- Create the admin user with role="admin"
- Handle existing users (option to update to admin)

## Password Requirements

Admin passwords must meet these requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Running Migrations

After schema changes, run:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Or in production
npx prisma migrate deploy
```

