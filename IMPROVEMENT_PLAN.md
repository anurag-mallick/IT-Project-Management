# IT Project Management Tool — Improvement Plan

> **Current State:** Working prototype with Express + SQLite + Next.js  
> **Target State:** Production-grade ticket & project management platform on Supabase  
> **Last Updated:** March 2026

---

## Table of Contents

1. [Phase 0 — Supabase Migration (Priority)](#phase-0--supabase-migration)
2. [Phase 1 — Foundation Hardening](#phase-1--foundation-hardening)
3. [Phase 2 — Core Feature Expansion](#phase-2--core-feature-expansion)
4. [Phase 3 — Scale & Integration](#phase-3--scale--integration)
5. [Database Schema Evolution](#database-schema-evolution)
6. [Architecture Diagram](#architecture-diagram)

---

## Phase 0 — Supabase Migration

**Goal:** Replace the Express + SQLite backend with Supabase (PostgreSQL + Auth + Realtime + Storage).

### 0.1 — Database: SQLite → Supabase PostgreSQL

| Task                            | Details                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Create Supabase project         | Set up org, project, and get connection string                                                       |
| Migrate Prisma schema           | Change `provider = "sqlite"` → `provider = "postgresql"`, update `url` to Supabase connection string |
| Enable Row Level Security (RLS) | Write RLS policies for `tickets`, `comments`, `users`, `tasks`                                       |
| Seed production data            | Create admin user + SLA policies via Supabase SQL editor or seed script                              |
| Set up connection pooling       | Use Supabase's built-in PgBouncer (`?pgbouncer=true`) for serverless compatibility                   |

**Prisma schema change:**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // For migrations (bypasses pooler)
}
```

**Environment variables:**

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 0.2 — Auth: Custom JWT → Supabase Auth

| Task                                       | Details                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Remove custom JWT logic                    | Delete `utils/auth.js`, `authMiddleware.js` custom token generation                              |
| Integrate `@supabase/supabase-js`          | On frontend, use `supabase.auth.signInWithPassword()`                                            |
| Use Supabase JWT in API                    | Backend verifies Supabase JWT via `supabase.auth.getUser(token)`                                 |
| Add OAuth providers (optional)             | Google, GitHub, Microsoft SSO via Supabase dashboard                                             |
| Map Supabase `auth.users` → `public.users` | Use a database trigger to sync `auth.users` inserts into `public.users` table with role defaults |

**Frontend auth change:**

```typescript
// Before (custom)
const res = await fetch(`${API_URL}/login`, {
  body: JSON.stringify({ username, password }),
});
const { token } = await res.json();

// After (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
// Token is automatically managed by the Supabase client
```

### 0.3 — Realtime: Socket.IO → Supabase Realtime

| Task                          | Details                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| Remove Socket.IO dependency   | Delete `socket.io` setup from `server.js`                      |
| Subscribe to Postgres changes | Use `supabase.channel('tickets').on('postgres_changes', ...)`  |
| Live ticket board             | Kanban board auto-updates when any user creates/moves a ticket |
| Live comments                 | Comment thread updates in real-time without polling            |

**Example subscription:**

```typescript
supabase
  .channel("ticket-changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tickets" },
    (payload) => {
      // Refresh ticket list or update specific ticket in state
    },
  )
  .subscribe();
```

### 0.4 — File Storage: None → Supabase Storage

| Task                               | Details                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Create `attachments` bucket        | Via Supabase dashboard, set 50MB file limit                                |
| Add upload UI to TicketDetailModal | Drag-and-drop zone with preview                                            |
| Store file references in DB        | New `attachments` table with `ticket_id`, `file_path`, `file_name`, `size` |
| Generate signed URLs for downloads | `supabase.storage.from('attachments').createSignedUrl(path, 3600)`         |

### 0.5 — Deployment

| Component          | Recommended Host                                     | Why                                            |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------- |
| Frontend (Next.js) | **Vercel**                                           | Zero-config Next.js deployment, edge functions |
| Backend API        | **Supabase Edge Functions** or **Vercel API Routes** | Eliminate separate Express server              |
| Database           | **Supabase** (managed PostgreSQL)                    | Built-in auth, realtime, storage               |
| File Storage       | **Supabase Storage**                                 | S3-compatible, integrated with auth            |

> **Key Decision:** With Supabase, you can potentially **eliminate the Express backend entirely** by using Supabase Edge Functions (Deno) + RLS policies + Next.js API routes. This simplifies deployment significantly.

---

## Phase 1 — Foundation Hardening

### 1.1 — Backend TypeScript Migration

- [ ] Initialize `tsconfig.json` in backend
- [ ] Rename `.js` → `.ts` files incrementally
- [ ] Add shared types package between frontend/backend (or use a monorepo with `turborepo`)
- [ ] Add `zod` validation schemas for every API endpoint

### 1.2 — Input Validation (Zod)

```typescript
// Example: Ticket creation schema
const CreateTicketSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  status: z.enum(["TODO", "IN_PROGRESS"]).default("TODO"),
  assignedToId: z.number().int().positive().optional(),
});
```

### 1.3 — API Pagination & Filtering

- [ ] Add cursor-based pagination to `GET /tickets` (for infinite scroll)
- [ ] Add query params: `?status=TODO&priority=P0&assignee=5&search=printer&limit=25&cursor=abc`
- [ ] Add `_count` includes in Prisma for comment/task counts without fetching full relations

### 1.4 — Testing

| Type            | Tool               | Coverage Target                                       |
| --------------- | ------------------ | ----------------------------------------------------- |
| Unit tests      | Vitest             | Business logic, validation schemas, utility functions |
| API tests       | Supertest + Vitest | All endpoints, auth flows, error cases                |
| E2E tests       | Playwright         | Login → Create ticket → Assign → Comment → Close      |
| Component tests | Testing Library    | Modal interactions, form validation                   |

### 1.5 — CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

---

## Phase 2 — Core Feature Expansion

### 2.1 — Projects & Epics

- [ ] New `Project` model: `id`, `name`, `description`, `status`, `ownerId`, `createdAt`
- [ ] New `Epic` model: `id`, `title`, `projectId`, `status`
- [ ] Tickets belong to a Project (optional) and an Epic (optional)
- [ ] Project dashboard with progress bar (% tickets resolved)
- [ ] Sprint planning view (group tickets into time-boxed iterations)

### 2.2 — Activity Timeline / Audit Log

- [ ] New `activity_log` table: `id`, `ticketId`, `userId`, `action`, `field`, `oldValue`, `newValue`, `timestamp`
- [ ] Auto-log every change: status, priority, assignment, title, description edits
- [ ] Display as a chronological timeline in the ticket detail panel
- [ ] Filterable: "Show only status changes" / "Show all"

### 2.3 — Email Notifications

| Trigger                | Email                               | How                                      |
| ---------------------- | ----------------------------------- | ---------------------------------------- |
| Ticket assigned to you | "You've been assigned #42"          | Supabase Edge Function + Resend/SendGrid |
| SLA about to breach    | "Ticket #42 breaches SLA in 30 min" | Cron-triggered Supabase function         |
| Comment on your ticket | "@Anurag mentioned you on #42"      | Database trigger → Edge Function         |
| Ticket resolved        | "Your ticket #42 has been resolved" | Status change trigger                    |

### 2.4 — Full-Text Search

- [ ] Add PostgreSQL `tsvector` column to `tickets` table
- [ ] Create GIN index for fast search
- [ ] Build search UI with debounced input + highlighted results
- [ ] Alternative: use **Supabase's built-in full-text search** or add **Meilisearch** for advanced faceted search

### 2.5 — File Attachments

- [ ] Drag-and-drop upload zone in ticket detail modal
- [ ] Inline image preview for screenshots
- [ ] Download button with signed URLs
- [ ] Max 10 files per ticket, 25MB per file

### 2.6 — Custom Fields

- [ ] Allow admins to define custom fields per project (text, number, dropdown, date)
- [ ] Store in JSONB column on tickets: `metadata JSONB DEFAULT '{}'`
- [ ] Dynamic form rendering based on project config
- [ ] Filterable/sortable on custom fields

### 2.7 — Kanban Enhancements

- [ ] Drag-and-drop reordering within a column (not just across columns)
- [ ] WIP limits per column (configurable)
- [ ] Swimlanes (group by assignee, priority, or project)
- [ ] Column collapse/expand

---

## Phase 3 — Scale & Integration

### 3.1 — Multi-Tenancy

- [ ] Add `organization_id` to all tables
- [ ] Supabase RLS policies scoped by org
- [ ] Org creation, invitation flows, team management
- [ ] Subdomain-based routing (`acme.yourapp.com`)

### 3.2 — Webhooks & Integrations

| Integration     | Trigger                    | Payload                            |
| --------------- | -------------------------- | ---------------------------------- |
| Slack           | Ticket created, SLA breach | Formatted message with ticket link |
| Microsoft Teams | Ticket assigned            | Adaptive card                      |
| GitHub          | Ticket linked to PR        | Auto-update ticket when PR merged  |
| Custom webhook  | Any event                  | JSON payload to user-defined URL   |

### 3.3 — Advanced Analytics

- [ ] Time-to-resolution charts (avg, p50, p95)
- [ ] SLA compliance trends over time
- [ ] Agent workload distribution
- [ ] Ticket volume heatmap (busiest hours/days)
- [ ] Export to CSV/PDF

### 3.4 — Performance & Caching

- [ ] **Redis** (Upstash) for session cache + rate limiting
- [ ] **BullMQ** for background job queue (SLA checks, email sends)
- [ ] **Edge caching** for static dashboard data (5-min TTL)
- [ ] Database query optimization with Prisma `select` (fetch only needed fields)

### 3.5 — Security Hardening

- [ ] Rate limiting on all API endpoints (100 req/min per user)
- [ ] CSRF protection
- [ ] Content Security Policy headers
- [ ] Input sanitization (XSS prevention)
- [ ] Dependency audit (`npm audit`, Dependabot)
- [ ] Token refresh flow with short-lived access tokens + refresh tokens

### 3.6 — Mobile & Accessibility

- [ ] Progressive Web App (PWA) with offline ticket viewing
- [ ] Responsive design audit (currently desktop-focused)
- [ ] Keyboard shortcuts (J/K navigation, Ctrl+K command palette)
- [ ] ARIA labels and screen reader support
- [ ] Dark/Light theme toggle

---

## Database Schema Evolution

Below is the target schema for the fully-featured version:

```sql
-- Core
users (id, email, name, avatar_url, role, org_id, is_active, created_at)
organizations (id, name, slug, plan, created_at)

-- Ticketing
projects (id, name, description, org_id, owner_id, status, created_at)
epics (id, title, project_id, status, created_at)
tickets (id, title, description, status, priority, project_id, epic_id,
         requester_id, assignee_id, org_id, sla_breach_at, metadata JSONB,
         search_vector tsvector, created_at, updated_at)
comments (id, ticket_id, author_id, content, created_at)
attachments (id, ticket_id, file_name, file_path, size, mime_type, uploaded_by, created_at)
tasks (id, ticket_id, title, status, assignee_id, created_at)

-- System
activity_log (id, ticket_id, user_id, action, field, old_value, new_value, created_at)
sla_policies (id, org_id, priority, response_time_mins, created_at)
webhooks (id, org_id, url, events[], secret, is_active, created_at)
custom_fields (id, project_id, name, type, options JSONB, required, created_at)
notifications (id, user_id, type, title, body, read, data JSONB, created_at)
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                     Vercel                          │
│  ┌────────────────────────────────────────────────┐ │
│  │             Next.js Frontend                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐  │ │
│  │  │ Dashboard │ │  Kanban  │ │  Ticket Modal │  │ │
│  │  └──────────┘ └──────────┘ └───────────────┘  │ │
│  │        │            │              │           │ │
│  │        └────────────┼──────────────┘           │ │
│  │                     │                          │ │
│  │           @supabase/supabase-js                │ │
│  └─────────────────────┼──────────────────────────┘ │
└────────────────────────┼────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Supabase                         │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │ Realtime │  │    PostgreSQL     │  │
│  │  (JWT)   │  │  (WS)    │  │  (RLS + Search)  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │ Storage  │  │     Edge Functions (Deno)        │ │
│  │  (S3)    │  │  - SLA cron  - Email triggers    │ │
│  └──────────┘  │  - Webhooks  - Slack integration │ │
│                └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Priority Order for Next Sprint

1. **Supabase project setup + PostgreSQL migration** (Phase 0.1)
2. **Supabase Auth integration** (Phase 0.2)
3. **Supabase Realtime for live ticket updates** (Phase 0.3)
4. **Zod validation on all endpoints** (Phase 1.2)
5. **API pagination** (Phase 1.3)
6. **Activity timeline / audit log** (Phase 2.2)
7. **File attachments via Supabase Storage** (Phase 0.4 + 2.5)
8. **Deploy to Vercel** (Phase 0.5)

---

_This document is a living plan. Update it as priorities shift or new requirements emerge._
