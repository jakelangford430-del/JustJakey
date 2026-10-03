# Just Jakey — website

Public site and free tools for [Just Jakey](https://justjakey.online/).

Static HTML/CSS/JS, deployed via Netlify (`netlify.toml`, `_redirects`, `_headers`).

## Local

Open `index.html` or serve the repo root. No required build step.

## Notes

- Interactive tools live in their own folders (`business-sort-out-map`, `people-hub`, `brand-colour-picker`, …).
- Shared brand styles live in `assets/brand.css` (Just Jakey palette and typography).
- Legacy paths are kept alive with 301s in `_redirects` (e.g. `/about/` → `/#jake`, `/faq/` → `/#faqs`, `/chatgpt-guide/` → `/ai-guide/`).
- Open PR #3 wires analytics + member save + welcome dialog, but it currently conflicts with `main`. Rebase before merging.
- After that PR lands, put a real GA4 measurement ID in `assets/analytics.js`.
