# VORTEX — Plan

> Generated 2026-09-07 — next features after batch publish + FK fix (`c1618f3`)

## 1. Snapshot

* **Stack:** Next 16.3 + React 19 + Prisma 5.22 (Neon Postgres pooler), R2 (`src/lib/storage.ts`), Tailwind.
* **Auth:** PIN `1740` only — `middleware.ts:13` + `src/lib/adminPin.ts` + `src/lib/permissions.ts` (now FK-safe `findFirst`/`upsert` with retry, `c1618f3` odds max 100k).
* **Models:** `User` (`ADMIN/CONTRIBUTOR`), `Tip {imageUrl,storageKey,bookingCode,bookmaker,odds,confidence,note,status: PENDING/WON/LOST/CANCELLED, createdById}`, `Submission {guestName,ipHash,source,member,status,submittedById,reviewedById}`, `Notification` (`SUBMISSION_NEW/APPROVED/REJECTED/TIP_CREATED/WON/LOST/UPDATED`), `ActivityLog`.
* **Routes:** `/` / `/tips` / `/tips/[id]` / `/results` / `/submit` (guest `5/h` + honeypot) / `/admin` / `/admin/tips` (batch 10 via `AdminBatchTipForm.tsx`) / `/admin/submissions` (approve→`Tip.create`+`ActivityLog`) / `/admin/notifications` / `/api/notifications`.
* **UI:** `Header` + `NotificationBell.tsx` (badge, tabs, 15s poll, `timeAgo`), `AdminTipForm`→`AdminBatchTipForm` (10 rows, per-game image+status), `TipRow`, `TipCard/Grid`.

## 2. Completed (last 3 pushes)

* `1368ae1` — FK harden + batch 10 independent slips (per-game `bookingCode`/`WON/LOST`).
* `7bf8159` — `layout force-dynamic` + `suppressHydrationWarning` for #441.
* `c1618f3` — `oddsSchema max 1000 → 100000`.

## 3. Proposed features (pick 1–2 per sprint)

### P1 — Credibility: Results analytics & ROI
* **Where:** `src/lib/tips.ts`, `src/app/results/page.tsx`, `src/app/admin/page.tsx`.
* **What:** `winRate = WON/(WON+LOST)`, `profit(100 stake)`, `avgOdds`, streaks, filter `bookmaker/date/status`. Public `StatsStrip` + admin chart (no migration, agg over `Tip`).
* **Effort:** M.

### P2 — Distribution: Copy tracking + Telegram/Push
* **Where:** `src/components/ui/CopyButton.tsx` + new `src/lib/telegram.ts`, `src/lib/actions.ts:130` batch hook.
* **What:** `Tip {copyCount Int @default(0)}` via `POST /api/tips/[id]/copy` (`prisma.tip.update increment`). `TELEGRAM_BOT_TOKEN/CHANNEL` auto-post on `createTipsBatchAction` (one message per batch with codes). `public/manifest.json` PWA.
* **Effort:** L-M. **Migration:** `add copyCount`.

### P3 — Proof: Result proof & history
* **Where:** `prisma/schema.prisma` `Tip {resultProofImageUrl, settledAt}`, `TipOddsHistory`.
* **What:** Second upload for settled slip, public filter `WON/LOST/PENDING`, timeline from `ActivityLog`.
* **Effort:** M.

### P4 — Discoverability: Search / filters / bookmarks
* **Where:** `src/app/tips/page.tsx`, `src/components/tips/TipGrid.tsx`.
* **What:** `?q=bookingCode&bookmaker=Bet9ja&odds=2-50&status=WON` → `prisma.tip.findMany({where:{OR}})` + pagination. `localStorage` bookmarks → `/bookmarks`.
* **Effort:** L-M, no migration.

### P5 — Moderation: Queue SLA
* **Where:** `src/components/notifications/NotificationBell.tsx`, `src/app/admin/submissions/page.tsx`.
* **What:** Pending badge, `PENDING>48h` auto-flag, Turnstile on `/submit`.
* **Effort:** L.

### P6 — Team: Multi-admin
* **Where:** `src/app/admin/contributors/page.tsx`, `src/lib/auth` (reuse `USER` roles).
* **What:** Proper `ADMIN` vs `CONTRIBUTOR` management (currently `User` unused), per-tip `referralUrl`.
* **Effort:** M.

## 4. Recommended order

* **Sprint 1 (now):** P2 + P1 — immediate growth + trust.
* **Sprint 2:** P4 + P5 — search + SLA.
* **Sprint 3:** P3 + P6 — proof + team.

## 5. Batch detail (already shipped, for reference)

* **Validation:** `src/lib/validations.ts:18` `tipBatchSchema` 1..10.
* **Action:** `src/lib/actions.ts:62` `createTipsBatchAction` parses `count` + `image_0…9`/`bookingCode_0`…, `tipSchema` per game, `uploadSlipImage` ×N, `prisma.$transaction` N×`tip.create` + batch `TIP_CREATED` notification.
* **UI:** `AdminBatchTipForm.tsx` — `useState<GameRow[]>` 1→10, per-row `ImageUploader`, inputs, `status` select, add/remove, `Publish N`.

## 6. Risks to handle next

* Vercel 4.5 MB body for 10× images → client compress or presigned R2.
* Neon pooler FK race → keep `permissions.ts` retry + verify `reviewer` before `tx`.
* Hydration → `mounted` guard for bell, deterministic `timeAgo` (UTC).

## 7. Open questions

* Bell for all visitors vs admin-only?
* Telegram auto vs manual button?
* Referral links to embed?
* Batch grouping `TipBatch` model wanted now or later (Phase 1 shipped without)?

---
*Next step when you return:* say `build P2` or `build P1` and this file will be used as execution checklist.
