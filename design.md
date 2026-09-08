# TipsHub design plan

This documents the redesign discussed for TipsHub — a private betting-tips
community site (not a bookmaker). The goal was to move it from a generic
dark-dashboard look to something that reads as a "members' club coupon" —
a paper betting-slip feel, executed with more restraint and craft than the
current build.

---

## 1. Design philosophy

Three ideas run through every screen:

- **The ticket is the hero.** A betting slip — bookmaker, odds, booking
  code — is the one object visitors actually came for. Everything else
  (nav, admin chrome) should get out of its way and be quieter than it is
  now.
- **One accent, spent carefully.** The current site uses solid yellow for
  every primary button, which flattens hierarchy — nothing stands out
  because everything is loud. The new palette keeps one accent (a muted
  gold) and reserves it for the few things that are genuinely primary:
  the active nav tab, a "Save" confirmation, an icon here and there.
- **Admin and public are the same language, different dialect.** Both use
  the same colors, type, and radius so the whole product feels like one
  system — but admin favors bordered lists (dense, scannable, made for
  repeated actions) while the public site favors the ticket card (made to
  be looked at, not just scanned).

---

## 2. Color system

Dark palette throughout — no light-mode variant was requested.

| Token | Hex | Role |
|---|---|---|
| `--th-bg` | `#0E1013` | Page background |
| `--th-surface` | `#171A1F` | Card / row background, one step up from the page |
| `--th-border` | `rgba(255,255,255,0.08)` | Hairline dividers and card outlines |
| `--th-chip` | `rgba(255,255,255,0.05)` | Fill for small inset elements — the booking-code chip, icon backgrounds |
| `--th-text` | `#EDEAE3` | Primary text — a warm off-white, not pure white, so it doesn't glare against the charcoal |
| `--th-sub` | `#9C978C` | Secondary/muted text — labels, captions, timestamps |
| `--th-gold` | `#C9A15A` | The one accent — active states, the primary "Save" action, brand mark |
| `--th-green` | `#7BB894` | Won / success status only |
| `--th-red` | `#C97D74` | Lost / destructive action only |

**Why these specific choices:**
- The background is a warm charcoal (`#0E1013`), not pure black — pure
  black next to white text is harsh and is what makes the current build
  feel like a generic terminal/dashboard rather than something considered.
- Gold instead of yellow: the current bright yellow reads as a "buy now"
  button color. A desaturated, darker gold reads as premium/members'-club
  instead of e-commerce.
- Status colors (green/red) are muted, not saturated — they need to be
  identifiable at a glance, not alarming. They're used only for status,
  never decoratively.
- Text on colored fills always uses the darkest tone available (e.g. the
  gold "Save" button uses a dark brown text `#3A2E14`, not black or white)
  so it reads as intentional rather than a default browser contrast fix.

---

## 3. Typography

Two families, each with one clear job:

- **Fraunces** (serif) — used only for: the wordmark, page titles, and
  numerals (odds, stats). This is the "voice" of the brand — it's what
  makes a plain number like `18.40` feel like it belongs on a printed
  ticket rather than a spreadsheet.
- **Inter** (sans) — used for everything else: nav, labels, body text,
  buttons, table content. This is the "utility" layer — it should be
  invisible and just work.

Scale actually used across the mockups:

| Size | Weight | Family | Used for |
|---|---|---|---|
| 25px | 500 | Fraunces | Page title ("Today's tips", "Admin") |
| 32–34px | 500 | Fraunces | Odds numeral on a ticket card |
| 19–20px | 600 | Fraunces | Wordmark, stat-bar numbers |
| 14–15px | 500 | Inter | Card titles, table numerals (admin) |
| 13px | 400 | Inter | Body text, nav links, notification text |
| 12px | 400 | Inter | Labels, captions, timestamps, status text |
| 11px | 400 | Inter | Table column headers |

Two weights only — 400 and 500/600. Nothing bolder; a heavier weight would
compete with the serif numerals for attention.

---

## 4. Spacing and radius

The current build uses tight padding (~12px) and small radii (~6–8px),
which is what makes it feel cramped and generic. The new system:

| Element | Radius | Padding |
|---|---|---|
| Outer page container | 20px | 28px |
| Ticket card (public) | 18px | 20–22px |
| Admin action card | 14px | 18px |
| Admin table / list container | 14px | — (rows carry their own) |
| Table row | — (square, sits inside rounded container) | 14px vertical, 18px horizontal |
| Booking-code chip | 9px | 6–7px / 10–13px |
| Ghost pill button | 8px (rectangular) or 999px (fully round, nav/tag pills) | 6–7px / 13–18px |
| Notification icon chip | 9px | fixed 30×30px |

General rule: bigger radius on bigger containers, smaller radius on small
inset elements — this is what avoids the "identical rounded corner on
everything" look. Fully round (999px) pills are reserved for nav tags and
short single-word actions ("Copy", "Submit tip"); everything else keeping
a 8–18px continuous radius so it reads as one system rather than
random.

---

## 5. Component breakdown

### 5.1 Public nav
- Ticket icon + serif wordmark in place of the plain colored dot the
  first draft used.
- Active tab ("Tips") is a gold underline, not a filled highlight block —
  keeps the accent spent on one hairline instead of a whole shape.
- "Submit tip" is a hairline ghost pill, not a solid button — it's an
  action, not the primary CTA of the page, so it shouldn't out-shout the
  content.

