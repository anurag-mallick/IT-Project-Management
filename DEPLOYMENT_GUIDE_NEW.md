# Vercel & Supabase Deployment Guide

The backend code has been entirely unified into Next.js using App Router API routes (`src/app/api`). The application is now ready to be deployed as a single comprehensive Next.js application on **Vercel** with a **Supabase** backend.

Follow these steps to configure your external services.

---

## 1. Supabase Configuration

### Step 1: Create the Project

1. Go to [database.new](https://database.new/) or log into the Supabase Dashboard.
2. Click **New Project**, select your organization, and choose a region close to your users.
3. Make sure you safely copy the **Database Password** you choose here.
4. Wait for the database provisioning to complete (takes ~2 minutes).

### Step 2: Get your API Keys

1. In the Supabase dashboard, go to **Project Settings** (the cog icon on the bottom left).
2. Go to **API**.
3. Copy the **Project URL** and the **`anon` `public` API Key**.
4. Go to **Database**.
5. Scroll down to the **Connection string** section.
6. Copy both the **Transaction URL** (Port 6543) and the **Session URL / Direct URL** (Port 5432).

### Step 3: Run Database Migrations

Since you have a populated `prisma/schema.prisma` file, you need to sync it to Supabase.

1. In your terminal, navigate to the `frontend` directory where your Prisma schema is located.
2. Run the following command:
   ```bash
   npx prisma db push
   ```
   _(Note: You will need to make sure your `.env` contains the `DATABASE_URL` and `DIRECT_URL` pointing to your Supabase instance before running this command)._

### Step 4: Storage Bucket Setup

1. In the Supabase dashboard, go to **Storage**.
2. Click **New Bucket**.
3. Name it exactly `attachments` (all lowercase).
4. Do not make it public (we will use signed URLs).
5. Click Save.

---

## 2. Vercel Configuration & GitHub Import

Vercel has native integration with GitHub, making CI/CD deployments automatic on every push.

### Step 1: Push to GitHub

If you haven't already, push the entire repository to GitHub:

```bash
git init
git add .
git commit -m "Initial commit of unified Next.js + Supabase architecture"
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Important**: Since your Next.js app is inside the `frontend` folder, you MUST set the **Root Directory** setting to `frontend` by clicking "Edit".

### Step 3: Configure Environment Variables

Expand the "Environment Variables" section before deploying. Add the following keys perfectly matching the values from Supabase:

| Name                            | Value                                                            |
| ------------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase Project URL                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase `anon` `public` API Key                            |
| `NEXT_PUBLIC_API_URL`           | `/api`                                                           |
| `DATABASE_URL`                  | Your Supabase Transaction URL (port 6543 with `?pgbouncer=true`) |
| `DIRECT_URL`                    | Your Supabase Session URL (port 5432)                            |

_(Note: Ensure you replace `[YOUR-PASSWORD]` in the database URLs with the actual database password you created in Step 1)._

### Step 4: Deploy

1. Click **Deploy**.
2. Vercel will install dependencies, generate the Prisma client during the build hook automatically, and publish your site globally.
3. Every time you push to the `main` branch on GitHub, Vercel will automatically redeploy the latest code.
