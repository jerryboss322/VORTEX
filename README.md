# TipsHub — Private Betting Tips Hub

Private web platform for a betting community. Moves slips + booking codes out of a crowded group chat.

**Stack:** Next.js 16 + TypeScript + Tailwind 4, Neon PostgreSQL + Prisma 5, Auth.js, Cloudflare R2, Vercel

## Architecture

```
Vercel (Next.js)
  ├─ Neon DB (tips, users, submissions)
  └─ R2 Storage (slip screenshots)
```

## Quick Start (Local)

1. **Env**: copy `.env.example` to `.env` and fill:
   - `DATABASE_URL` — Neon pooled URL
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `R2_*` — Cloudflare R2 credentials (local fallback auto-writes to `public/uploads`)

2. **DB**:
   ```bash
   npx prisma migrate dev
   npm run seed   # creates admin@tipshub.local / Admin123! and contrib@tipshub.local / Contrib123!
   ```

3. **Dev**:
   ```bash
   npm run dev  # http://localhost:3000
   npm run build
   ```

## Roles

- **Admin** (`/admin`): publish/edit/delete tips, change status, review submissions, manage contributors
- **Contributor** (`/submit`, `/contributor`): submit tips for review
- **Member** (no auth): view `/`, `/tips`, `/tips/[id]`, `/results`, copy codes

All protected routes gated via `middleware.ts` + server checks (`lib/permissions.ts`).

## Key Routes

- `/` — Today's PENDING tips + Recent results
- `/tips` / `/tips/[id]` / `/results`
- `/login` / `/submit` / `/contributor`
- `/admin` / `/admin/tips` / `/admin/submissions` / `/admin/contributors`

## Security

- Passwords hashed with bcrypt
- MIME + magic-byte + size (10MB) validation, randomized R2 keys
- Rate limit: 10 submissions/hour/contributor
- `robots.txt` disallow all + `noindex` on tip pages (private community)

## Deploy to Vercel

Push to GitHub, connect Vercel project, set env vars (Neon + R2 + AUTH_SECRET), `vercel --prod`.

