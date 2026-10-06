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
