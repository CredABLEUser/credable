# CredABLE

CredABLE is an AI-guided financial capability and leverage coach. You tell it
what's going on — in your own words — and it works with you through Reality →
Options → Choice → Action, helps you organize your financial world, and
prepares you to hand things off to a real professional when that's the right
next step.

This is a complete, working prototype: real (rule-based, LLM-optional)
reasoning, a real data model, real calculators, and a real course library —
running on mock data instead of live bank/payment connections, with clean
seams to swap those in later.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. There's nothing to configure to try the app —
sign in with any email address (this is a passwordless prototype: entering an
email creates or logs into that account, no password or verification step).

`npm run build && npm run start` runs a production build.

## How it's built

- **Next.js 16** (App Router, Turbopack, Server Actions — no separate `/api`
  layer; the components in `src/app` call functions in `src/lib/actions/*`
  directly).
- **TypeScript** throughout, **Tailwind CSS v4** for styling.
- Data lives in a **JSON file** (`data/db.json`), read/written through
  `src/lib/db.ts`. There is no real database in this prototype.
- Auth is **passwordless and cookie-based** (`src/lib/session.ts`) — an email
  address is the whole signup flow, matching the product spec's "minimal
  friction" requirement.
- The **coaching engine** (`src/lib/ai/`) is rule-based by default and will
  use a real Claude model automatically if you provide an API key (see
  below). Either way it reasons over the same structured context: your
  stored worries, goals, and financial items.

The file `AGENTS.md` at the project root is a note-to-self for AI coding
tools about this specific Next.js version having a different API surface
than most training data — it's technical build tooling, not part of the
product, and safe to ignore or delete.

## Where things live

```
src/lib/types.ts            data model (User, Run, Message, Worry, Goal,
                             FinancialItem, Scenario, Resource, ...)
src/lib/db.ts                the JSON-file "database" — swap point for a
                             real database (see below)
src/lib/session.ts           passwordless auth / cookie session
src/lib/config.ts            product config: free-run allowance, nav,
                             My Stuff categories, membership price/copy
src/lib/ai/                  the coaching engine (rules.ts is the default
                             reasoner; llm.ts is the optional real-LLM path)
src/lib/scenarios/           the 4 financial calculators (debt consolidation,
                             home affordability, credit paydown, keep-vs-sell)
src/lib/school/content.ts    CredABLE School: pathways + lessons, including
                             the full 10-part Leverage Masterclass
src/lib/resources/data.ts    the resource/referral database
src/lib/actions/             Server Actions — all reads/writes go through here
src/app/                     pages (App Router)
src/components/              UI
data/db.json                 the mock database (starts empty/fresh)
```

## Connecting real services

Everywhere a real integration would eventually plug in, the app is built so
swapping it in is a matter of replacing one function's insides — nothing
downstream (the UI, the entitlement logic, the AI context) needs to change,
because everything reads from the same `User` / `FinancialItem` records
regardless of where the data came from.

### Stripe (membership billing)

`src/lib/actions/membership.ts` has two functions:

- `joinTheClub()` — currently just flips `user.accountStatus` to `"member"`
  and `membershipStatus` to `"active"` directly in the JSON store. Replace
  the body with a call to create a Stripe Checkout Session (or redirect to
  one), and have your Stripe webhook handler call the same
  `mutateDB(...)` update once the subscription is confirmed active.
- `cancelMembership()` — same idea, in reverse; wire it to Stripe's
  subscription-cancellation API and/or a webhook.

You mentioned you already have a Stripe account — to connect it you'll need:
a **secret key** (server-side, e.g. `STRIPE_SECRET_KEY` in `.env.local`), a
**Price** created in the Stripe Dashboard for the $9.99/month membership
(`MEMBERSHIP_PRICE_LABEL` in `src/lib/config.ts` is just display text — the
real price of record lives in Stripe once you connect it), and a **webhook
endpoint** (e.g. `src/app/api/stripe-webhook/route.ts`, which doesn't exist
yet) pointed at Stripe so cancellations/failed payments/etc. stay in sync
even when the user isn't actively in the app. None of this is wired up yet —
membership is fully simulated right now.

### Plaid (bank/account connections)

