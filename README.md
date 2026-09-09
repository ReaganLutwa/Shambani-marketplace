# ShambaNi Marketplace

ShambaNi is a Uganda-focused **pre-pilot prototype** for testing how farmers and institutional buyers could coordinate produce listings, orders and delivery records. The public site is a front-end demonstration built with React, TypeScript, Tailwind CSS and Vite.

## Current status

The following are **not live**: production registration, identity verification, ordering, payments, escrow, SMS delivery and USSD access. Product listings, people, reviews, dashboards and metrics are sample data. ShambaNi has not been allocated a USSD short code and does not claim regulatory approval or government endorsement.

The controlled-pilot proposal is documented in [`docs/GOVERNMENT-APPLICATION-CHECKLIST.md`](docs/GOVERNMENT-APPLICATION-CHECKLIST.md). Technical USSD dependencies are documented in [`docs/USSD-PILOT-ARCHITECTURE.md`](docs/USSD-PILOT-ARCHITECTURE.md).

## Safe prototype controls

- Registration screens do not collect passwords, identity documents, banking details or mobile-money details.
- Checkout is disabled until a controlled pilot and licensed payment-provider process exist.
- The USSD page is an interactive menu demonstration only.
- The operations dashboard is explicitly marked as sample data.
- Privacy and prototype terms describe the actual implementation state.

## Technology

- React 19 and TypeScript
- Vite and Tailwind CSS
- HashRouter for GitHub Pages
- i18next with English, Luganda, Kiswahili and Kinyarwanda copy
- GitHub Actions build and deployment

## Local development

```bash
npm ci
npm run dev
```

Verification:

```bash
npm run lint
npm run build
```

## Main routes

| Route | Purpose |
|---|---|
| `/#/` | Public prototype overview |
| `/#/browse` | Sample produce catalogue |
| `/#/farmer-register` | Paused-registration notice and pilot interest |
| `/#/buyer-register` | Paused-registration notice and pilot interest |
| `/#/ussd` | Proposed USSD menu simulator |
| `/#/operations` | Sample pilot controls and audit-trail demonstration |
| `/#/privacy` | Pre-pilot privacy notice |
| `/#/terms` | Prototype terms |

## Deployment

The GitHub Pages workflow uses the committed lockfile, runs linting and the full TypeScript/Vite build, then deploys the generated `dist` directory. In repository settings, select **GitHub Actions** as the Pages source.

## Before any live pilot

Do not activate registration, identity checks, payments or USSD until the documented legal, security, telecom, provider and operating gates have been completed and evidenced. Never place credentials, national IDs, passwords, PINs or private participant data in the frontend or repository.

Copyright 2026 ShambaNi. All rights reserved.