### 5.2 Stat bar (new — didn't exist before)
A three-column strip under the page title: tips this month, win rate,
average odds. Added because a tips page's whole value proposition is
"this source is worth following" — leading with a track record before
the list of tickets gives visitors a reason to trust what follows.
Bordered container, hairline dividers between the three columns, no
fills — it's context, not a headline.

### 5.3 Ticket card (public)
Structured like an actual betting slip, split into three zones by a
perforated divider:
1. **Header row** — bookmaker + sport (muted, left) and status dot +
   label (colored, right).
2. **Body** — large serif odds number with "Combined odds" caption
   beneath it on the left; selection count and an example stake→payout
   line on the right, so the odds aren't just an abstract number.
3. **Footer** — monospace booking-code chip on the left, "Copy" ghost
   pill on the right.

The **perforation** (dashed hairline with two circular notches punched
out of the card's left/right edge) is the one deliberately decorative
touch, sitting between body and footer. It's what signals "this is a
ticket" at a glance rather than "this is a generic card with rounded
corners." A thin 3px accent strip across the top of the card (gold /
red / green depending on status) reinforces state without needing a
loud badge.

### 5.4 Admin action cards (Manage tips / Submissions / Notifications)
Deliberately calmer than the public ticket cards: identical styling
across all three (no color-per-card coding), a small gold icon, a title,
one line of description. These are navigation entry points, not content —
they shouldn't compete with each other for attention the way the current
teal/gold/purple top-bars do.

### 5.5 Admin tip list
Switched from "each row is its own bordered card" to a single bordered
container holding a header row (column labels in sentence case: Code,
Bookmaker, Odds, Status) and then plain rows separated by hairline
dividers. This is a deliberate departure from the public card style —
dense repeated data reads faster as a table than as a stack of cards, and
using a visually distinct pattern for admin vs. public also means neither
surface gets mistaken for the other.

Row actions are ghost pills: "Edit" neutral, "Delete" outlined in red
text/border (not filled) — destructive but not screaming.

### 5.6 Status control (replaces the separate dropdown + "Set" button)
This was a follow-up fix once it became clear the table mockup had no way
to actually change status. The interaction:
1. **Resting state** — the status itself is the control: a ghost pill
   showing the dot + current label + a chevron. No separate "Set" button
   is visible, because there's nothing to confirm yet.
2. **Click it** — a small menu opens directly under the chip, listing
   Pending / Won / Lost / Cancelled, each with its own dot, and a
   checkmark next to whichever is currently selected.
3. **Pick a new value** — the chip immediately updates to match (color
   and label change), so you get visual confirmation before saving
   anything.
4. **A gold "Save" pill appears** next to the chip — the one filled
   (non-ghost) element in the row, because it's now the one thing that
   actually needs a decision. It only exists in this dirty state; in the
   resting state there is nothing to click but the status chip itself.

This collapses two always-visible controls (select + Set button) into
one control that only asks for confirmation when a change is pending —
less visual noise on rows nobody is touching, same underlying save
action.

### 5.7 Notifications feed
Structured as an activity log, not a card grid, since it's read-only
history:
- **Grouped by day** ("Today", "Yesterday") — avoids re-reading full
  timestamps to figure out when something happened.
- **Icon chip per row**, tinted at low opacity to match the action type:
  upload icon/neutral gray for a new submission, check/green for an
  approval, globe/gold for a publish, x/red for a reject. Low-opacity
  tints keep the icon legible without turning each row into a colored
  block.
- **Plain-language sentence** with the booking code inline in monospace
  ("Approved `JN7TEX` from Kuntus master") rather than a label/value
  table layout — a log reads better as a sentence than as data fields.
- **Relative time** on the right ("2m ago", "1h ago"), falling back to a
  real date once an entry is a day or more old.

---

## 6. Iconography

Outline-style icons only (no filled variants), used at 15–18px, always
inheriting the surrounding text color unless a semantic tint applies
(green/gold/red for status). Icons used across the mockups: ticket
(wordmark), chevron down/up (status control), check (approve, selected
menu item), x (reject), upload (submission), world (publish/live).

---

## 7. What's intentionally NOT decorative

To keep the "spend the accent carefully" principle honest:
- No gradients anywhere.
- No drop shadows — hierarchy comes from the surface/border/radius
  system, not shadow depth.
- Only one filled/solid button exists in the whole system in these
  mockups: the "Save" confirmation on the status control. Every other
  action (Copy, Edit, Delete, Submit tip, Approve/Reject) is a ghost
  pill, distinguished by border/text color rather than fill.
- Status colors (gold/green/red) are never used decoratively — only to
  mean pending/won/lost.

---

## 8. Implementation notes

If translating into Tailwind, the palette maps cleanly onto a small
`extend` block:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      th: {
        bg: '#0E1013',
        surface: '#171A1F',
        text: '#EDEAE3',
        sub: '#9C978C',
        gold: '#C9A15A',
        green: '#7BB894',
        red: '#C97D74',
      },
    },
    fontFamily: {
      serif: ['Fraunces', 'serif'],
      sans: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      card: '18px',
      admin: '14px',
      chip: '9px',
    },
  },
},
```

Border color and the two chip/border rgba tokens (`--th-border`,
`--th-chip`) are easiest kept as raw CSS custom properties rather than
Tailwind colors, since they're translucent overlays rather than flat
hues — set them once on `:root` / the app shell and reference with
`border-[color:var(--th-border)]` or a small `bg-white/[0.05]` utility
where Tailwind's opacity modifiers cover it directly.

Fonts: `Fraunces` (weights 500/600) and `Inter` (weights 400/500/600)
via `next/font/google` rather than a runtime `<link>` tag, to avoid a
flash of unstyled text on first load.
