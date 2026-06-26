# Agency Lite Template

A lightweight and fast template for portfolios and agency websites.

## How to Edit Content

All website content is managed through JSON files in the `content/` folder. You do not need to touch the code to change text or projects!

1. **Main Website Data**: Edit the `content/config.json` file. Here you can change the title, description, social media links, and contact information.
2. **Projects/Portfolio**: Edit the `content/work.json` file. Add, remove, or modify information about your projects.

## Deployment

The project is configured for seamless deployment on **Vercel**.

1. Sign up or log in to [Vercel](https://vercel.com/).
2. Import your repository containing this template.
3. In the Vercel project settings, go to the **Environment Variables** section.
4. Add a variable named `LICENSE_KEY` and set your license key as its value.
5. Click **Deploy**!

Your website will automatically rebuild whenever you push updates to the `content/` folder.
