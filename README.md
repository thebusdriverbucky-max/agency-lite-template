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

## Built with

Next.js 15 · TypeScript · Tailwind CSS · No database

---

Purchased at [ownyourwebsite.app](https://ownyourwebsite.app)

---
