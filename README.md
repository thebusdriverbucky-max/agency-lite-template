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

## Setup after purchase

After purchasing at [ownyourwebsite.app](https://ownyourwebsite.app), you'll receive
two keys on the success page. Keep this tab open.

1. Click the **Deploy to Vercel** button on the success page
2. Connect your GitHub account when prompted
3. Enter your two keys (LICENSE_KEY and LICENSE_SERVER_SECRET) — copy from success page
4. Click Deploy — your site will be live in ~2 minutes

That's it. No database setup, no complicated config.

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

## Environment variables

| Variable | Where to get it |
|---|---|
| `LICENSE_KEY` | Success page after purchase on ownyourwebsite.app |
| `LICENSE_SERVER_SECRET` | Success page after purchase on ownyourwebsite.app |

## Built with

Next.js 15 · TypeScript · Tailwind CSS · No database

---

Purchased at [ownyourwebsite.app](https://ownyourwebsite.app)

---
