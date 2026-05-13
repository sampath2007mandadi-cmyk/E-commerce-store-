# Northstar Market E-commerce Store

Northstar Market is a responsive, location-aware e-commerce storefront with a customer catalog, shopping cart, checkout flow, and administrative operations portal.

## Features

- Modern responsive UI with product discovery, search, category/brand filters, and price filtering.
- Local shopping cart with add, remove, and quantity update controls.
- Checkout flow that validates the customer's ZIP code against active service locations before accepting an order.
- Admin dashboard for sales, order, product, stock, and service-location visibility.
- Order management with search and status updates for pending, processing, shipped, delivered, and cancelled orders.
- Product management for adding, editing, and deleting catalog items.
- Location and service management for adding, pausing, and deleting serviceable ZIP codes.
- Google Identity Services integration path for Gmail/Google Workspace administrator sign-in.

## Technology stack

- A zero-dependency static frontend served by any HTTP server for local development and production builds.
- Vanilla JavaScript modules for application state and interactions.
- CSS custom properties and responsive grid layouts for the visual system.
- `localStorage` persistence for demo products, orders, cart contents, locations, and admin session state.

## Admin authentication

The admin portal is designed for Gmail/Google account sign-in through Google Identity Services.

1. Create an OAuth Web Client ID in Google Cloud Console.
2. Set `window.NORTHSTAR_CONFIG = { GOOGLE_CLIENT_ID: "your-client-id", ADMIN_EMAILS: "admin@gmail.com,ops@example.com" }` before `src/app.js` loads, or inject equivalent values during deployment.
3. Keep `ADMIN_EMAILS` to a comma-separated allowlist of approved administrator emails.
4. In production, verify Google ID tokens on a backend before granting administrative privileges. The frontend allowlist is useful for UX but should not be treated as the only security boundary.

If `GOOGLE_CLIENT_ID` is not configured, the project exposes a demo-only admin login using `admin@gmail.com` so reviewers can test the portal locally.

## Getting started

```bash
npm install
npm start
```

Open `http://localhost:4173`. The default storefront is available at `/`, and the admin portal is linked from the top navigation.

## Build

```bash
npm run build
```

The static production bundle is emitted to `dist/` and can be deployed to any static host.

## Deployment notes

- Configure `window.NORTHSTAR_CONFIG.GOOGLE_CLIENT_ID` and `window.NORTHSTAR_CONFIG.ADMIN_EMAILS` in the hosting environment before publishing.
- Add a backend service before production launch for order persistence, server-side token verification, payment gateway integration, and encrypted customer data storage.
- Connect a payment provider such as Stripe, Adyen, or PayPal before collecting real payments.
- Replace demo image URLs with owned or CDN-hosted assets for predictable performance.
