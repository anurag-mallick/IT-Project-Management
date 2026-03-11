# IT Project Management Tool 🖥️

A modern, full-stack **IT helpdesk and project management system** built for internal IT teams. Supports ticket creation, assignment, priority management, Kanban/List views, real-time analytics, and public ticket submission.

🌍 **Live Application:** [it-project-mangement.vercel.app](https://it-project-mangement.vercel.app)

---

## ✨ Features

| Feature                   | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| 🎫 **Ticket Management**  | Create, view, update, and close tickets from a Kanban board or List view         |
| 📊 **Live Reports**       | Dynamic dashboard with ticket counts by status/priority, and recent ticket table |
| 👤 **User Management**    | Admin-only CRUD for staff accounts with role support (ADMIN / STAFF)             |
| 🔐 **JWT Authentication** | Secure login; all internal routes are protected                                  |
| 🎯 **Priority Control**   | Any logged-in user can update ticket priority (LOW → URGENT) inline              |
| 📋 **Assignment**         | Assign tickets to staff members from the ticket detail panel                     |
| 💬 **Comments**           | Thread-based comments with Markdown and Rich Text support                        |
| 🌐 **Public Submit Form** | Anonymous external ticket submission (no login required)                         |
| 🏷️ **Status Workflow**    | TODO → IN_PROGRESS → AWAITING_USER → RESOLVED → CLOSED                           |
| ⏰ **SLA Management**     | Automated SLA breach time calculations based on ticket Priority                  |
| 🤖 **Automations**        | Rules engine to automatically assign and escalate tickets based on triggers      |
| 📎 **Sub-tasks & Tags**   | Break down tickets with Checklists and categorize them with customizable Tags    |
| 📅 **Calendar View**      | Visualize tickets by Due Date and time spent in a full Calendar view             |
| 📧 **Email Notifications**| Automated email alerts for ticket creations, assignments, and status updates     |

---

## 🏗️ Tech Stack

### Backend (Next.js API Routes + Prisma)

- **Next.js 15 (App Router)** — API Routes for REST endpoints
- **Prisma ORM** — type-safe database access with PostgreSQL (Supabase)
- **Supabase** — hosted PostgreSQL database & Storage for attachments
- **Resend** — transactional email notifications
- **JWT** — stateless authentication
- **bcryptjs** — password hashing

### Frontend (`frontend/`)

- **Next.js 15** (App Router)
- **React 18**
- **Tailwind CSS v4** + `@tailwindcss/typography`
- **react-big-calendar** — calendar view
- **react-markdown** — rich text rendering
- **Framer Motion** — animations
- **lucide-react** — icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1 · Clone the repo

```bash
git clone https://github.com/anurag-mallick/IT-Project-Mangement.git
cd "IT-Project-Mangement"
```

### 2 · Start the Application

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
# → Available on http://localhost:3000
```

**Frontend `.env.local`**

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🔑 Default Credentials

| Username | Password   | Role  |
| -------- | ---------- | ----- |
| `admin`  | `admin123` | ADMIN |

---

## 📂 Project Structure

```
├── backend-traditional/
│   ├── middleware/       # JWT auth + role guards
│   ├── prisma/           # Schema, migrations, seed
│   ├── routes/           # ticketRoutes, userRoutes
│   ├── utils/            # auth helpers, prisma client
│   └── server.js         # Express entry point
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx          # Main dashboard
        │   ├── login/            # Login page
        │   ├── submit/           # Public ticket form
        │   └── admin/users/      # User management (ADMIN only)
        ├── components/
        │   ├── DashboardSidebar  # Navigation + New Ticket CTA
        │   ├── KanbanBoard       # Drag-and-drop board
        │   ├── ListBoard         # Sortable table with click-through
        │   ├── NewTicketModal    # Create ticket with assignment
        │   ├── TicketDetailModal # View/edit ticket (status, priority, assignee)
        │   └── ReportsView       # Live analytics dashboard
        └── context/
            └── AuthContext       # JWT auth state
```

---

## 📡 API Overview

| Method  | Endpoint                    | Auth     | Description                                |
| ------- | --------------------------- | -------- | ------------------------------------------ |
| `POST`  | `/api/login`                | ❌       | Get JWT token                              |
| `GET`   | `/api/tickets`              | ✅       | List all tickets                           |
| `POST`  | `/api/tickets`              | ✅       | Create internal ticket                     |
| `PATCH` | `/api/tickets/:id`          | ✅       | Update ticket (status, priority, assignee) |
| `GET`   | `/api/tickets/:id/comments` | ✅       | Get ticket comments                        |
| `POST`  | `/api/tickets/:id/comments` | ✅       | Add comment                                |
| `GET`   | `/api/users`                | ✅ ADMIN | List users                                 |
| `POST`  | `/api/users`                | ✅ ADMIN | Create user                                |
| `PATCH` | `/api/users/:id/deactivate` | ✅ ADMIN | Deactivate user                            |
| `POST`  | `/api/public/tickets`       | ❌       | Anonymous ticket submission                |

---

## 🛡️ Roles & Permissions

| Action                            | STAFF | ADMIN |
| --------------------------------- | ----- | ----- |
| Create / view tickets             | ✅    | ✅    |
| Change status, priority, assignee | ✅    | ✅    |
| Add comments                      | ✅    | ✅    |
| Submit public form                | ✅    | ✅    |
| Manage users                      | ❌    | ✅    |

---

## 📝 License

MIT
