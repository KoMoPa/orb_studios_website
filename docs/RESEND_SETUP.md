# Resend Email Configuration Guide

## Current Development Setup ✅

Your `.env.local` is correctly set for dev:

```env
RESEND_SENDER_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=orbmusicstudios@gmail.com
```

### How It Works
- `onboarding@resend.dev` is Resend's test address
- All emails automatically route to your authenticated Resend account (`orbmusicstudios@gmail.com`)
- No domain verification needed
- Perfect for development testing

### Email Flow in Dev
```
Client books with: test@example.com
    ↓
Code attempts to send confirmation to: test@example.com
    ↓
Resend test mode intercepts → routes to: orbmusicstudios@gmail.com
    ↓
Admin copy also → orbmusicstudios@gmail.com
```

**Result:** All test emails arrive at orbmusicstudios@gmail.com for verification

---

## Transitioning to Production

When you're ready to launch with orbstudios.com domain:

### Step 1: Verify Domain with Resend
1. Go to [Resend Dashboard](https://dashboard.resend.com)
2. Click "Domains" → "Add Domain"
3. Enter `orbstudios.com` (or subdomain like `mail.orbstudios.com`)
4. Resend provides DKIM, SPF, DMARC records
5. Add these records to your domain registrar's DNS
6. Wait for verification (usually instant, sometimes 24-48 hrs)

### Step 2: Update Production Environment
Set these in Railway environment variables:

```env
RESEND_SENDER_EMAIL=noreply@orbstudios.com
ADMIN_EMAIL=orbmusicstudios@gmail.com
```

### Step 3: Deploy
- Your code already handles this via environment variables
- Client emails will now go to actual recipients
- No code changes needed

---

## Code Configuration

Your `src/lib/booking/email.tsx` is already set up:

```typescript
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'orbmusicstudios@gmail.com'

// Both emails use these safely:
await resend.emails.send({
    from: `Orb Studios <${SENDER_EMAIL}>`,
    to: clientEmail,  // Goes to actual client in prod, admin in dev
})
```

---

## Testing Your Setup

### Verify Dev Mode Works
1. Create a test booking with `test@example.com`
2. Check orbmusicstudios@gmail.com inbox for:
   - ✅ Client confirmation email
   - ✅ Admin notification
3. Check dev server console for logs:
   - `Sending client confirmation email to: test@example.com`
   - `Client email sent result: {...}`

### Test Production Setup (optional)
1. After domain verification, temporarily change `.env.local`
2. Set `RESEND_SENDER_EMAIL=noreply@orbstudios.com`
3. Create test booking with your personal email
4. Verify it arrives at that email (not admin inbox)
5. Revert back to `onboarding@resend.dev` for dev

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not arriving in dev | Restart dev server, verify `RESEND_API_KEY` |
| Domain verification failing | Check DNS records propagated, wait 24-48hrs |
| Emails in prod going to wrong address | Verify `RESEND_SENDER_EMAIL` set in Railway, check domain verified in Resend |
| 422 error from Resend | Domain not verified or sender email not recognized |

---

## Environment Variables Summary

| Variable | Dev | Production | Purpose |
|----------|-----|-----------|---------|
| `RESEND_API_KEY` | Your key | Same | Resend authentication |
| `RESEND_SENDER_EMAIL` | `onboarding@resend.dev` | `noreply@orbstudios.com` | Email from address |
| `ADMIN_EMAIL` | `orbmusicstudios@gmail.com` | `orbmusicstudios@gmail.com` | Admin notifications |
