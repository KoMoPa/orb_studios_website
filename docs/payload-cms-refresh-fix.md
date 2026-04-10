# Fixing Payload CMS Content Refresh Issues in Production

## Problem
Content changes made in the Payload CMS admin panel don't appear on the Next.js website in production due to aggressive page caching.

## Solutions

### 1. Enable On-Demand Revalidation (Recommended)

This automatically refreshes pages when content changes in Payload CMS.

#### Step 1: Add Revalidation Hook to Payload Collections

Add this to your Payload collection configuration:

```typescript
// In your collection config file (e.g., collections/Posts.ts)
{
  slug: 'posts', // Replace with your collection slug
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Revalidate the page when content changes
        if (req.context.triggerAfterChange !== false) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=/posts/${doc.slug}`)
          } catch (err) {
            console.error('Revalidation error:', err)
          }
        }
      }
    ]
  }
}
```

**Note:** Adjust the path (`/posts/${doc.slug}`) to match your URL structure.

#### Step 2: Create Revalidation API Route

Choose based on your Next.js router type:

**For App Router** (has `app/` directory):

Create `app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!path) {
    return NextResponse.json({ message: 'Path required' }, { status: 400 })
  }

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
```

**For Pages Router** (has `pages/` directory):

Create `pages/api/revalidate.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  if (!req.query.path) {
    return res.status(400).json({ message: 'Path required' })
  }

  try {
    await res.revalidate(req.query.path as string)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
```

#### Step 3: Add Environment Variable

Add to your `.env` file:

```
REVALIDATION_SECRET=your-random-secret-string-here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important:** Use a strong random string for `REVALIDATION_SECRET` and add it to your production environment variables.

---

### 2. Time-Based Revalidation

Pages automatically refresh at specified intervals.

**For App Router:**

Add to your page component:

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds

export default function PostPage() {
  // Your component code
}
```

**For Pages Router:**

Add to `getStaticProps`:

```typescript
// pages/posts/[slug].tsx
export async function getStaticProps(context) {
  // Your data fetching code
  
  return {
    props: {
      // Your props
    },
    revalidate: 60 // Revalidate every 60 seconds
  }
}
```

---

### 3. Manual Quick Fix

If you need changes to show immediately right now:

```bash
# Delete the build cache and rebuild
rm -rf .next
npm run build

# Then restart your production server
```

---

## Determining Your Router Type

- **App Router**: Your project has an `app/` directory with files like `page.tsx`, `layout.tsx`
- **Pages Router**: Your project has a `pages/` directory with files like `index.tsx`, `_app.tsx`

---

## Additional Tips

### Revalidate Multiple Paths

If a content change affects multiple pages (e.g., a post appears on the homepage and a category page):

```typescript
afterChange: [
  async ({ doc, req }) => {
    if (req.context.triggerAfterChange !== false) {
      const paths = [
        `/posts/${doc.slug}`,
        `/`,
        `/category/${doc.category}`
      ]
      
      for (const path of paths) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=${path}`)
        } catch (err) {
          console.error(`Revalidation error for ${path}:`, err)
        }
      }
    }
  }
]
```

### Revalidate on Delete

Add an `afterDelete` hook:

```typescript
hooks: {
  afterChange: [ /* ... */ ],
  afterDelete: [
    async ({ doc, req }) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=/posts`)
      } catch (err) {
        console.error('Revalidation error:', err)
      }
    }
  ]
}
```

---

## Testing

1. Make a content change in Payload CMS admin
2. Check your server logs for revalidation confirmation
3. Visit the affected page - changes should appear within seconds
4. If using time-based revalidation, wait for the revalidation interval

---

## Troubleshooting

- **Changes still not appearing**: Check that `REVALIDATION_SECRET` matches in both `.env` and production environment
- **404 on revalidation endpoint**: Verify the API route file is in the correct location
- **CORS errors**: Ensure `NEXT_PUBLIC_SITE_URL` is correct and includes protocol (`https://`)
- **Build errors**: Make sure you're using compatible Next.js version (13+ for App Router features)
