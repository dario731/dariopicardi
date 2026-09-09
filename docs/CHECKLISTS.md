# Checklists

## 1. Content Required From Dario

Everything below is either missing, contradictory between sources, or requires explicit approval. Each item says where it lands on the site.

**Biography and education**
- [ ] Exact birthplace (town and region) → `site.json → birthplace`; Story chapter 01 can name it.
- [ ] Exact high-school name and graduation year → `milestones.json → high-school`.
- [ ] Exact names and dates of both degrees (Italian titles, years, and whether the distinction is *cum laude* or *110 e lode / summa cum laude*) → `milestones.json → bachelor, master`; Story chapter 03.
- [ ] Confirmation of BIZ & STYLE founding year (2017 in corporate materials, 2018 in the CV).

**Career**
- [ ] Complete employment history with exact titles and dates (the CV is the source used; confirm it is current).
- [ ] Territories managed at Perfume Holding and PCA; team sizes; subsidiaries or operations created (currently described only as the CV states them).
- [ ] Verified sales responsibility per role (the €50M / ~€200M Ferrari figures are from the CV; the $500M+ is a company statement).
- [ ] Brands directly managed beyond Ferrari, Benetton, La Perla, Atkinsons.
- [ ] Approval to name Beauticon Valley publicly as a joint-venture partner (currently named only in the organizations data with an approval flag).
- [ ] Verified investments or joint ventures that may be disclosed → `organizations.json` (category `partnership`) and the Investor milestone.
- [ ] Major achievements, awards, press, speaking appearances, professional memberships → `media.json` (`published: true` only when verified).

**Identity and contact**
- [ ] Approved social profiles (LinkedIn at minimum) → `site.json → social`.
- [ ] Approved public contact details (email/phone/office are currently the BIZ & STYLE ones; Calendly is hidden) → `site.json → contact`.
- [ ] Form notification recipient(s) and CRM destination → environment variables.
- [ ] Production domain confirmation (`dariopicardi.com` assumed) → `PUBLIC_SITE_URL`, `site.json → url`.
- [ ] GTM and GA4 IDs → `PUBLIC_GTM_ID` and GTM configuration.
- [ ] Privacy and legal review of `/privacy`, `/terms`, `/accessibility`.
- [ ] Downloadable biography and media kit PDFs; CV if it should be public → `public/downloads/` + `site.json → downloads`.

**Photography** (see §2)
- [ ] Editorial portrait session (replaces FOUNDER-01).
- [ ] Archival Italian / Calabria photographs; academic years; early career.
- [ ] Executive-career photographs (meetings, markets, TFWA, teams).
- [ ] Miami and BIZ & STYLE operations (office, warehouse, team, events).
- [ ] Approved family and friendship photographs (with Alfonsina and Amedeo only with explicit approval).
- [ ] Cooking and hospitality; travel; sea and yachting.
- [ ] Logo permissions if any employer or brand logos are ever to be shown (currently names in typography only).

## 2. Asset replacement

| ID | Where | Current | Replace with |
|---|---|---|---|
| FOUNDER-01 | Home hero, Story ch.02, Biography, social card | `src/assets/images/portrait-dario-bw-tmp.jpg` (temporary) | Editorial portrait, 3000×3750 (4:5), natural light, dark wardrobe. Keep the filename or update imports. Re-run `npm run build` to regenerate `og-default.jpg`. |
| STORY-01 | Story ch.01 Italian Roots | placeholder | Archival Calabria / family photograph (approved) |
| STORY-03 | Story ch.03 Academic Discipline | placeholder | Photograph from the university years |
| STORY-05 | Story ch.05 Executive → Entrepreneur | placeholder | Miami office / early BIZ & STYLE |
| STORY-06 | Story ch.06 Investor & Builder | placeholder | Operations, warehouse, partners |
| STORY-07 | Story ch.07 Family & Friendship | placeholder | Friends / long-term relationships (approved) |
| STORY-09 | Story ch.09 Fatherhood | placeholder | Family photograph (approved by Dario and Alfonsina) |
| MIAMI-01 | Home “Global experience”, Story ch.04 | `dario-miami-skyline.jpg` (authentic) | Keep, or replace with a higher-resolution frame |
| SEA-01 | Home “The person”, Story ch.08 | `dario-sea-miami.jpg` (authentic) | Keep |
| INSIGHT covers | Perspectives | none (typographic fallback) | One landscape image per article, 2400×1350 |
| Biography PDF, Media kit PDF | Media page | pending | `public/downloads/*.pdf` |

Add a photograph to a story chapter by placing the file in `src/assets/images/` and adding an entry to the `images` map in `src/pages/story.astro`.

## 3. Pre-launch

- [ ] Environment variables set on Netlify (secret, CRM webhook and/or Resend, GTM, Turnstile if used).
- [ ] Netlify Identity + Git Gateway enabled; editors invited; `/admin` login tested.
- [ ] Daily build hook scheduled (for scheduled Perspectives).
- [ ] `npm run check`, `npm run lint`, `npm test`, `npm run build`, `npm run qa` all pass.
- [ ] Contact form tested end-to-end on the production domain (JS on and off); notification received; CRM record created; UTM captured.
- [ ] All items in §1 marked “placeholder” either resolved or accepted for launch.
- [ ] Legal pages reviewed by counsel.
- [ ] Lighthouse on `/`, `/story`, `/global-career`, `/perspectives`: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+ (mobile and desktop).
- [ ] Rich Results / Schema validator: Person, Organization, WebSite, ProfilePage, BreadcrumbList, ContactPage valid.
- [ ] Open Graph preview checked on LinkedIn and X.
- [ ] Redirects from any previous site added to `netlify.toml`.
- [ ] Search Console property verified; sitemap submitted.

## 4. Post-launch analytics

- [ ] GA4 receives `page_view` with `page_type`; conversions defined for `contact_form_success`, `bio_download`, `biz_style_visit`, `bns_luxury_visit`.
- [ ] GTM triggers mapped for every event in DEPLOYMENT.md §7; `scroll_depth` and `perspective_engaged` reporting.
- [ ] Consent Mode verified in GA4 (consent signals present; no analytics hits before acceptance).
- [ ] Search Console: no coverage errors after 7 days; Core Web Vitals “Good” on mobile.
- [ ] CRM: source/medium/campaign fields populated on real submissions; spam rate reviewed after 30 days (enable Turnstile if needed).
- [ ] RSS feed validated; Perspectives appearing in Google News-style surfaces if relevant.
- [ ] Quarterly: review `stats.json` figures against current corporate materials; update `media.json`.
