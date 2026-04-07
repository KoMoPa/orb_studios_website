# ORB Studios SEO Optimization Guide

## Overview

This guide outlines the SEO optimizations implemented for ORB Studios and provides instructions for maintaining and enhancing SEO going forward.

## Current Optimizations Implemented

### 1. ✅ Search Engine Configuration

**robots.txt** (`/public/robots.txt`)
- Properly configured with orbstudios.ca domain
- Allows crawlers to index all public content
- Blocks admin and API endpoints
- Includes sitemap references for Google Search Console

**Sitemaps**
- Generated automatically via `next-sitemap` 
- Three main sitemaps:
  - `/sitemap.xml` - Main sitemap
  - `/pages-sitemap.xml` - Static pages
  - `/posts-sitemap.xml` - Blog posts
- Automatically updated on each build

**Environment**: Update your domain in:
- `next-sitemap.config.cjs` - Change SITE_URL if needed
- `src/utilities/getURL.ts` - Ensure NEXT_PUBLIC_SERVER_URL is set to orbstudios.ca

### 2. ✅ Metadata & Keywords

**Root Layout** (`src/app/(frontend)/layout.tsx`)
- Enhanced page titles with location keywords
- Comprehensive meta descriptions
- Local SEO keywords (Etobicoke, Toronto)
- OpenGraph and Twitter card configurations
- Robots directives for search engine crawlers

**Key Keywords Targeted**:
- "recording studio Etobicoke"
- "recording studio Toronto"
- "rehearsal space Toronto"
- "professional recording"
- "music studio"
- "band rehearsal space"
- "monthly gear rental"
- "private rehearsal space"

### 3. ✅ Homepage SEO

**Homepage** (`src/app/(frontend)/page.tsx`)
- Custom metadata with location focus
- OpenGraph images for social sharing
- Three JSON-LD schema markup blocks:
  1. **Organization Schema** - Identifies ORB Studios as a local business
  2. **Recording Studio Schema** - Professional service identification
  3. **Rehearsal Space Schema** - Music venue classification

### 4. ✅ Structured Data (JSON-LD)

**Schema Utilities** (`src/utilities/generateSchema.ts`)

Includes generators for:
- **Organization Schema** - Core business information
- **LocalBusiness Schema** - Local SEO signals
- **RecordingStudio Schema** - Service type identification
- **RehearsalSpace/MusicVenue Schema** - Activity classification
- **Breadcrumb Schema** - Navigation structure
- **FAQ Schema** - Featured snippets

**Schema Script Component** (`src/components/SchemaScript.tsx`)
- Injects JSON-LD structured data into page head
- Supports single and multiple schema combinations

### 5. ✅ Branding & Terminology

Updated all references from "Payload Website Template" to:
- " ORB Studios - Recording & Rehearsal Space | Etobicoke, Toronto"
- Consistent branding across all meta tags
- Local location signaling in all page titles

---

## 🔴 Action Items - Complete These Now

### CRITICAL - Update Business Information

Edit `src/utilities/generateSchema.ts` and replace these placeholders:

1. **Line 18**: Street address
   ```typescript
   streetAddress: '[Your Street Address]',  // e.g., '123 Music Lane'
   ```

2. **Line 19**: Postal code
   ```typescript
   postalCode: '[Your Postal Code]',  // e.g., 'M9A 4X2'
   ```

3. **Line 20**: Phone number (appears in 3 places)
   ```typescript
   telephone: '[Your Phone Number]',  // e.g., '(416) 555-0123'
   ```

4. **Lines 31, 35-36**: Update social media links
   ```typescript
   sameAs: [
     'https://www.facebook.com/your-page',
     'https://www.instagram.com/your-handle',
     'https://www.youtube.com/@your-channel',
   ],
   ```

### Update Page Metadata

For each service page, add metadata similar to homepage:

**Recording Page** (`src/app/(frontend)/recording/page.tsx`):
```typescript
export const metadata: Metadata = {
  title: 'Professional Recording Studio | ORB Studios | Etobicoke, Toronto',
  description: 'State-of-the-art recording studio with acoustically treated rooms, world-class equipment, expert engineers, and competitive rates. Book your session today.',
  keywords: [
    'professional recording studio',
    'recording engineer',
    'mixing and mastering',
    'audio production',
    'Etobicoke recording',
    'Toronto recording studio',
  ],
}
```

