# Production Launch Checklist
## orbstudios.ca - Next.js + Payload CMS + Resend

---

## Pre-Launch Checklist

### 1. DNS Configuration Verification
- [ ] Confirm DNS records are properly set up at your registrar:
  - [ ] `A` record pointing to Railway's IP (or `CNAME` if using Railway's custom domain feature)
  - [ ] `www` subdomain configured (typically `CNAME` to your apex domain or Railway)
  - [ ] Lower your TTL (Time To Live) to 300 seconds a day before launch for faster propagation

### 2. Resend Email Setup

**Important:** You only need to verify the *sending* domain. You can still use `orbmusicstudios@gmail.com` for receiving replies!

**Before switching domains:**

- [ ] **Add and verify your production domain in Resend:**
  - [ ] Go to Resend dashboard → Domains → Add Domain
  - [ ] Add `orbstudios.ca`
  
- [ ] **Configure DNS records for email authentication:**
  - [ ] Add the **DKIM** records Resend provides (3 CNAME records)
  - [ ] Add **SPF** record: `v=spf1 include:_spf.resend.com ~all`
  - [ ] Add **DMARC** record (recommended): `v=DMARC1; p=none; rua=mailto:orbmusicstudios@gmail.com`
  
- [ ] **Verify domain status in Resend** - must show "Verified" before launch

- [ ] **Update email code to use proper from/reply-to addresses:**
  ```javascript
  // Example email configuration
  await resend.emails.send({
    from: 'Orb Studios <noreply@orbstudios.ca>',  // Must be @orbstudios.ca
    replyTo: 'orbmusicstudios@gmail.com',          // Replies go to Gmail!
    to: user.email,
    subject: 'Welcome to Orb Studios',
    html: emailTemplate
  });
  ```

- [ ] **Test email sending from dev:**
  ```bash
  # Use Resend API to send test email with production domain
  curl -X POST 'https://api.resend.com/emails' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -H 'Content-Type: application/json' \
    -d '{
      "from": "Orb Studios <noreply@orbstudios.ca>",
      "replyTo": "orbmusicstudios@gmail.com",
      "to": "your-test-email@gmail.com",
      "subject": "Production Domain Test",
      "html": "<p>Testing from production domain</p>"
    }'
  ```

### 3. Environment Variables

**Create production environment in Railway:**
- [ ] `NEXT_PUBLIC_SITE_URL=https://orbstudios.ca`
- [ ] `PAYLOAD_PUBLIC_SERVER_URL=https://orbstudios.ca`
- [ ] Update any hardcoded dev URLs in your Payload config
- [ ] Ensure `RESEND_API_KEY` is set
- [ ] Update `ALLOWED_ORIGINS` or CORS settings if applicable

### 4. Payload CMS Configuration

- [ ] Update your `payload.config.ts`:
  ```typescript
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://orbstudios.ca',
  ```

- [ ] Check for any hardcoded URLs in:
  - [ ] Email templates
  - [ ] Upload paths
  - [ ] API endpoints
  - [ ] Webhooks

### 5. Pre-Launch Testing

**Test emails thoroughly:**
- [ ] Send test transactional emails from staging/dev
- [ ] Check spam score using [mail-tester.com](https://www.mail-tester.com)
- [ ] Verify DKIM signatures are passing
- [ ] Test all email templates render correctly

**Test deployment:**
- [ ] Deploy to Railway production environment first (before DNS switch)
- [ ] Access via Railway's temporary domain
- [ ] Test all critical flows end-to-end

### 6. Railway Domain Setup

- [ ] In Railway dashboard:
  - [ ] Go to your service → Settings → Domains
  - [ ] Add custom domain: `orbstudios.ca`
  - [ ] Add `www.orbstudios.ca` if needed
  - [ ] Note the CNAME or A record values Railway provides

---

## Launch Day Steps

**Execute in order:**

1. [ ] **Final deployment** to Railway production
2. [ ] **Update DNS** to point to Railway (A or CNAME records)
3. [ ] **Monitor** DNS propagation: `dig orbstudios.ca` or use [whatsmydns.net](https://www.whatsmydns.net)
4. [ ] **Test immediately** once propagated:
   - [ ] Site loads correctly
   - [ ] SSL certificate provisions (Railway handles this automatically)
   - [ ] Send test transactional email
   - [ ] Check email headers for DKIM/SPF passing

---

## Post-Launch Monitoring

- [ ] Monitor Railway logs for errors
- [ ] Check Resend dashboard for email delivery status
- [ ] Test user signup/password reset flows
- [ ] Verify all CMS features work correctly
- [ ] Test form submissions
- [ ] Verify media uploads work correctly

---

## Common Gotchas to Avoid

- ⚠️ **Email "from" addresses** must be `*@orbstudios.ca` (but reply-to can be Gmail!)
- ⚠️ **DNS propagation** can take up to 48 hours (though usually much faster)
- ⚠️ **SSL certificates** on Railway auto-provision but may take 5-10 minutes
- ⚠️ **Environment variables** - ensure production values are set, not dev URLs
- ⚠️ **CORS settings** - update if you're restricting origins
- ⚠️ **Database connections** - ensure production DB is properly configured
- ⚠️ **Payload secret** - use a strong, unique secret for production
- ⚠️ **Email hosting NOT required** - you only need DNS records, not actual mailboxes

---

## Rollback Plan

- [ ] Keep your Railway dev URL active for 24-48 hours after launch
- [ ] If critical issues arise, you can quickly revert DNS while you troubleshoot
- [ ] Document Railway dev URL for emergency rollback: `_________________`

---

## Verification Commands

### Check DNS propagation:
```bash
dig orbstudios.ca
dig www.orbstudios.ca
```

### Check email DNS records:
```bash
dig TXT orbstudios.ca
dig CNAME resend._domainkey.orbstudios.ca
```

### Test SSL:
```bash
curl -vI https://orbstudios.ca
```

---

## Contact Information

- **DNS Provider:** _________________
- **Railway Project:** _________________
- **Resend Account:** _________________
- **Emergency Contact:** _________________

---

## Timeline

- **DNS TTL Lowered:** _________________
- **Resend Domain Verified:** _________________
- **Production Deploy Date:** _________________
- **DNS Switch Date:** _________________
- **Monitoring Period:** 24-48 hours post-launch
