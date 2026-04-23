# Orb Studios Website

A modern music studio website built with **Next.js**, **Payload CMS**, and **PostgreSQL**. Features a booking system with Google Calendar integration, invoice generation, email notifications, and S3 media storage.

**Live**: https://orbstudios.ca

---

## Tech Stack

**Frontend & Framework:**
- [Next.js](https://nextjs.org/) 16 - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) 4 - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - Accessible UI components (Radix UI)

**Backend & CMS:**
- [Payload CMS](https://payloadcms.com/) 3.79 - Headless CMS with REST/GraphQL
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries

**Core Features:**
- [Google Calendar API](https://developers.google.com/calendar) - Booking system integration
- [Resend](https://resend.com/) + [React Email](https://react.email/) - Email notifications & invoices
- [React PDF](https://react-pdf.org/) - Invoice PDF generation
- [Railway S3 Storage](https://railway.app/docs/reference/object-storage) (Tigris) - Media storage

**Utilities:**
- [date-fns](https://date-fns.org/) - Date manipulation
- [clsx](https://github.com/lukeed/clsx) - Conditional class names
- [React Hook Form](https://react-hook-form.com/) - Form management
- [ical-generator](https://github.com/sebbo2002/ical-generator) - iCal calendar events

**Package Manager & Deployment:**
- [pnpm](https://pnpm.io/) - Fast, efficient package manager
- [Railway](https://railway.app/) - Production hosting
- [Cloudflare](https://www.cloudflare.com/) - DNS management

---

## Prerequisites

- **Node.js** v18.20.2+ (v20+ recommended)
- **pnpm** v9+ (`npm install -g pnpm`)
- **PostgreSQL** (local dev) or cloud provider (Railway, Supabase, Neon)

---

## Scripts

```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm generate:types         # Regenerate Payload types
pnpm generate:importmap     # Regenerate import map
pnpm payload                # Payload CLI
pnpm dev:prod               # Test production build locally
```

---

## Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── (frontend)/             # Public frontend routes
│   ├── (payload)/              # Payload admin routes (/admin)
│   └── api/                    # API routes (bookings, invoices, etc.)
├── blocks/                      # Page builder blocks (CMS content)
├── collections/                 # Payload CMS collections & hooks
├── components/                  # React components
│   └── ui/                     # shadcn/ui components
├── fields/                      # Custom Payload field definitions
├── hooks/                       # React hooks
├── lib/                         # Utilities
│   └── booking/                # Google Calendar, email, invoicing
├── plugins/                     # Payload CMS plugins (S3, etc.)
├── utilities/                   # Helper functions
└── payload.config.ts            # Payload CMS configuration
```

---

## Key Features

### Booking System
- **Google Calendar Integration** - Bookings sync to studio calendar
- **Invoice Generation** - Automatic PDF invoices attached to emails
- **Email Notifications** - Resend-powered confirmations to clients & admin

### CMS
- **Live Preview** - Real-time content editing
- **Media Management** - Railway S3 integration
- **SEO Optimization** - Built-in SEO plugin
- **Redirects** - URL redirects management
- **Form Builder** - Dynamic form creation

### Storage
- **Railway S3 (Tigris)** - All media uploads stored on Railway's S3-compatible object storage
- **PostgreSQL** - All data, users, bookings, transactions

---

## Custom Google Fonts

This project includes four decorative Google Fonts from the Rubik family available site-wide:

| Alias | Font Family | Use Case |
|-------|-------------|----------|
| `vinyl` | Rubik Vinyl | Bold, eye-catching headlines |
| `doodle` | Rubik Doodle Shadow | Playful, bubbly text |
| `glitch` | Rubik Glitch | Edgy, distorted effects |
| `spraypaint` | Rubik Spray Paint | Artistic, graffiti-style text |
