# Axiom Digital Core

Premium full-service digital agency website for small business owners — built to generate leads, showcase services, and run a conversion-optimized Growth Planner tool.

## Run & Operate

- `pnpm --filter @workspace/axiom run dev` — run the frontend (port 19461, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, preview at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter, shadcn/ui
- Typography: Playfair Display (headings) + Inter (body)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — DB schema (leads, testimonials, caseStudies, services)
- `artifacts/api-server/src/routes/` — Express route handlers (leads, planner, testimonials, caseStudies, services, stats)
- `artifacts/axiom/src/components/` — Frontend components (nav, hero, service-matrix, growth-planner, portfolio, testimonials, consultation-form)
- `artifacts/axiom/src/pages/home.tsx` — Single-page layout assembling all sections
- `artifacts/axiom/src/index.css` — Theme: deep charcoal background, electric gold primary, cyan secondary, violet accent

## Architecture decisions

- Single scrolling page with anchor-based navigation (no multi-page routing)
- Growth Planner is a fully state-driven multi-step wizard calling `/api/planner/estimate` for live ROI projections
- Case study portfolio cards have a "Visual Brand" / "Business Victory" toggle
- Testimonials use a continuous auto-scroll carousel (pauses on hover)
- All CSS variables set to dark luxury palette — no placeholder red values

## Product

- **Hero**: Full-screen with stats bar (clients served, revenue generated, hours automated, avg lead increase)
- **Service Matrix**: Triple-pillar cards (Infrastructure / Influx / Automation) with magnetic hover and expandable service details
- **Growth Planner**: 3-step wizard (Foundation → Traffic → Automation) generating a live investment estimate, timeline, deliverables, and ROI projection
- **Portfolio**: Filtered case studies with Visual Brand / Business Victory toggle and dramatic stat display
- **Testimonials**: Auto-scrolling carousel of client stories
- **Consultation Form**: Lead capture with form validation and a premium confirmation state

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Always run `pnpm run typecheck:libs` after adding new DB schema files (updates `.tsbuildinfo`)
- `@workspace/api-zod` types should NOT be imported in the frontend — use `@workspace/api-client-react` types instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
