# Payload CMS Setup Guide

## Prerequisites

Before running Payload CMS on your Orb Studios website, ensure you have:

### 1. PostgreSQL Database
You need a running PostgreSQL instance. Options:

#### Option A: Local PostgreSQL (Recommended for Development)
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database and user
createdb orb_studios
createuser payload -P  # Will prompt for password

# Grant privileges
psql orb_studios -c "GRANT ALL PRIVILEGES ON DATABASE orb_studios TO payload;"
```

#### Option B: Docker
```bash
docker run --name orb-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=orb_studios -p 5432:5432 -d postgres:15
```

#### Option C: Cloud Database
- Supabase: https://supabase.com (PostgreSQL hosting)
- AWS RDS: Amazon Relational Database Service
- Railway: https://railway.app

### 2. Environment Variables
Edit `.env.local` with your database connection:

```env
DATABASE_URI=postgresql://payload:password@localhost:5432/orb_studios
PAYLOAD_SECRET=your-long-random-secret-key-change-in-production
```

Generate a secret: `openssl rand -base64 32`

## Installation & Setup

### 1. Install Dependencies
Already done! Payload, PostgreSQL adapter, and Sharp are installed.

### 2. Generate Database Schema
```bash
pnpm build
```

This will:
- Generate TypeScript types for Payload collections
- Create the database schema in PostgreSQL
- Compile the Next.js application

### 3. Create First Admin User
```bash
# During first startup, Payload will prompt you to create an admin user
pnpm dev
```

Visit: `http://localhost:3000/admin`

The admin panel will prompt you to create your first admin user account.

## Running Your Site

### Development
```bash
pnpm dev
```

Then visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Production Build
```bash
pnpm build
pnpm start
```

## File Structure

```
/payload
  /collections
    - Users.ts          # User authentication & roles
    - Pages.ts          # Editable pages
    - Posts.ts          # Blog posts
    - Media.ts          # Image/file uploads
  /blocks
    - (blocks for page builder)
  /globals
    - Navigation.ts     # Site navigation settings
    - Footer.ts         # Footer content & links
    - Settings.ts       # Global site settings
  config.ts             # Main Payload configuration

/app
  /admin/[[...slug]]    # Admin dashboard route
  /api/payload          # Payload API routes

/lib/payload
  getPayload.ts         # Singleton Payload instance

.env.local              # Database & secrets (NOT in git)
```

## Key Collections

### Users
- Email/password authentication
- Admin and Editor roles
- Controls who can edit content

### Pages
- Editable pages with rich text
- Featured pages option
- Publish/unpublish capability

### Posts
- Blog functionality
- Author attribution
- Featured images
- Categories

### Media
- Image uploads with auto-resizing
- Alt text requirements
- Multiple image sizes (thumbnail, card, tablet)

## Globals

### Navigation
- Logo upload
- Navigation menu links
- External link support

### Footer
- Company information
- Contact details
- Social media links
- Copyright text

### Settings
- Site name & description
- SEO keywords
- Open Graph image
- Maintenance mode toggle

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (it's in .gitignore by default)
- Change `PAYLOAD_SECRET` for production
- Use strong database passwords
- Enable HTTPS in production
- Set proper CORS headers if needed

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running
```bash
brew services list  # Check if postgres is running
brew services start postgresql@15  # Start if needed
```

### Admin Panel Not Loading
- Clear browser cache
- Check browser console for errors
- Ensure `pnpm build` completed successfully
- Check that .env.local has DATABASE_URI set

### Missing Collections
- Run `pnpm build` to regenerate types
- Restart dev server: Stop and `pnpm dev` again

## Next Steps

1. Update `/app/page.tsx` to fetch content from Payload
2. Create custom blocks for page builder
3. Set up media folder (`public/uploads`)
4. Configure DNS and domain

## Resources

- [Payload CMS Docs](https://payloadcms.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
