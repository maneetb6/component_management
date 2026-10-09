<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Project context

Component management system for UBC Formula Electric: a simple app for tracking car components (quantity, storage location, status). Keep it basic, with a strong focus on clean, easy-to-use UI/UX.

- **Stack:** Next.js App Router + React + Tailwind CSS. The backend lives in this same app as Server Actions and Route Handlers; there is no separate server.
- **Database:** Neon Postgres via Drizzle ORM. The schema is in `db/schema.ts` and the client is `import { db } from "@/db"`. `DATABASE_URL` comes from `.env.local` (see `.env.example`).
- **Vercel is not connected yet.** It is only set up at the deploy stage. Until then:
  - Don't run `vercel link`, `vercel env pull`, `vercel deploy`, or other Vercel CLI commands, and don't add Vercel-only dependencies or integrations.
  - Local development talks to a Neon database directly using the connection string in `.env.local`.
  - Keep the code deployable to Vercel (standard Next.js, config via env vars), but don't assume Vercel-provided env vars exist.
- **Schema changes:** edit `db/schema.ts`, then `npm run db:push` in development.
