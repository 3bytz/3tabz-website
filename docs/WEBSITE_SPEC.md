# 3tabz.com — Website pages and spec

The `/website` folder is a dependency-free static site (HTML + one CSS file + one small script). It can be hosted on
S3 + CloudFront, Netlify, Vercel or GitHub Pages.

## Pages
| URL | File | Purpose | Needed by |
|---|---|---|---|
| `/` | index.html | short product page, links to everything below | stores (marketing URL) |
| `/privacy` (+ `#retention`) | privacy.html | Privacy Policy incl. retention schedule | Apple, Google, NDPA |
| `/terms` | terms.html | Terms of Use | Apple 3.1.2 (with Apple EULA on iOS), Google |
| `/medical-disclaimer` | medical-disclaimer.html | what 3TABZ is not | Apple 1.4.1 |
| `/subscription-terms` | subscription-terms.html | auto-renewal, cancel, refunds | Apple 3.1.2, Google subscriptions policy |
| `/delete-account` | delete-account.html | web deletion path without reinstalling | Google Play account-deletion rule |
| `/reset-password?token=…` | reset-password.html + .js | completes the emailed reset link (calls `POST /v1/auth/reset-password`) | API email template |
| `/support` | support.html | help, reminder troubleshooting, contacts | stores (support URL) |
| `/cookies` | cookies.html | cookie notice (site uses none) | GAID 2025 |
| `/conditions/hypertension`, `/diabetes`, `/sickle-cell` | conditions/*.html | short, sourced condition pages with red-flag guidance | SEO, trust |

## Before publishing
1. Replace every `[bracketed]` placeholder (RC number, address, DPO, providers/regions, backup window) and remove the
   "Draft for legal review" lines **after** your lawyer signs off.
2. Configure clean URLs so `/privacy` serves `privacy.html` (Netlify/Vercel do this by default; on CloudFront add a
   function that appends `.html`).
3. Security headers at the CDN: `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: no-referrer` (reset page), `X-Frame-Options: DENY`. Each page also sets a restrictive CSP meta tag.
4. API: `CORS_ORIGINS` must include `https://3tabz.com,https://www.3tabz.com` (already in `task-definition.json`).
5. Universal links / App Links (optional, later): host `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json`
   so `https://3tabz.com/reset-password` opens the app when installed.

## Design and accessibility
- System fonts, no trackers, no third-party scripts, light/dark via `prefers-color-scheme`, 16 px base text, mobile-first,
  tables scroll horizontally on small screens.
- Every page shows the emergency banner (112/199) and the "does not diagnose or treat" footer.
- Condition pages cite their numbers (Adeloye 2021, IDF 2024, WHO via Africa Check) and link to WHO.
