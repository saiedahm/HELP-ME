# HELP-ME

HELP-ME is a clean SaaS platform for secure, intelligent assistance.

## Foundation

The repository has been intentionally reset to a clean root application. Legacy directories are not part of the active application.

### Development order

1. Foundation and verified build
2. Privacy consent and secure authentication
3. User account and dashboard
4. Mock AI provider and conversations
5. Usage and plan limits
6. Stripe subscriptions
7. Multi-tenant security hardening
8. Administration
9. Production readiness

### Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- NextAuth
- Stripe
- Vercel

### AI

Development starts with a free Mock AI provider. No commercial AI API is required.

### Active structure

The active application lives at the repository root:

- `app/` — pages and API routes
- `lib/` — AI and database services
- `prisma/` — database schema
- `public/` — static assets
- `package.json` — single active application
- `next.config.ts` — deployment configuration

Do not reintroduce legacy application roots until the foundation has passed build and production verification.

## Local verification

```bash
pnpm install
pnpm prisma:generate
pnpm typecheck
pnpm build
pnpm start
```

Deployment verification trigger: latest main build must be produced from the current root application commit.

## Required production configuration

Do not enable paid subscriptions until these steps are complete and tested.

1. Configure a managed PostgreSQL database and set `DATABASE_URL`.
2. Set a strong, private `AUTH_SECRET` and set `NEXTAUTH_URL=https://www.helpmey.net`.
3. Set `NEXT_PUBLIC_APP_URL=https://www.helpmey.net`.
4. For AI replies, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL=gpt-4o-mini`. Without the API key, the app deliberately uses its mock provider.
5. In Stripe, create recurring prices for Business and Pro, then set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BUSINESS`, and `STRIPE_PRICE_PRO`.
6. Create a Stripe webhook endpoint at `https://www.helpmey.net/api/billing/webhook` for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Set its signing secret as `STRIPE_WEBHOOK_SECRET`.
7. After `DATABASE_URL` points to the intended database, apply the Prisma schema using the reviewed deployment procedure (for this repository, `npx prisma db push` is the current schema-sync option). Take a database backup first if the database already contains important data. Do not run schema changes against production until the target database is confirmed.
8. Redeploy and test signup, login, knowledge create/delete, chat, conversation history, Stripe test checkout, webhook delivery, cancellation, and subscription status.

Keep all secret values only in the deployment provider's encrypted environment settings. Never commit API keys or paste them into public issues.

## Current scope and launch checklist

Implemented in the current foundation: credentials-based account creation/login, organization membership, privacy/terms consent links, workspace knowledge CRUD, authenticated AI chat with persisted messages, workspace-scoped conversation history, dashboard monthly usage display, server-side monthly chat limits by saved plan, Stripe Checkout creation, signed webhook processing, global language selector with 20 choices, saved language preference, and right-to-left document direction for Arabic and Urdu.

Still requiring live configuration and end-to-end verification before commercial launch: production database schema sync, real OpenAI responses, Stripe test/live checkout and webhook delivery, public deployment verification, email verification/password recovery, legal review of privacy/terms and operator disclosures, verified translations on every route, and a public website embed widget with tenant-specific access controls. Monthly limits also require production testing against the configured database. Do not market unverified items as live features.
