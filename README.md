# 3tabz-website

Static site for 3tabz.com (deploys on Vercel; no build step).

- `index.html`, `support.html` - rich landing and help pages (inline CSS)
- `privacy.html`, `terms.html`, `medical-disclaimer.html`, `subscription-terms.html`, `delete-account.html`, `cookies.html`,
  `reset-password.html` (+ `.js`), `conditions/*.html` - use the shared `site.css`
- `docs/` - internal launch, security, legal and store documents (excluded from deployment by `.vercelignore`)

See `docs/WEBSITE_SPEC.md` for what each page is needed for and the checklist before publishing.
