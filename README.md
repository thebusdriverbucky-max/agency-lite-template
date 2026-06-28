---

# Agency Lite — Own Your Website

**Your website. Your code. No subscriptions. No lock-in.**

Agency Lite is a clean, fast portfolio/agency template you buy once and own forever.
No monthly fees, no SaaS platform, no data held hostage.
You get the full source code, deploy it to Vercel in minutes, and it's yours.

## What's included

- Portfolio with project grid (edit via JSON — no code needed)
- Services section, About, Hero, Contact
- 4 built-in color themes (switch in `content/config.json`)
- License protection — your copy, nobody else's
- Deploy to Vercel in under 5 minutes

## Getting Started

To set up, run, and deploy this project, please refer to our official guides:

1. **First-Step Guide (Start Here):**  
   [https://www.ownyourwebsite.app/help](https://www.ownyourwebsite.app/help) — Read this first to quickly understand how the template works and get it running.

2. **Deployment Guide:**  
   [https://www.ownyourwebsite.app/docs/deploy](https://www.ownyourwebsite.app/docs/deploy) — Step-by-step instructions on deploying your website to production.

3. **Environment Variables Config:**  
   [https://www.ownyourwebsite.app/docs/env](https://www.ownyourwebsite.app/docs/env) — Information on which environment variables are required and how to obtain them.

## License Configuration

All configuration values (including `LICENSE_KEY`, `LICENSE_PRODUCT`, or any other license-related keys) will be sent directly to your email address immediately after purchase. Simply paste them into your environment variables when configuring the project!

## Customizing your site

**All content is in the `content/` folder — no code required.**

Edit `content/config.json`:
```json
{
  "site": { "name": "Your Name", "tagline": "What you do" },
  "theme": "dark-teal",   // Options: dark-teal | dark-amber | light-slate | light-rose
  "contact": { "email": "you@example.com" },
  "social": { "github": "...", "linkedin": "...", "twitter": "..." }
}
```

Edit `content/work.json` to update your portfolio projects.

Push changes to GitHub → Vercel auto-rebuilds. No redeploy button needed.

### Images

**All images in this template are configured by URL (link).** Paste a direct
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

## Built with

Next.js 15 · TypeScript · Tailwind CSS · No database

---

Purchased at [ownyourwebsite.app](https://ownyourwebsite.app)

---