My Stuff now offers three ways to add anything, per the product spec:
**Add it manually** (fully working), **Connect it** (a *simulated* Plaid
Link flow — clicking it fills in a couple of realistic mock accounts for that
category so you can see what the connected experience looks like), and
**Help me find it** (hands off to Ask CredABLE for guidance).

The simulation lives in `simulateConnect()` in `src/lib/actions/stuff.ts`.
To make it real: replace the mock `CONNECT_SIMULATION` fixtures with a real
Plaid Link session — the client opens Plaid Link, gets a `public_token` back,
posts it to a new Server Action or route handler that exchanges it
server-side for an `access_token`, and that handler calls `/accounts/get` (or
sets up a webhook for ongoing sync) and writes the results into
`db.financialItems` with `source: "connected"` exactly like the simulation
does now. `CONNECTABLE_CATEGORIES` in `src/lib/config.ts` lists which My
Stuff categories currently offer "Connect it" — Plaid maps cleanly to cash +
banking, credit + debt, retirement + investments, and (via property/asset
lookups) real estate; extend that list as you wire up more account types.

### A real LLM (optional — the app works without it)

By default, CredABLE's reasoning comes from `src/lib/ai/rules.ts`, a
deterministic rule engine tuned to the product's coaching framework (Reality
→ Options → Choice → Action; "Can I?" vs "Should I?"; protecting the
rebound; etc.) — this is why the app works fully out of the box with no API
keys.

To have real Claude-generated responses instead, set an API key:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

`src/lib/ai/llm.ts` will then be used automatically to generate the
conversational reply text (the underlying structure — suggested actions,
depth level, etc. — still comes from the same context-building logic either
way). No key means no network calls and no cost; this is intentionally
optional.

### Domain (credableclub.com)

This is a standard Next.js app, so it's not a fit for PythonAnywhere (built
for Python WSGI apps, not Node/Next.js). The straightforward path is
**Vercel** (built by the Next.js team, deploys straight from this repo, and
handles the JSON-file caveat below) — `vercel.com`, connect the repo, point
`credableclub.com`'s DNS at the deployment, done. Any Node hosting works too
(Railway, Render, a VPS with `npm run build && npm run start`), it's just
more setup.

**Important caveat before deploying anywhere:** `data/db.json` is a plain
file on disk. That's fine for local development and demos, but most hosting
platforms (Vercel included) use ephemeral or read-only filesystems in
production, meaning writes can silently fail to persist or reset on
redeploy. Before a real launch, swap `src/lib/db.ts`'s `readDB`/`writeDB`
for a real datastore (Postgres via Vercel Postgres/Supabase/Neon is a
common pairing with Vercel) — every other file reads and writes through
`readDB()`/`mutateDB()`, so this is a contained, one-file change.

### Mobile ("in your pocket")

The app is mobile-first and installable as a **PWA** right now — on a phone,
"Add to Home Screen" gives it an app icon, standalone window (no browser
chrome), and offline-friendly shell. That's the fast path to "on your
phone" and it's live in this build (`public/manifest.webmanifest`, icons in
`public/icons/`).

True app-store distribution (a real listing in the Apple App Store / Google
Play) is a bigger, separate project — typically via
[Capacitor](https://capacitorjs.com), which wraps this same Next.js app in a
native shell for store submission. Worth doing once the web product is
validated; not part of this build.

## Product notes for whoever picks this up next

- **Free runs**: new accounts get 3 free "runs" (`DEFAULT_FREE_RUNS_ALLOWED`
  in `src/lib/config.ts`) — a *run* is one complete Ask CredABLE
  conversation, not a per-message limit. The entitlement logic
  (`src/lib/actions/runs.ts`) is deliberately defensive: starting a new run
  auto-resolves any still-open run first, so a user can't dodge the paywall
  by just never closing out a conversation.
- **Resources / affiliate disclosure**: `src/lib/resources/data.ts` keeps a
  hard line between real relationships (Pomeroy Lending is wired as a real
  affiliated professional handoff; AnnualCreditReport.com, NFCC counseling,
  etc. are real informational resources) and two clearly-labeled *example*
  affiliate product placeholders included to show the pattern — their
  disclosure text says outright that no real affiliate relationship exists
  yet. Don't remove those disclosures if you fill in a real partner later;
  just replace the placeholder content and update the disclosure to match
  the real relationship.
- **Test/demo data**: `data/db.json` ships empty (freshly reset) so you're
  starting from a clean slate.
