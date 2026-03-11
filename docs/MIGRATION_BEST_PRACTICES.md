# Payload Migration Workflow

## Daily Development Workflow

**Every time you change a collection/field:**

```bash
# 1. Edit your collection file
vim src/collections/Rooms.ts

# 2. Create migration
pnpm migrate:create

# 3. Review the generated migration
cat src/migrations/[latest].ts

# 4. Apply migration
pnpm migrate

# 5. Update types
pnpm generate:types

# 6. Test
pnpm dev

# 7. Commit
git add src/collections src/migrations src/payload-types.ts
git commit -m "Add new field to Rooms"
```

---

## Production Deployment

Your production deployments will work automatically with:

```bash
pnpm start:with-migrate
```

This runs migrations before starting the server, so schema changes deploy automatically.

**For Railway/Render:** Set your start command to `pnpm start:with-migrate`

**For Vercel:** Add to package.json:
```json
"scripts": {
  "build": "pnpm migrate && next build",
  "vercel-build": "pnpm migrate && next build"
}
```

---

## Important Notes

1. **Never run `pnpm dev` before creating migrations** - Now that `push: false` is set, dev won't modify your schema
2. **Always commit migration files** - They're your schema version history
3. **Test migrations locally first** - Apply them to your local DB before pushing
4. **The warning about "dev mode pushed changes"** will still appear when running `pnpm migrate`, but you can safely say "yes" - it's just Payload being cautious

---

## Quick Commands

```bash
# Check what migrations have been applied
pnpm migrate:status

# Create migration after schema changes
pnpm migrate:create

# Apply pending migrations
pnpm migrate

# Generate TypeScript types
pnpm generate:types
```