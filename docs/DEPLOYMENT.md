# Horizon IT Deployment Guide

This document provides comprehensive instructions for deploying Horizon IT across various environments.

## Table of Contents
1. [Vercel Deployment (Recommended)](#1-vercel-deployment-recommended)
2. [Cloudflare Pages & Workers](#2-cloudflare-pages--workers)
3. [Cloudflare Proxy (Self-Hosted Backend)](#3-cloudflare-proxy-self-hosted-backend)
4. [GitHub Pages (Static Export)](#4-github-pages-static-export)

---

## 1. Vercel Deployment (Recommended)

Next.js 15 projects are optimized for Vercel.

1. **Push to GitHub**: Ensure your code is in a GitHub repository.
2. **Connect to Vercel**: Import the project into Vercel.
3. **Environment Variables**: Add the following:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
4. **Build Settings**: 
   - Vercel should automatically detect the App Router.
   - **IMPORTANT**: If your project was previously looking for a `frontend` directory, go to **Settings > General** and update the **Root Directory** from `frontend` to `app`.

---

## 2. Cloudflare Pages & Workers

Deploying the frontend to Cloudflare Pages.

### Setup
1. **Repository Settings**: Update your deployment command to `npm run build`.
2. **Compatibility Flag**: Ensure the `nodejs_compat` flag is enabled in Cloudflare dashboard.
3. **Build Output**: Set directory to `.next`.

---

## 3. Cloudflare Proxy (Self-Hosted Backend)

If you are hosting your own backend and using Cloudflare as a proxy.

### Steps
1. **Disable Caching**: Go to Cloudflare > Caching > Cache Rules. Create a rule to bypass cache for `/api/*`.
2. **SSL/TLS**: Ensure Mode is set to "Full" or "Full (Strict)".
3. **WebSockets**: Enable WebSockets in the Network tab for real-time features.

---

## 4. GitHub Pages (Static Export)

GitHub Pages only supports static sites. This requires a `next export` approach or `output: 'export'` in `next.config.js`.

### Constraints
- **No API Routes**: Server-side API routes will not work.
- **Client-side Auth**: You must use Supabase Auth client-side.
- **Data Fetching**: Use SWR or React Query for client-side fetching.

---

## Troubleshooting

- **CORS Errors**: Ensure your Supabase project allows your deployment domain.
- **Prisma Generation**: Ensure `npx prisma generate` runs during the build step.
