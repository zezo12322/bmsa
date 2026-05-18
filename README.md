# BMSA Benisuef — CMS Vibe

Official bilingual **Arabic/English** website and content management system for BMSA Benisuef, the IFMSA-Egypt local committee at Beni Suef University Faculty of Medicine.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, React 19) |
| Language | TypeScript 5 (strict) |
| Styling | Custom CSS design system |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (email + password) |
| Icons | Lucide React |

---

## Features

**Public site (EN + AR)**
- Home — hero, stats, committee overview, recent activities
- About — mission/vision/values, journey timeline, board of directors
- Committees — SCOME, SCOPE, SCOPH, SCORA, SCORE, SCORP with programs
- Divisions — CBSD, PSD, PNSD, FSD, RSD support divisions
- Activities — CMS-managed activity cards per committee
- Merch — product listing with dynamic size selection, order form
- Join — membership application form

**Admin panel** (`/admin`, login required)
- Dashboard with live counters and latest applications/orders
- CRUD for Activities, Merch Items, Board Members, Image Overrides
- View-only reports for Membership Applications and Merch Orders

**Architecture**
- Bilingual RTL/LTR support — Arabic under `/ar/...`
- Fallback to local data if Supabase is not configured
- Row Level Security — public reads only published items; form submissions use anon key; admin writes use service role key
- Session refresh proxy middleware on every request (`src/proxy.ts`)
- Zero TypeScript errors (strict mode)

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project** → choose your organization.
3. Give the project a name (e.g. `bmsa-benisuef`), set a database password, and pick a region close to Egypt (e.g. `eu-central-1`).
4. Wait ~2 minutes for the project to provision.

### 3. Run the database schema

1. In your Supabase project, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Copy the full contents of `supabase/bmsa_vibe_cms.sql` and paste it into the editor.
4. Click **Run** (or press `Ctrl+Enter`).

The script creates all tables, functions, RLS policies, indexes, triggers, a storage bucket, and inserts seed demo data. It is fully idempotent — safe to run multiple times.

**What gets created:**

| Object | Description |
|---|---|
| `admin_users` | Authorised admin accounts linked to Supabase Auth users |
| `bmsa_activities` | CMS-managed activity cards (one per committee in seed data) |
| `bmsa_merch_items` | Shop products with prices, sizes, availability |
| `bmsa_board_members` | Executive Board + Technical Officers (9 roles in seed data) |
| `bmsa_images` | Global image URL overrides keyed by path |
| `bmsa_membership_applications` | Join form submissions (5 demo rows) |
| `bmsa_merch_orders` | Order form submissions (3 demo rows) |
| `is_admin(uuid)` | Security-definer function callable by anon/authenticated roles |
| `bmsa-images` | Public storage bucket for uploaded images |

### 4. Set environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values. Find them at **Supabase Dashboard → Project Settings → API**:

