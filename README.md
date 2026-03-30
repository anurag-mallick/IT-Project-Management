# 🚀 Horizon IT – Complete IT Asset & Helpdesk Management Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Horizon IT** is a modern, blazing-fast, and comprehensive IT service management (ITSM) platform built entirely on Next.js 15, Neon Postgres, and Tailwind CSS. It is designed to act as a central hub for all IT operations: tracking tickets, resolving user issues, managing assets, maintaining SLAs, and discovering critical infrastructure intelligence.

![Horizon IT Cover Image](https://via.placeholder.com/1200x600?text=Horizon+IT+Management+Suite) *(Placeholder for a hero screenshot)*

---

## 🌟 Key Features

### 🎫 Intelligent Ticketing System
- **Omnichannel Views:** Toggle between Kanban Board, List View, or Calendar View depending on your team's workflow.
- **SLA Management:** Real-time SLA monitors flag high-priority or breaching tickets instantly.
- **Checklists & Tasks:** Break down complex resolutions into actionable checklists.
- **Activity & Audit Trails:** Every modification (status change, date change, new comment) is tracked relentlessly in a unified audit log.

### 💻 IT Asset Management (ITAM)
- **Asset Lifecycle Management:** Track hardware, software, and licenses from purchase to retirement.
- **Assignment & Traceability:** Link physical servers or laptops directly to users and network locations.
- **Local File Attachments:** Directly upload attachments (diagnostic logs, serial number photos) to your server's secure local storage.

### 🔐 Next-Generation Authentication
- **Self-Hosted Data Security:** Users, sessions, and security roles are managed directly in your PostgreSQL (Neon) database.
- **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `STAFF` roles ensure granular permission structures throughout the application.
- **Secure JWT Implementation:** Cookies are strictly `httpOnly` limiting attack vectors like XSS.

### ⚡ Performance & Usability
- **Premium Interface:** Glassmorphism aesthetics, dynamic dark mode, and seamless micro-interactions using Framer Motion.
- **Density Controls:** Users can switch between "Compact", "Comfortable", and "Spacious" UI themes instantly.
- **Instant Global Search:** Hit the search bar at any point to query tickets and assets globally.

---

## 🛠️ Technology Stack

| Technology       | Role                                    | Why?                                                                         |
|------------------|-----------------------------------------|------------------------------------------------------------------------------|
| **Next.js 15**   | Full-Stack Framework (App Router)      | Provides seamless Server Actions, App Router caching, and optimized builds.     |
| **Neon**         | Serverless PostgreSQL Database          | Branching, instant scaling, and auto-suspending free tiers.                    |
| **Prisma ORM**   | Database interactions                   | Type-safe queries mapped perfectly to our highly relational schema.             |
| **Nodemailer**   | SMTP Email                              | Robust, self-contained email delivery via standard SMTP protocols.              |
| **Local Storage**| File Attachments                        | Simple, reliable local file uploads served directly from the public directory. |
| **Tailwind CSS** | Styling & Utility                       | Unmatched iteration speed with extensive dark mode support.                     |

---

## 📋 Prerequisites & Setup

Getting Horizon IT running in your environment is simple. 

### 1. Requirements
- **Node.js**: v18+ (v20+ Recommended)
- **NPM** or **Yarn**: Latest versions.
- **Git**

### 2. External Services Required
To run Horizon IT successfully, you'll need the following:
1. **[Neon Database](https://neon.tech/)**: For the standard PostgreSQL Database.
2. **SMTP Provider**: (e.g., Gmail, Outlook, or Amazon SES) for sending email notifications.

---

## 🚀 Installation & Local Development

### Step 1: Clone the Repository
```bash
git clone https://github.com/anurag-mallick/IT-Project-Management.git
cd IT-Project-Management/app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the example environment securely.
```bash
cp .env.example .env.local
```

Open `.env.local` and populate the fields:
```env
# 1. Database Connections (Neon)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# 2. Security
JWT_SECRET="generate-a-super-secure-random-string-here"

# 3. SMTP Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your@email.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Horizon IT <your@email.com>"

# 4. SLA Cron
SLA_CRON_SECRET="another-random-secret"

# 5. Application Metadata
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Provision & Migrate the Database
Ensure your database tables match the schema perfectly:
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Start the Local Server
```bash
npm run dev
```
Horizon IT will now be accessible at `http://localhost:3000`.

---

## 📦 Deploying to Vercel

Horizon IT is optimized for **Vercel** but can be deployed anywhere that supports Next.js.

1. Publish your cloned codebase to your GitHub/GitLab account.
2. Go to your [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. Go to **Environment Variables** and paste all values from your `.env.local`.
4. **Click Deploy**.

***Post-Deployment Step***: Update your `NEXT_PUBLIC_APP_URL` variable in Vercel to match your new `it-project-management.vercel.app` production domain name!

---

## 🛡️ Default Administrator First Access

Since the authentication database starts empty, you can initialize your first secure user utilizing the platform's API endpoints or directly via the database. It is highly recommended to run a seed script to create your superuser account first.

- **Username**: `admin@it-management.com`
- **Password**: `AdminPassword123!@#`

*(Important: Change your superuser password immediately after logging in for the first time)*

---

## 📝 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

---

### Developed By

**Anurag Mallick**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anurag_Mallick-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anuragmallick/)

*Horizon IT Open Source Tooling | Built on Next.js 15, Neon Postgres, Prisma, and Tailwind CSS v4*
