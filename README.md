
# HELP-ME

HELP-ME is being developed as a clean, secure SaaS platform for intelligent assistance.

## Development Order

1. **Foundation and Verified Build**
2. **Privacy Consent and Secure Authentication**
3. **User Accounts and Dashboard**
4. **AI Provider and Conversations**
5. **Usage Tracking and Plan Limits**
6. **Stripe Subscriptions and Billing**
7. **Multi-Tenant Security and Data Isolation**
8. **Administration and Management**
9. **Production Readiness and Final Verification**

## AI Development

The initial development environment uses a **free Mock AI Provider** for testing and platform development.

No commercial AI API is required during the initial development and verification phase.

The AI layer is designed to remain independent so that a real AI provider can be connected later without rebuilding the platform architecture.

## Technology Stack

* **Next.js** — App Router
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **NextAuth authentication**
* **Stripe Billing**
* **Vercel-ready deployment**

## Project Structure

The **root application is the active HELP-ME application and the official development foundation**.

Legacy and experimental project directories rema
