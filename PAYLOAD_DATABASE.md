# Payload Database & Migrations Guide

## Overview

This project uses **Payload CMS** with **PostgreSQL** database. Payload offers two ways to handle database schema changes:

1. **Dev Mode** - Automatically pushes schema changes to database
2. **Migration Mode** - Uses migration files for controlled, trackable changes

## Available Commands

```bash
pnpm dev                 # Start dev server (auto-pushes schema changes)
pnpm migrate:create      # Generate migration file from schema changes
pnpm migrate             # Apply pending migrations to database
pnpm migrate:status      # Check which migrations have been applied
pnpm generate:types      # Generate TypeScript types from Payload config
```

## Understanding Dev Mode vs Migrations

### Dev Mode (`pnpm dev`)
- Automatically detects schema changes in collections
- Pushes changes directly to database (like Drizzle's push mode)
- Fast iteration for local development
- **Does NOT create migration files**
- Changes are not tracked in version control

### Migration Mode (`pnpm migrate`)
- Uses migration files in `/src/migrations/`
- Provides version control for database changes
- Required for production deployments
- Allows rollback capabilities
- Team members can sync database schema

## Common Warning ⚠️

```
? It looks like you've run Payload in dev mode, meaning you've 
  dynamically pushed changes to your database.

  If you'd like to run migrations, data loss will occur. 
  Would you like to proceed? › (y/N)
```

**What this means:**
- Your database was already updated by dev mode
- Running migrations now may conflict with existing schema
- Could cause data loss if migrations recreate tables/columns

**When you see this:**
- Your local database is already up-to-date
- You can skip `pnpm migrate` locally
- Just commit the migration files for production

## Recommended Workflows

### For Local Development

**Option 1: Dev Mode Only (Simplest)**
```bash
# 1. Make changes to collections (e.g., src/collections/Rooms.ts)
# 2. Start dev server
pnpm dev

# 3. Before deploying, create migration for production
pnpm migrate:create

# 4. Commit migration files
git add src/migrations/
git commit -m "Add migration for collection changes"
```

**Option 2: Migration-First (Production-like)**
```bash
# 1. Make changes to collections
# 2. Create migration file
pnpm migrate:create

# 3. Apply migration to local database
pnpm migrate

# 4. Start dev server to test
pnpm dev

# 5. Commit everything
git add .
git commit -m "Update collection schema"
```

### For Production Deployment

```bash
# 1. Ensure migrations are created and committed
git add src/migrations/
git commit -m "Add database migrations"

# 2. Push to Railway
git push origin main

# Railway will automatically run: pnpm migrate
```

## Migration Files

Migration files are stored in `/src/migrations/`:
- One JSON file (schema definition)
- One TS file (migration logic)
- Both must be committed to git

Example:
```
src/migrations/
  ├── 20260309_181840.json
  ├── 20260309_181840.ts
  └── index.ts
```

## Best Practices

✅ **DO:**
- Use dev mode for rapid local development
- Create migrations before deploying to production
- Commit both collection changes AND migration files
- Test migrations locally when possible
- Check migration status after deployment

❌ **DON'T:**
- Run `pnpm migrate` after dev mode unless necessary
- Deploy without migration files
- Edit migration files manually (regenerate instead)
- Delete old migration files from version control

## Railway Deployment Checklist

Before pushing to Railway:

- [ ] Collection changes committed
- [ ] `pnpm migrate:create` run successfully
- [ ] Migration files in `/src/migrations/` committed
- [ ] Changes tested locally
- [ ] Ready to push to `main` branch

Railway will automatically:
1. Pull latest code
2. Run `pnpm migrate` (ensure this is in your start command)
3. Start the application

## Troubleshooting

**"Migration already exists in database"**
- The migration was already applied
- Safe to proceed or skip

**"Table/column already exists"**
- Dev mode created it already
- Answer 'N' to migration prompt if local DB is current
- Migrations will work on production (clean database)

**"No migrations to run"**
- No schema changes detected
- Or all migrations already applied

**Types out of sync**
- Run `pnpm generate:types` to regenerate Payload types
- This creates/updates `src/payload-types.ts`

## Database Connection

- **Local Development**: Uses `.env` for database connection
- **Production**: Railway provides `DATABASE_URL`
- **Schema Location**: `/src/collections/` folder
- **Config**: `/src/payload.config.ts`
