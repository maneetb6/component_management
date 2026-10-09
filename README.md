# UBC Formula E: Component Manager (CPEN 221A MP1)

A simple web app for UBC Formula Electric to keep track of car components: what we have, how many, where it's stored, and what state it's in.

## Features (planned)

- Browse and search all components
- Add, edit, and delete components
- Track quantity, storage location, and status (available, in use, ordered, broken)
- Filter by subsystem (e.g. powertrain, chassis, electrical)

## Tech stack

A single Next.js app holds both the frontend and the Node.js backend, backed by a Postgres database. Everything is written in TypeScript.

| Layer     | Tool                                                              | Version |
| --------- | ----------------------------------------------------------------- | ------- |
| Language  | [TypeScript](https://www.typescriptlang.org)                      | 5       |
| Runtime   | [Node.js](https://nodejs.org)                                     | 20+     |
| Framework | [Next.js](https://nextjs.org) (App Router)                        | 16      |
| UI        | [React](https://react.dev)                                        | 19      |
| Styling   | [Tailwind CSS](https://tailwindcss.com)                           | 4       |
| Database  | [PostgreSQL](https://www.postgresql.org), hosted on [Neon](https://neon.tech) | —       |
| ORM       | [Drizzle ORM](https://orm.drizzle.team) + Drizzle Kit (schema and migrations) | 0.45    |
| DB driver | [@neondatabase/serverless](https://github.com/neondatabase/serverless) | 1       |
| Linting   | ESLint (Next.js config)                                           | 9       |
| Hosting   | [Vercel](https://vercel.com) (connected at the deploy stage)      | —       |

### How it fits together

```
Browser (React UI, Tailwind)
        │
        ▼
Next.js app on Node.js
  ├─ Pages & components       app/
  ├─ Server Actions           form submits and mutations, called directly from components
  └─ Route Handlers           app/api/**/route.ts, for REST endpoints if needed
        │
        ▼  Drizzle ORM (db/)
Postgres on Neon
```

### Frontend

- **Next.js App Router.** Each folder under `app/` is a route, and `page.tsx` is what renders at that route.
- **React Server Components by default.** Pages render on the server and can query the database directly, so no API call is needed just to show data. Add `"use client"` at the top of a component only when it needs interactivity (state, event handlers).
- **Tailwind CSS** for styling, using utility classes directly in JSX. Global styles and theme colours are in `app/globals.css`.

### Backend

- **There's no separate server.** Backend code runs on Node.js inside the Next.js app, and `npm run dev` starts the frontend and backend together.
- **Server Actions** (functions marked `"use server"`) handle creating, updating and deleting components. Forms call them directly.
- **Route Handlers** (`app/api/**/route.ts`) are available for plain JSON endpoints, e.g. for an export or another tool to call.
- When deployed, this code runs as Vercel serverless functions on the Node.js runtime.

### Database

- **PostgreSQL**, hosted on Neon's free tier. Neon is ordinary Postgres, so it can be moved to any Postgres host by changing `DATABASE_URL`.
- **Drizzle ORM** defines tables in TypeScript (`db/schema.ts`) and gives fully typed queries, e.g. `db.select().from(components)`.
- **Drizzle Kit** syncs the schema to the database (`npm run db:push`) or generates SQL migrations (`npm run db:generate`).
- The connection string comes from the `DATABASE_URL` environment variable (in `.env.local` for development).

## Getting started

### Prerequisites

- Node.js 20 or later
- A free [Neon](https://neon.tech) account (no Vercel account needed for development)

### Database

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Copy the connection string from the project dashboard (**Connect** → Node.js / Postgres URL).

### Setup

```bash
git clone <repo-url>
cd <repo-folder>
npm install
cp .env.example .env.local   # paste the Neon connection string as DATABASE_URL
npm run db:push              # create tables in your database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command               | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Start the dev server                              |
| `npm run build`       | Production build                                  |
| `npm run lint`        | Run ESLint                                        |
| `npm run db:push`     | Push the schema straight to the database (dev)    |
| `npm run db:generate` | Generate SQL migration files from the schema      |
| `npm run db:migrate`  | Apply generated migrations                        |
| `npm run db:studio`   | Open Drizzle Studio to browse the database        |

## Project structure

```
app/              Pages, layouts, and server actions (App Router)
db/schema.ts      Database tables (edit this to change the data model)
db/index.ts       Database client — import { db } from "@/db"
drizzle.config.ts Drizzle Kit config
```

## Data model

`components`

| Column        | Type      | Notes                                    |
| ------------- | --------- | ---------------------------------------- |
| `id`          | serial    | Primary key                              |
| `name`        | text      | Required                                 |
| `part_number` | text      | Manufacturer or internal part number     |
| `subsystem`   | text      | e.g. powertrain, chassis, electrical     |
| `quantity`    | integer   | Defaults to 0                            |
| `location`    | text      | Where it's stored in the shop            |
| `status`      | enum      | `available`, `in_use`, `ordered`, `broken` |
| `notes`       | text      |                                          |
| `created_at`  | timestamp |                                          |
| `updated_at`  | timestamp | Updated automatically on change          |

## Deploying

The app isn't connected to Vercel yet; that happens at the deploy stage. When we get there:

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Under **Settings → Environment Variables**, add `DATABASE_URL` with the Neon connection string (the same database used in development, or a separate Neon branch for production).
3. If it's a new database, run `npm run db:push` with `DATABASE_URL` pointed at it to create the tables.
4. Every push to the default branch then deploys to production, and every PR gets a preview URL.
