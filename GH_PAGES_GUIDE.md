# GitHub Pages Compatibility Guide

GitHub Pages is a **static site hosting service**. This means it can only host HTML, CSS, and JavaScript. Your current application has a backend (Node.js/Express) and a database (PostgreSQL), which **cannot be hosted on GitHub Pages**.

To use GitHub Pages, you must separate your Frontend and Backend:

## 1. Frontend Changes (Next.js)

You need to convert the Next.js app into a static site.

### `next.config.ts` Updates

```typescript
const nextConfig = {
  output: "export", // 1. Enable static export
  images: {
    unoptimized: true, // 2. GH Pages doesn't support Image Optimization
  },
  basePath: "/your-repo-name", // 3. Required if not hosting at the root domain
};
```

### Routing

- **Dynamic Routes**: Static export doesn't support server-side rendering. You must use `generateStaticParams` for pre-defined dynamic pages or handle them purely client-side.
- **API Calls**: Your frontend must point to a **hardcoded absolute URL** for the backend (e.g., `https://your-vm-ip:4000/api`) instead of relative paths.

## 2. Backend & Database

The backend and database **must still reside on a VM** or an alternative server (like Heroku, DigitalOcean, or Vercel for Serverless).

- **CORS**: You must update your Express `cors` configuration to allow requests from your GitHub Pages URL (e.g., `https://username.github.io`).

## 3. Alternative: Fully Static / Serverless

If you want to avoid a VM entirely, you would need to:

1. **Database**: Use **Supabase** or **Firebase** (Serverless DBs) instead of PostgreSQL/Prisma.
2. **Auth**: Use Supabase Auth or Clerk.
3. **Worker**: Move SLA logic to **GitHub Actions** (CRON) or **Supabase Edge Functions**.
