# Deployment

The site is built for **Netlify** (static pages + one serverless function for `/api/contact` and the `/connect` page, which is server-rendered so each visit gets a fresh anti-spam token). Any host that runs Astro's Node adapter would also work.

## 1. Repository

`https://github.com/dario731/dariopicardi.git`, branch `main`. Connect it in Netlify → *Add new site → Import an existing project*. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`, Node 22).

## 2. Environment variables (Netlify → Site configuration → Environment variables)

Copy `.env.example`. Nothing is hard-coded; without these the site still builds and runs in a safe default mode.

| Variable | Required | Effect |
|---|---|---|
| `PUBLIC_SITE_URL` | yes | Canonical URLs, sitemap, structured data (`https://dariopicardi.com`) |
| `CONTACT_FORM_SECRET` | yes | Signs the form's time-token. Any long random string. |
| `CONTACT_WEBHOOK_URL` (+ `CONTACT_WEBHOOK_TOKEN`) | one of these two | Forwards each submission as JSON to a CRM webhook (HubSpot, Follow Up Boss, Zapier, Make, …). Payload documented below. |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL`) | one of these two | Sends an email notification through Resend (verify the sending domain in Resend first). |
| `PUBLIC_GTM_ID` | no | Google Tag Manager container. Loads only after the visitor accepts analytics. |
| `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | no | Cloudflare Turnstile on the form (recommended if spam appears). |
| `CONTACT_ALLOWED_ORIGINS` | no | Extra origins allowed to POST (e.g. a preview domain). |

With neither webhook nor email configured, `/api/contact` validates and returns `202 dryRun` — useful for staging, useless in production. **Configure at least one before launch.**

## 3. Domain

Add `dariopicardi.com` (and `www` → apex redirect) in Netlify → Domain management. HTTPS is automatic. Update `PUBLIC_SITE_URL` and `site.json → url` if the domain differs.

## 4. Editorial interface (`/admin`)

1. Netlify → Integrations → **Identity** → Enable. Registration: *Invite only*.
2. Identity → Services → **Git Gateway** → Enable.
3. Identity → Invite users → Dario and the editors. They receive an email, set a password, and log in at `https://dariopicardi.com/admin/`.
4. The editorial workflow (Draft / In review / Ready) is already enabled in `public/admin/config.yml`.

## 5. Scheduled publication

Perspectives with a future `publishDate` appear at the first build on or after that date. Create a build hook (Netlify → Build & deploy → Build hooks → “daily”), then trigger it daily, e.g. with a free scheduler (GitHub Actions cron, cron-job.org, or Zapier) calling `POST https://api.netlify.com/build_hooks/<id>`.

## 6. Contact form → CRM

Every submission is normalized to this JSON (also the email body's source):

```json
{
  "id": "uuid", "receivedAt": "ISO-8601", "formId": "connect",
  "name": "", "company": "", "email": "", "phone": null, "location": "",
  "areaOfInterest": "international-expansion | strategic-partnerships | investment-opportunities | business-development | luxury-real-estate | media | introduction",
  "message": "",
  "consent": { "privacy": true, "timestamp": "ISO-8601" },
  "source": "google/organic", "originalSource": "direct",
  "utm": { "source": "", "medium": "", "campaign": "", "content": "", "term": "" },
  "gclid": null, "fbclid": null,
  "landingPage": "/story", "referrer": "", "pageUrl": "",
  "browserLanguage": "en-US", "userAgent": "", "ip": "", "site": "https://dariopicardi.com"
}
```

Map these to CRM fields (Source, Medium, Campaign, Content, Landing page, Referrer, Area of interest, Submission timestamp, Consent, Browser language). UTM parameters are captured on the first page of the session and preserved across navigation.

### Protection layers
Honeypot field · signed time-token (minimum 4 s on the form, maximum 6 h) · origin check · server-side validation and sanitization · per-instance rate limit (5 per 10 minutes per IP) · optional Turnstile. For a durable rate limit across function instances, add a Netlify rate-limiting rule for `/api/contact` or front the site with Cloudflare.

## 7. Analytics

Set `PUBLIC_GTM_ID`. The consent banner appears; on “Accept analytics” GTM loads and receives Consent Mode v2 signals (`analytics_storage: granted`, everything advertising-related denied). Inside GTM, add GA4 and map these `dataLayer` events:

`page_view`, `contact_form_start`, `contact_form_submit`, `contact_form_success`, `contact_form_error`, `cta_click` (cta_name, cta_location), `navigation_click`, `biz_style_visit`, `bns_luxury_visit`, `perspective_view` (perspective_slug, perspective_category), `perspective_engaged`, `perspective_share` (share_channel), `scroll_depth` (percent), `media_play`, `bio_download`, `social_profile_click`, `email_click`, `phone_click`, `outbound_click` (destination), `framework_interaction`, `map_interaction`, `consent_update`.

Register the property in Google Search Console with the DNS or HTML-tag method and submit `https://dariopicardi.com/sitemap-index.xml`.

## 8. Redirects

`netlify.toml` already maps common legacy paths (`/about`, `/contact`, `/blog`, `/career`, `/feed`) to the new routes. If a previous personal site existed under another domain, add `[[redirects]]` rules (301) for each old URL before switching DNS.

## 9. Security headers

Set in `netlify.toml`: HSTS, nosniff, frame-ancestors self, referrer policy, permissions policy, COOP, and a Content-Security-Policy that allows only self, Google Tag Manager/Analytics, Cloudflare Turnstile, Netlify Identity and YouTube/Vimeo embeds. Adding a new third-party script requires adding its origin to the CSP.

## 10. Verification after deploy

```bash
npm run build && npm run qa    # locally
```
Then on the live domain: open `/`, `/story`, `/global-career`, `/biz-and-style`, `/perspectives`, `/connect`; submit a test message; check `/sitemap-index.xml`, `/robots.txt`, `/perspectives/rss.xml`; run Lighthouse (targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+); validate structured data with Google's Rich Results test.