```env
# Project URL — always starts with https://
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Anon/public key — safe to expose; restricted by RLS
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...

# Service role key — SERVER ONLY. Never commit or expose to browser.
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

Where to find each key:

| Variable | Location in Supabase Dashboard |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → Project API keys → `service_role` `secret` |

> **Without these keys** the public site still renders using local fallback data (`src/lib/bmsa-data.ts`), but the admin panel and form submissions require a working Supabase connection.

### 5. Create the first admin user

**Step A — Create an Auth user:**
1. Supabase Dashboard → **Authentication** → **Users** tab.
2. Click **Add user** → **Create new user**.
3. Enter an email and a strong password. Click **Create user**.
4. Copy the **UUID** shown in the user list (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

**Step B — Grant admin access:**

Open **SQL Editor** and run (replace the values):

```sql
insert into public.admin_users (user_id, email, role)
values ('YOUR_AUTH_USER_UUID', 'your-email@example.com', 'admin');
```

**Verify it worked:**

```sql
select * from public.admin_users;
```

You should see one row. Without this row, the login will succeed but the admin panel will redirect back to `/login`.

### 6. Run the development server

```bash
npm run dev
```

- Public site → [http://localhost:3000](http://localhost:3000)
- Arabic site → [http://localhost:3000/ar](http://localhost:3000/ar)
- Admin login → [http://localhost:3000/login](http://localhost:3000/login)

Sign in with the email/password you created in Step 5.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (Inter + Cairo fonts, metadata)
│   ├── globals.css           # Full CSS design system
│   ├── page.tsx              # EN home
│   ├── about/                # EN about
│   ├── committees/           # EN committees
│   ├── divisions/            # EN divisions
│   ├── activities/           # EN activities
│   ├── merch/                # EN merch shop
│   ├── join/                 # EN join form
│   ├── login/                # Admin login
│   ├── ar/                   # Arabic mirrors of all public pages
│   ├── admin/                # Protected admin panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── auth.ts           # requireAdminPage() helper
│   │   ├── actions.ts        # Save / delete server actions
│   │   ├── layout.tsx        # Admin shell with sidebar
│   │   ├── [resource]/       # CRUD list, new, edit pages
│   │   ├── applications/     # View-only membership applications
│   │   └── orders/           # View-only merch orders
│   ├── api/auth/actions.ts   # Login / logout server actions
│   └── actions.ts            # Public form server actions (join, merch)
├── components/
│   ├── site/
│   │   ├── SiteShell.tsx     # Header, footer, navigation (sets lang/dir)
│   │   ├── Pages.tsx         # All public page components
│   │   └── MerchOrderForm.tsx # Client component — dynamic size switching
│   └── admin/
│       ├── AdminNav.tsx      # Sidebar navigation
│       ├── ResourceTable.tsx # Generic CRUD list view
│       └── ResourceForm.tsx  # Generic CRUD create/edit form
├── lib/
│   ├── types.ts              # Shared TypeScript types
│   ├── bmsa-data.ts          # Static fallback data (committees, divisions, etc.)
│   ├── cms.ts                # Supabase content fetcher with fallback
│   └── admin-resources.ts    # Admin panel resource definitions
├── utils/supabase/
│   ├── public.ts             # Anon client (public reads + form submissions)
│   ├── server.ts             # SSR client (cookie-based session)
│   ├── admin.ts              # Service role client (admin writes, bypasses RLS)
│   └── middleware.ts         # Session refresh helper
├── proxy.ts                  # Next.js 16 proxy middleware (session refresh)
└── types/supabase-ssr.d.ts   # Type declarations for @supabase/ssr

supabase/
└── bmsa_vibe_cms.sql         # Complete schema + RLS + seed data (run once)
```

---

## Admin panel routes

| Route | Description |
|---|---|
| `/login` | Admin login — email + password |
| `/admin` | Dashboard — live counters + latest applications and orders |
| `/admin/activities` | Manage activity cards (create / edit / delete / publish) |
| `/admin/merch` | Manage merch products |
| `/admin/board` | Manage board members |
| `/admin/images` | Manage image URL overrides |
| `/admin/applications` | View-only membership applications report |
| `/admin/orders` | View-only merch orders report |

---

## Database tables

| Table | Purpose | Public access |
|---|---|---|
| `admin_users` | Authorised admin accounts | None (admin-only) |
| `bmsa_activities` | CMS-managed activity cards | Read published rows |
| `bmsa_merch_items` | Shop products | Read published rows |
| `bmsa_board_members` | EB and TO members | Read published rows |
| `bmsa_images` | Centrally managed image URLs | Read published rows |
| `bmsa_membership_applications` | Join form submissions | Insert only |
| `bmsa_merch_orders` | Order form submissions | Insert only |

> The `service_role` key used by admin routes bypasses RLS entirely. All public queries use the `anon` key, which is strictly governed by the policies above.

---

## Content management

### Published / unpublished
Every CMS table has a `published boolean` column. Only rows where `published = true` appear on the public site. Unpublished rows are visible and editable in the admin panel.

### Fallback data
If Supabase is not configured, or a table returns no rows, the site falls back to the static data in `src/lib/bmsa-data.ts`. Committees and divisions always use local data (not yet CMS-managed).

### Image overrides
The `bmsa_images` table maps path keys (e.g. `images/hero/hero-main.jpg`) to public URLs. Add or update rows via the admin panel to replace any site image without touching code.

---

## Seed data (included in SQL)

After running `bmsa_vibe_cms.sql` your database contains:

- **6 activities** — one per committee (SCOME, SCORA, SCOPE, SCOPH, SCORE, SCORP), bilingual EN/AR
- **4 merch items** — Hoodie (350 EGP), T-shirt (180 EGP), Lab Coat (450 EGP), Tote Bag (120 EGP)
- **9 board members** — 3 EB (President, VP Internal, VP External) + 6 TOs (one per committee)
- **7 image override keys** — 4 logos + hero + about-team + about-history
- **5 demo applications** + **3 demo orders** for testing the reports pages

