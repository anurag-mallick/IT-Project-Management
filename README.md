# 🚀 Horizon IT Management System

Welcome to the **Horizon IT** project repository. This is a comprehensive, production-ready IT Service Management (ITSM) and IT Asset Management (ITAM) platform designed to streamline your support, ticketing, SLA tracking, and infrastructure management.

---

## 🏗️ Project Structure

This repository contains the Next.js application within the `app/` directory.

- **[app/](./app/)**: The core Next.js application, APIs, and frontend code.
- **[app/README.md](./app/README.md)**: Detailed technical documentation, setup instructions, and deployment guides.

---

## ✨ Features at a Glance

*   **Intelligent Ticketing**: Track IT requests with Kanban boards, dynamic list views, and full audit logs.
*   **Asset Management**: Real-time tracking of hardware, software, and physical locations.
*   **SLA Monitors**: Automated dashboards for tracking response targets.
*   **Role-Based Security**: Fully native JWT authentication using your own database securely controlling `ADMIN` and `STAFF` access patterns.
*   **Vercel Blob Integrations**: Rapid, scalable, and fully native deployment for all file and image attachments.

---

## 🚀 Quick Start

To run the project locally, please navigate to the `app` directory and follow the instructions in the main application README.

\`\`\`bash
# 1. Enter the application directory
cd app

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# (Configure DATABASE_URL, DIRECT_URL, JWT_SECRET, BLOB_READ_WRITE_TOKEN)

# 4. Sync Database
npx prisma db push

# 5. Start development server
npm run dev
\`\`\`

---

## 📚 Complete Documentation

Please read the **[Full Technical README](./app/README.md)** located in the `app` folder for exhaustively detailed instructions on:
- Configuring Neon Postgres databases.
- Deploying to Vercel seamlessly.
- Understanding the technology stack and interface architecture.
- Full details on authentication and application security.

---

*Open Source Tooling | Built on Next.js 15, Neon, Prisma, and Tailwind CSS v4*
