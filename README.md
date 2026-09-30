---

# Agency Lite — Own Your Website

**Your website. Your code. No platform lock-in.**

Agency Lite is a clean, fast portfolio/agency template you buy once and own forever.
You get the full source code and control its deployment. Hosting, domains, GitHub,
and other external providers may have their own plans, limits, and fees.

## What's included

- Portfolio with project grid (edit via JSON — no code needed)
- Services section, About, Hero, Contact
- 4 built-in color themes (switch in `content/config.json`)
- License protection — your copy, nobody else's
- Deploy to Vercel or another compatible Next.js host

## Getting Started

To set up, run, and deploy this project, please refer to our official guides:

1. **First-Step Guide (Start Here):**  
   [https://www.ownyourwebsite.app/help](https://www.ownyourwebsite.app/help) — Read this first to quickly understand how the template works and get it running.

2. **Deployment Guide:**  
   [https://www.ownyourwebsite.app/docs/deploy](https://www.ownyourwebsite.app/docs/deploy) — Step-by-step instructions on deploying your website to production.

3. **Environment Variables Config:**  
   [https://www.ownyourwebsite.app/docs/env](https://www.ownyourwebsite.app/docs/env) — Information on which environment variables are required and how to obtain them.

### Supported toolchain

Use Node.js 22 (the exact tested release is recorded in `.nvmrc`) and npm 10.
Install the committed dependency graph with `npm ci`; keep `package-lock.json`
with the purchased source. The included Template CI workflow validates JSON
content, runs TypeScript and lint, and performs a production build without a
database or provider setup.

## Deployment contract

Agency Lite does not use a database, Prisma, migrations, or seed scripts. Its
source of truth is the versioned `content/config.json` and `content/work.json`
files in this repository.

The production `build` command validates both files against the schemas in
`content/schema/` before running `next build`. Invalid JSON, unsupported fields,
invalid themes/icons, and duplicate portfolio IDs fail the deployment with an
exact content path. Run `npm run content:validate` locally before pushing CMS or
manual JSON changes.

Browser CMS validation uses checked-in Ajv standalone validators, so schemas
are not compiled with `eval` at runtime. After changing a schema, regenerate
them with `npm run content:generate`; `npm run content:check` and the build
validation fail if the generated file is stale.

The included privacy and terms pages contain explicit starter placeholders, not
business or legal advice. Replace and review them for your agency, enabled
providers, operating countries, and actual practices before publishing the site.

Vercel Hobby is appropriate for personal, non-commercial demos and previews.
Use Vercel Pro or another commercially permitted host for a production business
site.

### Production admin protection

Configure an external hosting/WAF rate-limit rule for `POST /api/admin/login`
before publishing the admin route. A practical starting threshold is five
attempts per IP in 15 minutes; test both allowed and blocked requests after
deployment. Ensure requests cannot bypass the rule through an unprotected
hosting origin. The template deliberately does not add a database or Redis ENV
to its minimal contract only for cross-template uniformity.

Security headers, including a Content Security Policy, are configured in
`next.config.ts`. Re-test the public site and GitHub CMS before tightening the
policy or adding third-party scripts.

## License Configuration

Agency Lite requires exactly one environment variable for a normal deployment:
`LICENSE_KEY`, supplied after purchase. The license server URL, product identifier,
and verification secret are bundled with this product and do not need buyer setup.

`ADMIN_JWT_SECRET` is an advanced optional override for admin-session signing. Leave
it unset to reuse the bundled signing fallback; setting it is not part of the normal
one-variable deployment flow.

## Customizing your site

**All content is in the `content/` folder — no code required.**

Edit `content/config.json`:
```json
{
  "theme": "dark-teal",
  "site": {
    "name": "Your Agency",
    "description": "What your agency does",
    "url": "https://example.com"
  },
  "contact": {
    "title": "Let's work together",
    "subtitle": "Tell us about your project",
    "email": "you@example.com",
    "buttonText": "Send an email"
  }
}
```

Supported themes are `dark-teal`, `dark-amber`, `light-slate`, and
`light-rose`. Keep the other required fields from the supplied file when
editing it manually.

Edit `content/work.json` to update your portfolio projects.

Push changes to GitHub → Vercel auto-rebuilds. No redeploy button needed.

## GitHub-backed CMS

The admin CMS reads and commits the two content JSON files through GitHub's API.
It validates downloaded content and validates again before every commit using
the same schemas as the production build. It commits only files that actually
changed. When both files change, the CMS creates one Git tree and advances the
configured branch with one non-force update, so both files become visible in a
single commit or neither does. If a file or the branch changed remotely, the CMS
reports a conflict and reloads instead of publishing a partial content update.

Use a fine-grained personal access token restricted to this repository, with
only Contents read/write and Metadata read. Set an expiration and rotate the
token; do not create a permanent token. The CMS keeps it in `sessionStorage`, so
it is cleared when the browser tab/session ends, but JavaScript executing on the
same origin can still access it. Disconnect and revoke/rotate the token if that
browser or deployment may be compromised. A CMS commit becomes public only
after the hosting provider successfully rebuilds the site.

### Images

**All images in this template are configured by URL (link).** Paste an HTTPS direct
image link into the relevant field in the admin panel (CMS) or in the JSON
files — for example the hero background, the site logo, the OG image, and each
portfolio project image.

```json
{
  "hero": { "backgroundImage": "https://i.imgur.com/your-image.png" },
  "site": { "logo": "https://example.com/logo.png", "ogImage": "https://example.com/og.png" }
}
```

> **Tip:** Use a direct link that ends in `.png`, `.jpg`, `.webp`, etc.
> (e.g. from Imgur, Cloudinary, or your own CDN). Avoid page links that only
> *display* an image — they won't render.

**Fallback (advanced):** If you prefer to commit image files to your repo,
drop them into the `public/` folder and reference them with a path starting
from the root, e.g. `/images/my-photo.jpg`. The recommended approach is still
to use a direct URL link.

The content schemas reject executable or insecure URL schemes. Images must use
HTTPS or a root-relative path; section links may use HTTPS, `mailto:`, `tel:`, a
root-relative path, or an in-page `#` anchor.

## Built with

Next.js 16 · TypeScript · Tailwind CSS · No database

---

Purchased at [ownyourwebsite.app](https://ownyourwebsite.app)

---