All seed rows are marked `published = true`. You can toggle any row to `published = false` in the admin panel to hide it from the public site.

---

## Build for production

```bash
npm run build   # Production build
npm run start   # Start production server
```

### Type check

```bash
npm run typecheck   # tsc --noEmit (must exit with 0 errors)
```

### Lint

```bash
npm run lint
```

---

## Deployment

The project is a standard Next.js 16 application deployable to any Node.js platform.

**Vercel (recommended)**
1. Push the repository to GitHub.
2. Import the project on Vercel.
3. Add the three environment variables in **Project Settings → Environment Variables**.
4. Deploy. Vercel automatically runs `npm run build`.

**Other platforms (Railway, Render, Fly.io)**
```bash
# Build
npm run build

# Start
npm run start
```

Set these environment variables on the platform:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

> `SUPABASE_SERVICE_ROLE_KEY` is only read server-side. It must never be in client-side code, `.env` files committed to version control, or platform environment variables marked "public".

---

## Security notes

- All admin routes require both a valid Supabase Auth session **and** a row in `admin_users`.
- The `is_admin(uuid)` function is `SECURITY DEFINER` — it runs as the function owner (bypasses RLS) so it can safely check `admin_users` without circular policy evaluation.
- The `SUPABASE_SERVICE_ROLE_KEY` is only used in server-side actions (`src/app/admin/actions.ts`, `src/utils/supabase/admin.ts`) and is never sent to the browser.
- Public form submissions use the `anon` key, which RLS restricts to INSERT-only on `bmsa_membership_applications` and `bmsa_merch_orders`.
- Public reads are restricted to `published = true` rows only.
- Session cookies are refreshed on every request via the `proxy` middleware (`src/proxy.ts`).

---

## Troubleshooting

**Login redirects back to `/login` without an error**
The Auth session was created but the user has no row in `admin_users`. Run the Step B insert from the Quick Start, then retry.

**Admin panel shows "Supabase setup required"**
One or more environment variables are missing or still contain placeholder values from `.env.example`. Check that `.env.local` has real values for all three keys and restart `npm run dev`.

**Form submissions show "CMS is not configured"**
`NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing. These are required for the public form insert.

**`supabase.rpc('is_admin', ...)` returns an error**
The `is_admin` function was not granted to the `anon` and `authenticated` roles. Re-run `bmsa_vibe_cms.sql` — the `GRANT EXECUTE` statement is included.

**Public pages show fallback data, not CMS content**
Either Supabase is not configured, or no rows are marked `published = true` in the relevant table. Check the admin panel and ensure items are published.

**`npm run build` fails with "Both middleware file and proxy file are detected"**
Delete `src/middleware.ts`. Next.js 16 uses `src/proxy.ts` exclusively. Only one middleware file should exist.

---

## Development checklist

After cloning and configuring:

- [ ] `npm install` succeeds
- [ ] `.env.local` created with valid Supabase keys (URL, anon key, service role key)
- [ ] `supabase/bmsa_vibe_cms.sql` run in Supabase SQL Editor without errors
- [ ] Admin user created in Supabase Auth and inserted into `admin_users`
- [ ] `npm run dev` starts without errors
- [ ] `http://localhost:3000` shows the English home page
- [ ] `http://localhost:3000/ar` shows the Arabic home page (RTL layout)
- [ ] `/join` form submits and redirects to `/join?submitted=1`
- [ ] `/ar/join` form submits and redirects to `/ar/join?submitted=1`
- [ ] `/merch` — selecting a product with sizes shows a size dropdown
- [ ] `/merch` order form submits and redirects to `/merch?ordered=1`
- [ ] `/login` accepts admin credentials and redirects to `/admin`
- [ ] `/admin` dashboard shows correct row counts
- [ ] `/admin/activities` create / edit / delete works; published toggle hides item from public
- [ ] `/admin/merch` create / edit / delete works
- [ ] `/admin/board` create / edit / delete works
- [ ] `/admin/images` create / edit / delete works
- [ ] `/admin/applications` shows submitted applications
- [ ] `/admin/orders` shows submitted orders
- [ ] `npm run typecheck` exits with 0 errors
- [ ] `npm run build` completes with 0 errors and 0 warnings
