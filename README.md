# GrowthOS

**Get More Customers with AI** — an AI-powered B2B sales and lead generation platform for startup founders, freelancers, agencies, and small businesses.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · OpenAI · Stripe**, ready to deploy on **Vercel**.

---

## Features

1. **Authentication** — email/password sign up, login, forgot password, and Google OAuth (Supabase Auth).
2. **Dashboard** — total leads, leads contacted, AI messages generated, response rate.
3. **AI Lead Finder** — enter industry/location/company size → AI returns a target customer profile, prospect suggestions, and an outreach strategy (stored in DB).
4. **AI Cold Email Generator** — personalized cold email, LinkedIn DM, and follow-up, each with a copy button.
5. **AI Sales Assistant** — ChatGPT-style chat for pricing, conversion, and growth questions.
6. **Lead Management CRM** — create / edit / delete / search leads with name, company, status, email, notes.
7. **Pricing** — Free (20 AI generations/mo), Pro ($29/mo), Team ($99/mo) with Stripe Checkout.
8. **Landing page** — hero, features, testimonials, pricing, FAQ, CTA.
9. **User settings** — profile, subscription (Stripe billing portal), API usage meter.
10. **Admin dashboard** — total users, MRR, AI usage, active subscriptions.

---

## Project structure

```
growthos/
├─ supabase/schema.sql          # full database schema + RLS + triggers
├─ middleware.ts                # Supabase session refresh + route protection
├─ src/
│  ├─ app/
│  │  ├─ page.tsx               # landing page
│  │  ├─ pricing/               # standalone pricing page
│  │  ├─ (auth)/                # login, signup, forgot-password
│  │  ├─ auth/callback/         # OAuth / magic-link callback
│  │  ├─ dashboard/             # app shell + all 10 feature pages
│  │  └─ api/                   # ai/*, leads, stripe/* route handlers
│  ├─ components/               # ui, landing, dashboard components
│  ├─ lib/                      # supabase, openai, stripe, usage, utils
│  └─ types/                    # database types
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in every value (see the variable list below).

### 3. Create the database

In your Supabase project, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. This creates all tables, row-level security policies, the auto-profile trigger, and the `updated_at` triggers.

### 4. Enable auth providers

In Supabase → **Authentication → Providers**: enable **Email** and **Google** (add your Google OAuth client ID/secret). Add `http://localhost:3000/auth/callback` and your production callback URL to the allowed redirect URLs.

### 5. Configure Stripe

Create two recurring **Products/Prices** in Stripe ($29/mo Pro, $99/mo Team) and copy their price IDs into `.env.local`. For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

### 6. Run

```bash
npm run dev
```

Visit http://localhost:3000.

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | App base URL (e.g. https://growthos.vercel.app) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server only; admin + webhook) |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Model name (default `gpt-4o-mini`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro |
| `NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID` | Stripe price ID for Team |
| `ADMIN_EMAILS` | Comma-separated emails granted admin access |

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → import the repo**. Framework auto-detects as Next.js.
3. Add **all** environment variables from `.env.example` in **Project Settings → Environment Variables**. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain.
4. Deploy.
5. In **Stripe → Developers → Webhooks**, add an endpoint: `https://<your-domain>/api/stripe/webhook` listening for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
6. In Supabase, add `https://<your-domain>/auth/callback` to the auth redirect allow-list.

---

## Security notes

- All user tables are protected by **Row Level Security** — users can only access their own rows.
- The **service-role key** is used only in server-side code (`createAdminClient`) for the admin dashboard and Stripe webhook, and is never exposed to the browser.
- AI usage is metered per user against the plan limit before each OpenAI call.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # run production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```
