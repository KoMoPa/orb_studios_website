# Orb Studios Website

A modern web application built with Next.js, Payload CMS, and MongoDB, with Tailwind CSS for styling.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - React framework for production
- **CMS**: [Payload CMS](https://payloadcms.com/) - Headless CMS and backend API
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/installation) - Install globally with `npm install -g pnpm`
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) - Either local installation or a MongoDB Atlas account (cloud)

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
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/orb-studios

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Note**: 
- For local MongoDB, use `mongodb://localhost:27017/orb-studios`
- For MongoDB Atlas, use your connection string: `mongodb+srv://username:password@cluster.mongodb.net/orb-studios`
- Generate a secure `PAYLOAD_SECRET` - it should be a long, random string

### 4. Database Setup

If using local MongoDB, ensure it's running:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo
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

**Issue**: MongoDB connection fails
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env.local`
- Verify network connectivity if using MongoDB Atlas

**Issue**: Payload admin not loading
- Clear browser cache
- Ensure `PAYLOAD_SECRET` is set
- Check console for API errors

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
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)

## License

[Add your license here]
