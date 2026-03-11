# Orb Studios Website

A modern web application built with Next.js, Payload CMS with PostgreSQL and Drizzle ORM, and Tailwind CSS for styling.

### Links
Original domain: https://orbstudios.ca
Railway Development domain: https://orbstudioswebsite-production.up.railway.app/


### Studio pages to emulate
https://blackbirdstudio.com/

https://www.lynxmusic.ca/

https://www.secretweaponsound.ca/



## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - React framework for production
- **CMS**: [Payload CMS](https://payloadcms.com/) - Headless CMS and backend API
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Lightweight TypeScript ORM
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Language**: TypeScript

## Key Libraries

- **Email**: [Resend](https://resend.com/) with [React Email](https://react.email/) - Build email templates as React components for sending invoices and client notifications with excellent developer experience
- **PDF Generation**: [React PDF](https://react-pdf.org/) (react-pdf/renderer) - Generate invoices as PDFs directly in your Next.js app using component-based approach
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation for forms, API inputs, and environment variables. Integrates seamlessly with Drizzle for schema validation
- **Forms**: [React Hook Form](https://react-hook-form.com/) with Zod - Lightweight, performant form management with unified validation schemas
- **Date/Time**: [date-fns](https://date-fns.org/) - Lightweight, tree-shakeable date utility library for time calculations and hour tracking

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/installation) - Install globally with `npm install -g pnpm`
- [PostgreSQL](https://www.postgresql.org/download/) (v12 or higher) - Either local installation or a PostgreSQL cloud service (e.g., Railway, Supabase, Neon)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd orb-studios-website
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# PostgreSQL Connection
DATABASE_URI=postgresql://user:password@localhost:5432/orb-studios

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Note**: 
- For local PostgreSQL, use `postgresql://user:password@localhost:5432/orb-studios`
- For Railway or other cloud providers, use your provided connection string
- Generate a secure `PAYLOAD_SECRET` - it should be a long, random string

### 4. Database Setup

If using local PostgreSQL, ensure it's running:

```bash
# macOS with Homebrew
brew services start postgresql

# Or run PostgreSQL in Docker
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=password postgres
```

Then create the database:

```bash
creatdb orb-studios
```

Run database migrations:

```bash
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Payload Admin**: http://localhost:3000/admin

### 6. Create Admin User

On first run, you may need to create an admin user through the Payload admin interface or seeding script.

## Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## Project Structure

```
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── public/              # Static assets
├── payload/             # Payload CMS configuration (if separate)
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## Common Development Tasks

### Adding a New Collection in Payload CMS

1. Define the collection in your Payload config
2. Restart the dev server
3. Access the admin panel at http://localhost:3000/admin

### Styling Components

Use Tailwind utility classes in your React components:

```tsx
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
      Click me
    </button>
  );
}
```

## Troubleshooting

**Issue**: PostgreSQL connection fails
- Ensure PostgreSQL is running
- Check your `DATABASE_URI` in `.env.local`
- Verify the database exists: `psql -l`
- Verify network connectivity if using a cloud provider

**Issue**: Payload admin not loading
- Clear browser cache
- Ensure `PAYLOAD_SECRET` is set
- Check console for API errors

**Issue**: Database migrations fail
- Ensure PostgreSQL is running and accessible
- Check that the database exists
- Review migration files in the `drizzle` directory

**Issue**: pnpm install fails
- Delete `pnpm-lock.yaml` and `node_modules`
- Run `pnpm install` again

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test locally with `pnpm dev`
4. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)

## Custom Google Fonts

This project includes four decorative Google Fonts from the Rubik family available site-wide:

### Available Fonts

| Alias | Font Family | Use Case |
|-------|-------------|----------|
| `vinyl` | Rubik Vinyl | Bold, eye-catching headlines |
| `doodle` | Rubik Doodle Shadow | Playful, bubbly text |
| `glitch` | Rubik Glitch | Edgy, distorted effects |
| `spraypaint` | Rubik Spray Paint | Artistic, graffiti-style text |

### Usage Examples

```tsx
// Vinyl - Bold, solid font
<h1 className="vinyl">Title</h1>

// Doodle - With Tailwind size utilities
<h1 className="doodle text-2xl">Title</h1> 

// Glitch - Edgy distorted effect
<span className="glitch">Text</span>

// Spraypaint - Artistic brushstroke style
<div className="spraypaint">Content</div>
```

You can combine these font classes with any Tailwind utilities for color, sizing, spacing, etc:

```tsx
<h1 className="vinyl text-4xl text-red-600 mb-4">Orb Studios</h1>
<p className="doodle text-xl text-gray-700">Premium Recording Space</p>
```

## License

[Add your license here]
