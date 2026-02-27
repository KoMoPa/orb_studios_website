# Orb Studios Website - Quick Start Guide

## 🎯 Project Overview

This is the Orb Studios website built with:
- **Next.js 16** - React framework with App Router
- **Payload CMS 3** - Headless CMS for content management
- **PostgreSQL** - Database backend
- **Bootstrap 5** - UI components (carousels, modals, accordions)
- **Custom CSS** - Styled to match original design exactly

## ⚡ Quick Start (Development)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database

#### Option A: Local PostgreSQL (macOS)
```bash
# Install PostgreSQL if you don't have it
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Run the setup script
bash scripts/setup-db.sh
```

#### Option B: Use Docker
```bash
docker run --name orb-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=orb_studios \
  -p 5432:5432 \
  -d postgres:15
```

Then update `.env.local`:
```env
DATABASE_URI=postgresql://postgres:password@localhost:5432/orb_studios
```

### 3. Configure Environment
Edit `.env.local` and set:
```env
DATABASE_URI=postgresql://payload:password@localhost:5432/orb_studios
PAYLOAD_SECRET=your-secret-key-here
```

Generate a secret: `openssl rand -base64 32`

### 4. Build & Run
```bash
# Build (creates database schema and types)
pnpm build

# Start development server
pnpm dev
```

### 5. Visit Your Site
- **Website**: http://localhost:3000
- **Admin CMS**: http://localhost:3000/admin

### 6. Create First Admin User
When you visit `/admin` for the first time, Payload will prompt you to create an admin account.

## 📁 Project Structure

```
orb-studios-website/
├── app/
│   ├── layout.tsx              # Root layout (Bootstrap, custom styles)
│   ├── page.tsx                # Homepage (all existing content)
│   ├── (site)/
│   │   ├── calendar/page.tsx    # Calendar page (Google Calendar embed)
│   │   └── admin/              # Admin CMS interface
│   ├── api/
│   │   └── payload/            # Payload API routes
│   └── globals.css             # Global styles
│
├── payload/                    # Payload CMS Configuration
│   ├── config.ts               # Main Payload config
│   ├── collections/
│   │   ├── Users.ts            # User authentication
│   │   ├── Pages.ts            # Editable pages
│   │   ├── Posts.ts            # Blog posts
│   │   └── Media.ts            # Image uploads
│   ├── blocks/                 # Page builder blocks
│   ├── globals/
│   │   ├── Navigation.ts        # Site navigation
│   │   ├── Footer.ts            # Footer content
│   │   └── Settings.ts          # Global settings
│
├── lib/
│   └── payload/
│       ├── getPayload.ts        # Payload singleton
│       └── queryHelpers.ts      # Query utilities
│
├── public/
│   ├── styles.css              # Custom styles (immutable)
│   └── uploads/                # Media uploads
│
├── .env.local                  # Environment config (not in git)
├── next.config.ts              # Next.js config  
├── package.json
└── PAYLOAD_SETUP.md           # Detailed setup guide
```

## 🎨 Design & Styling

The website uses:
- **Bootstrap 5.3.7** - Loaded via CDN for UI components
- **Custom styles.css** - Preserves exact original design
- **CSS Loading Order**: Bootstrap → Custom CSS (important!)

All existing styling is preserved. The custom `styles.css` file is immutable and loaded after Bootstrap to ensure proper cascade.

## 📝 Key Features

### Homepage (`/app/page.tsx`)
- Studio information
- Service cards (Recording, Rehearsal, Mixing)
- Image carousel gallery
- Booking form with EmailJS integration
- Accordion menu for equipment details
- Google Calendar and Maps embeds

### Calendar Page (`/app/(site)/calendar/page.tsx`)
- Google Calendar embed (Orb Studios calendar)
- Rate information cards
- Booking form modal

### Admin CMS (`/admin`)
- User authentication & roles (Admin/Editor)
- Pages - Create/edit pages with content
- Posts - Blog functionality
- Media - Image uploads with auto-resizing
- Globals - Navigation, Footer, Site Settings

## 🔌 Email Integration

The booking form uses **EmailJS**:
- Service ID: `service_odf7xog`
- Template ID: `template_jav278e`
- Public Key: Set in `.env.local` as `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

Currently hardcoded in `/app/page.tsx`. Can be moved to Payload global settings.

## 📦 Available Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Database
bash scripts/setup-db.sh  # Setup PostgreSQL (macOS)

# Linting
pnpm lint            # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy!

### Self-Hosted
1. Set up PostgreSQL on your server
2. Deploy Next.js app to your server
3. Ensure `.env.local` includes `DATABASE_URI`

## 🔐 Security

- Never commit `.env.local` to git
- Change `PAYLOAD_SECRET` for production
- Use strong database passwords
- Use HTTPS in production
- Restrict admin access by IP if possible

## 🐛 Troubleshooting

### `Error: PostgreSQL connection refused`
```bash
brew services list
brew services start postgresql@15
```

### `Admin panel not loading`
- Clear browser cache
- Run `pnpm build` again
- Restart dev server
- Check `.env.local` has `DATABASE_URI`

### `Database schema missing`
- Run `pnpm build` to generate schema
- Restart dev server

## 📚 Resources

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/)

## ✅ Checklist for Going Live

- [ ] Set up production PostgreSQL database
- [ ] Update `.env.local` with production URLs
- [ ] Change `PAYLOAD_SECRET` to secure random value
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure custom domain
- [ ] Test admin panel on production domain
- [ ] Add backup strategy for database
- [ ] Set up monitoring/logging
- [ ] Review security settings

## 📞 Support

For issues with:
- **Payload CMS**: https://discord.gg/payloadcms
- **Next.js**: https://github.com/vercel/next.js/discussions
- **PostgreSQL**: https://www.postgresql.org/support/

---

**Last Updated**: 2024
**Version**: 2.0 (Payload CMS integrated)
