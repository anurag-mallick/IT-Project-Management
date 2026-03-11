# IT Project Management Tool

A modern, high-performance IT Project Management web application built with Next.js, React, Tailwind CSS, and Supabase.

## Features ✨

### Core Functionality
- **Ticket Management**: Create, view, update, and manage IT tickets.
- **Kanban Board**: Visualize workflow with fully customizable stages.
- **Drag & Drop**: Intuitively move tickets between stages using smooth drag and drop interactions.
- **List & Calendar Views**: View tasks in a traditional list format or mapped out on a calendar based on Due Dates.

### IT Asset Management (ITAM) 🖥️
- **Asset Inventory**: Track laptops, servers, and software licenses in a dedicated management console.
- **Ticket-Asset Linkage**: Link assets directly to support tickets for instant technical context.
- **Lifecycle Tracking**: Monitor asset status (Active, Maintenance, Retired) and assignment history.

### Advanced Automations ⚡
- **Visual Rule Builder**: Create powerful "If This, Then That" logic without writing code.
- **Intelligent Routing**: Automatically assign tickets or update statuses based on complex triggers and conditions.
- **Engine Logic**: A robust backend engine that evaluates rules on every ticket interaction.

## Tech Stack 🛠️

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), Framer Motion, Lucide Icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

## Getting Started 🚀

### 1. Prerequisites
- Node.js (v18+)
- A Supabase account and project

### 2. Environment Variables
Create a `.env` file in the `frontend` root directory and populate it with your Supabase credentials:
```env
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Supabase Client Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

### 3. Database Setup
Push the Prisma schema to your configured database:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment 🌐
This project is optimized for deployment on [Vercel](https://vercel.com/). Ensure all environment variables listed above are securely added to your Vercel project settings before deploying.