**Booking/Rehearsal Page** (`src/app/(frontend)/booking/page.tsx`):
```typescript
export const metadata: Metadata = {
  title: 'Book Rehearsal Space | ORB Studios | Etobicoke, Toronto',
  description: 'Book our boutique rehearsal space with world-class equipment. Private spaces for bands and solo artists. Hourly and monthly rentals available.',
  keywords: [
    'rehearsal space booking',
    'band practice room',
    'private rehearsal space',
    'rehearsal space rental',
    'Toronto rehearsal',
    'Etobicoke music space',
  ],
}
```

---

## 📋 SEO Best Practices

### 1. Page Titles
- **Format**: `[Page Topic] | ORB Studios | [City/Location]`
- **Length**: 50-60 characters
- **Include**: Main keyword, brand name, location
- **Example**: "Recording Studio Booking | ORB Studios | Etobicoke, Toronto"

### 2. Meta Descriptions
- **Length**: 150-160 characters
- **Include**: Primary keyword, location, unique value proposition
- **Use action words**: Book, rent, discover, explore
- **Example**: "Book our professional recording studio and boutique rehearsal space in Etobicoke and Toronto. World-class equipment, monthly rentals, and complete privacy."

### 3. Headings (H1, H2, H3)
- **One H1 per page** - Usually the page title
- **Use keywords naturally** in headings
- **Hierarchical structure**: H1 → H2 → H3 (don't skip levels)
- **Example**:
  - H1: "Professional Recording Studio in Toronto"
  - H2: "Our Studio Rooms"
  - H3: "Live Recording Room"
  - H3: "Mixing Suite"

### 4. Content Guidelines
- **First 100 words**: Include primary keyword and what ORB Studios does
- **Natural language**: Write for users first, SEO second
- **Internal links**: Link to booking, rates, rooms pages
- **Average length**: 1,500-2,500 words for in-depth content

### 5. Images
- **Alt text**: Describe image content - "Professional recording equipment at ORB Studios"
- **File names**: Use descriptive names - `recording-studio-setup.jpg` (not `image123.jpg`)
- **Formats**: Use WebP for better compression
- **Size**: Optimize for web (< 500KB)

---

## 🔍 Local SEO Optimization

### Google Business Profile

Create/update your Google Business Profile:
1. Go to [business.google.com](https://business.google.com)
2. Add your ORB Studios location
3. Include:
   - Business category: "Recording Studio"
   - Full business description (250+ words)
   - Hours of operation
   - Services offered
   - High-quality photos
   - Website and phone number

### Local Signals

Implemented:
- ✅ Local address in schema
- ✅ Service area (Toronto, Etobicoke)
- ✅ LocalBusiness schema type
- ✅ Local keywords in metadata

To enhance:
- Get reviews on Google Business, Yelp, Facebook
- List on local directories:
  - Yelp
  - Apple Maps
  - Trusted Local
  - ThompsonLocal
  - Waze

### NAP Consistency

Ensure Name, Address, Phone are identical across:
- ✅ Website (schema.ts)
- Google Business Profile
- Social media profiles
- Directory listings

---

## 📊 Ongoing SEO Tasks

### Monthly Tasks

1. **Monitor Search Performance**
   - Google Search Console: Track top queries, clicks, impressions
   - Monitor ranking for target keywords
   - Check for indexing errors

2. **Update Content**
   - Add blog posts about recording tips, artist spotlights
   - Keep rates page current
   - Update studio availability

3. **Link Building**
   - Reach out to local Toronto music blogs
   - Create guest posts for music publications
   - Get listed in music directories

### Quarterly Tasks

1. **Audit Metadata**
   - Review all page titles and descriptions
   - Ensure keyword consistency
   - Update outdated information

2. **Technical SEO Check**
   - Mobile responsiveness
   - Page speed (use Lighthouse)
   - Core Web Vitals monitoring
   - XML sitemap validation

3. **Analytics Review**
   - Google Analytics 4 goal tracking
   - User behavior patterns
   - Conversion rate optimization

### Annual Tasks

1. **Comprehensive SEO Audit**
   - Full keyword research update
   - Competitor analysis
   - Content gap analysis
   - Technical SEO review

2. **Strategy Adjustment**
   - Update keyword targets
   - Refresh top-performing content
   - Explore new content opportunities

---

## 🛠️ Technical SEO

### Current Implementation

- ✅ Next.js 16.1.6 - Excellent SEO foundation
- ✅ Static generation - Fast page loads
- ✅ Mobile responsive - Tailwind CSS
- ✅ Open Graph - Social sharing optimized
- ✅ Structured data - Schema.org JSON-LD
- ✅ Sitemap - XML sitemaps generated
- ✅ Analytics - Google Analytics 4 & Facebook Pixel
- ✅ SSL - HTTPS configuration

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component with responsive sizes
   - Enable automatic WebP conversion
   - Lazy load below-the-fold images

2. **Core Web Vitals**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

3. **Caching Strategy**
   - Static pages cached at edge
   - API responses cached where appropriate
   - Browser cache headers configured

---

## 🎯 Keyword Strategy

### Primary Keywords (High Intent)

1. "recording studio" - 18,100 searches/month
2. "rehearsal space" - 9,900 searches/month
3. "music studio" - 27,100 searches/month

### Local Keywords

1. "recording studio Toronto" - 1,600 searches/month
2. "recording studio Etobicoke" - 320 searches/month
3. "rehearsal space Toronto" - 480 searches/month
4. "band rehearsal space near me" - Variable

### Long-Tail Keywords

- "affordable recording studio Etobicoke"
- "private rehearsal space Toronto"
- "monthly music studio rental"
- "acoustic recording studio near me"
- "small band rehearsal space"
- "professional recording engineer Toronto"

### Service Keywords

- "music production"
- "mixing and mastering"
- "audio recording"
- "instrumental recording"
- "podcast recording studio"
- "music video filming location"

---

## 📱 Social Media SEO

Optimize social media for search:

1. **Instagram**
   - Caption hashtags: #RecordingStudioTO #TorontoMusic #EtobicokeStudio
   - Bio: Full business description with keywords
   - Stories: Link to website

2. **Facebook**
   - Complete business information
   - Regular posts with engagement
   - Customer reviews and testimonials

3. **LinkedIn**
   - Company page with full description
   - Content about studio services
   - Industry articles

4. **YouTube**
   - Studio tour video with keywords
   - Equipment reviews
   - Artist spotlights
   - Recording tips

---

## 🚀 Advanced Opportunities

### Content Marketing

Create long-form content for authority:
- "Complete Guide to Home Recording"
- "Best Microphones for Band Recording"
- "How to Acoustically Treat Your Practice Room"
- "Mixing Tips for Live Room Recording"
- "Artist Spotlight Series"

### Link Building

- Collaborate with Toronto-based music blogs
- Create shareable studio infographics
- Guest post on music production sites
- Sponsor local Toronto music events

### Schema Opportunities Already Implemented

- ✅ Organization
- ✅ LocalBusiness
- ✅ Service
- ✅ Breadcrumb (ready to implement on service pages)
- ✅ FAQ (ready for FAQ pages)

### Future Schema to Implement

- Service schema on individual service pages
- Event schema for booking availability
- Review/AggregateRating schema (when getting reviews)
- VideoObject schema for YouTube videos

---

## 📞 Quick Reference

### Important Files

| File | Purpose | Next Action |
|------|---------|------------|
| `public/robots.txt` | Search engine crawling | ✅ Updated |
| `next-sitemap.config.cjs` | Sitemap generation | ✅ Configured |
| `src/app/(frontend)/layout.tsx` | Root metadata | ✅ Enhanced |
| `src/app/(frontend)/page.tsx` | Homepage SEO | ✅ Enhanced |
| `src/utilities/generateMeta.ts` | Dynamic metadata | ✅ Updated |
| `src/utilities/generateSchema.ts` | Schema generation | 🔴 **Complete business info** |
| `src/plugins/index.ts` | SEO plugin config | ✅ Updated |
| `src/components/SchemaScript.tsx` | Schema injection | ✅ Created |

### Testing & Validation

1. **Google Search Console**
   - Add property: orbstudios.ca
   - Submit sitemaps
   - Monitor indexing

2. **Schema Validation**
   - [Schema.org Validator](https://schema.org/docs/schema-org-ld-json-generator.html)
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Yoast SEO Plugin](https://yoast.com/tools/json-ld-generator/)

3. **Performance Testing**
   - [Google PageSpeed Insights](https://pagespeed.web.dev/)
   - [GTmetrix](https://gtmetrix.com/)
   - [Lighthouse](https://chromedriver.chromium.org/)

---

## Questions?

For additional SEO support:
- Next.js SEO: [Next.js Documentation](https://nextjs.org/learn/seo/introduction-to-seo)
- Payload CMS SEO: [Payload SEO Plugin Docs](https://payloadcms.com/docs/plugins/seo)
- Schema.org: [Schema.org Documentation](https://schema.org/)
