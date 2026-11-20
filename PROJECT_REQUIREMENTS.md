# CommerceOS Storefront — Final Requirements & Architecture Decisions

Updated: 2026-11-20
Status: Product/architecture baseline approved for implementation; dependencies and features are not yet installed/implemented unless already present in the app.

This document is the persistent source of truth for Storefront work across sessions. Read it before implementing Storefront features. Follow the repository-level `AGENTS.md`, `PROJECT_CONTEXT.md`, `PROJECT_ARCHITECTURE.md` and `ROADMAP_NEXT.md` as well.

## 1. Product goal

Build a production-ready, customer-facing, multi-store e-commerce storefront for CommerceOS. It must support:

- Fast, responsive shopping on mobile, tablet and desktop.
- Search-engine discoverability and rich product results.
- Shareable product/category/campaign URLs with correct Facebook, Messenger and other social previews.
- Marketing/advertising measurement for Meta, Google and (later/optional) TikTok.
- Store-specific branding, SEO metadata, social metadata and analytics/ad configuration.
- Secure customer authentication, cart, wishlist, checkout and order/account workflows using the CommerceOS NestJS backend.
- Accessible Light, Dark and System themes.

The storefront is a separate customer application. Its theme and preferences must be independent from the Admin Dashboard.

## 2. Confirmed technology decisions

| Concern | Decision | Responsibility |
|---|---|---|
| Framework | Next.js App Router | Routing, Server Components, SSR, metadata, image optimization |
| Language | TypeScript | Strict typing |
| UI | shadcn/ui using the initialized project preset | Shared accessible UI components and design system |
| Styling | Tailwind CSS (current project setup) | Responsive styling and design tokens |
| Theme | next-themes (already in package dependencies) | Light / Dark / System theme preference |
| Server-side API | Native Fetch API in Next.js Server Components / server utilities | SEO-critical and server-rendered data |
| Client-side server state | TanStack Query | Client API cache, loading/error, refetch, mutations, pagination |
| Client-only global state | Zustand | UI state only: drawers, menus, dialogs and transient client interactions |
| Validation | Zod | Runtime validation and shared client form schemas where appropriate |
| Forms | React Hook Form + Zod | Complex customer-facing forms |
| SEO | Next.js Metadata API + JSON-LD | Metadata, canonical URLs and structured data |
| Analytics/ads | GTM/GA4 + Meta Pixel/CAPI + Google Ads conversions | Measurement and campaign attribution |

### API/state rules (important)

1. **Do not use Redux Toolkit or RTK Query in Storefront.** The selected client-side API stack is TanStack Query; the selected client-only state library is Zustand.
2. Native Fetch is the default for server-side fetching, especially homepage, category, product detail and other SEO-critical routes.
3. TanStack Query is for client-side server state and interactive API workflows. It is not a replacement for Server Components or a prerequisite for SEO.
4. Zustand is only for client-owned UI state. Do not duplicate backend-owned products, customer profile, cart contents, wishlist records or order data in Zustand as a second source of truth. Use TanStack Query/API cache for those records.
5. Cart and wishlist are backend-owned data. Mutations go to the NestJS API; invalidate/update the corresponding TanStack Query cache after successful mutations. Zustand may control whether a cart drawer or wishlist panel is open.
6. Use one shared typed API layer with separate server and browser-safe clients. The server API base URL must come from a server-only environment variable (for example `API_URL`); never expose private API credentials/tokens through `NEXT_PUBLIC_*`.
7. For authenticated requests, follow the backend's customer authentication/cookie contract. Never trust frontend state as authorization; backend remains authoritative.
8. Define caching deliberately. Do not accidentally share personalized, authenticated or tenant-specific responses across users/stores. Use no-store/dynamic fetching where required and only opt into shared caching for demonstrably public, correctly tenant-keyed data.
9. If server-fetched data must be reused by client queries, use the supported TanStack Query dehydration/hydration pattern with request-scoped server QueryClient; do not create a shared server QueryClient that can leak data between requests.
10. Handle API errors, empty states, loading/skeleton states, retries and offline/network failures consistently.

## 3. SEO requirements

Implement SEO at the route and entity level, not only one global title.

- Use Next.js `metadata` / `generateMetadata()` for unique title, description, canonical URL, robots directives and social metadata.
- Product pages: unique product title/description, canonical URL, indexable server-rendered content, product image and availability/price details where available.
- Category pages: unique category title/description, canonical URL and useful crawlable category content.
- Store-level metadata: store name, description, logo, default social image, locale and canonical origin.
- Open Graph metadata: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, image dimensions/alt text and site name.
- Twitter/X card metadata: summary-large-image and relevant title/description/image.
- Dynamic product Open Graph images where practical; provide a reliable store-level fallback image.
- JSON-LD structured data: Organization/OnlineStore, WebSite, BreadcrumbList and Product/Offer; include AggregateRating only when genuine supported rating data exists. Never fabricate reviews, prices, stock or ratings.
- Generate a correct `sitemap.ts` for public canonical store, category and product URLs. Exclude private, duplicate, filtered/query and non-canonical URLs.
- Generate `robots.ts`; keep private account, cart, checkout and internal utility routes out of search indexes as appropriate.
- Ensure product content and key metadata are present in initial server-rendered HTML; do not make SEO depend on client-only fetching.
- Support store-specific canonical domains and tenant-aware metadata. Never emit another store's URL or metadata.
- Use semantic HTML, accessible headings/links, descriptive image alt text and clean stable URLs.
- Verify metadata and JSON-LD with rendered HTML and structured-data testing tools before release.

## 4. Social sharing requirements

Every public shareable store/product/category/campaign page must generate a useful preview when pasted into Facebook, Messenger and other Open Graph consumers.

- Correct per-page Open Graph title, description, canonical URL and image.
- Product image should be high-quality, publicly reachable, absolute HTTPS URL, correctly sized and not blocked from crawler access.
- Use a fallback image if the product has no suitable image.
- Ensure crawler requests can retrieve the HTML metadata without customer login or client-side JavaScript execution.
- Keep social metadata tenant-aware and aligned with canonical URL.
- Add share actions only where useful; shared URLs must be stable and public.
- Revalidate previews after deployment using Meta Sharing Debugger and equivalent platform tools. Social platforms cache previews, so provide a documented re-scrape/debug procedure.

## 5. Analytics and advertising requirements

Build a provider-agnostic, consent-aware tracking layer. Store-specific IDs/configuration must be loaded for the active store only.

### Initial integrations
- Google Tag Manager (GTM) as the tag orchestration option.
- Google Analytics 4 (GA4) ecommerce events.
- Meta Pixel browser events.
- Meta Conversions API (CAPI) server-side events, integrated through a secure backend/server path.
- Google Ads conversion tracking.
- TikTok Pixel is an optional later integration; keep the event abstraction extensible.

### Ecommerce event model
Support a consistent event contract for:
- `PageView`
- `ViewContent` / product view
- `Search`
- `AddToCart`
- `RemoveFromCart`
- `ViewCart`
- `InitiateCheckout`
- `AddPaymentInfo`
- `Purchase`
- `AddToWishlist`

Requirements:
- Include correct store/currency/value/product identifiers and quantities where the platform requires them.
- Fire Purchase only after the backend confirms the order/payment outcome required by the business flow; never fire on a button click or an unverified return URL.
- Use a stable event ID for browser/server copies of the same Meta event so Meta can deduplicate Pixel and CAPI delivery.
- Avoid duplicate events on rerenders, refreshes, retries or repeated callbacks; make purchase tracking idempotent.
- CAPI access tokens and other provider secrets must remain server-side/backend-side and must never be exposed in browser bundles, HTML, logs or client-readable configuration.
- Tracking must be isolated per store/tenant. Do not load one store's pixel or send its events for another store.
- Add consent/privacy controls and respect the configured consent state before firing non-essential analytics/advertising tags. Do not assume consent.
- Provide a way to disable/configure each provider per store. Missing IDs or disabled providers must not break shopping.
- Document event mapping, test mode and validation steps for Meta Events Manager, GA4 DebugView and Google Ads diagnostics.

## 6. Multi-store configuration

Each store must have its own independently managed:
- Store identity, display name, logo, favicon, theme/design settings and public canonical domain.
- SEO defaults, social sharing defaults and fallback Open Graph image.
- Per-product/category SEO fields where supported by the backend data model.
- Analytics/advertising provider enablement and public measurement IDs.
- Secure server-side Meta CAPI and other private credentials, stored/used only in trusted backend/server infrastructure.
- Currency, locale and other storefront presentation settings as supported by the backend.

Resolve the active store from the trusted host/domain or the platform's established tenant-routing contract. Do not accept arbitrary client-supplied store IDs as authorization. Every API request and tracking event must be scoped to the resolved store.

## 7. UX, accessibility and quality

- **Light mode is the primary design target and default.** Build and polish every page, component, color token, surface, border, shadow, typography treatment and interaction state in Light mode first. The overall visual quality should feel clean, refined, premium and cohesive; avoid a generic or unfinished white UI.
- Dark mode is secondary: support it consistently using semantic design tokens, but do not let Dark mode drive visual decisions or compromise the Light-mode experience.
- Support Light, Dark and System theme modes. Light is the initial default unless the store has an explicit brand-level theme policy; System may follow the device preference only when the customer selects it.
- Persist the customer's explicit theme preference without causing a flash of the wrong theme. Storefront theme must not affect Admin theme.
- Responsive mobile-first layout, accessible keyboard interactions, focus states, contrast and screen-reader labels.
- Consistent loading, skeleton, error, empty and success states.
- Product listing filters/sort/search with shareable URL state where appropriate.
- Use Next.js image optimization and sensible image sizes/loading priorities.
- Avoid layout shifts; prioritize above-the-fold product/hero images and defer non-critical content.
- Cart, checkout and account flows must be secure, clear and usable on small screens.
- Do not place payment secrets or provider credentials in the browser. Payment initiation/verification must use the backend's supported workflow.

## 8. Suggested implementation structure

Adapt to the existing app structure; do not create a competing `src/` tree without a reason. Current project has root-level `app/`, `components/`, `hooks/` and `lib/`.

Suggested additions as the app grows:

```text
storefront/
├── app/
│   ├── (store)/
│   ├── (auth)/
│   ├── (account)/
│   ├── products/[slug]/
│   ├── categories/[slug]/
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/
│   └── storefront/
├── features/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── wishlist/
│   ├── search/
│   └── account/
├── hooks/
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── lib/
    ├── api/
    │   ├── server-api.ts
    │   ├── client-api.ts
    │   └── types.ts
    ├── seo/
    ├── analytics/
    └── tenant/
```

Use feature-local API functions, types, schemas and components when a feature becomes substantial. Keep shared infrastructure in `lib/` and app-wide providers in `providers/`.

## 9. Suggested implementation sequence

1. **Baseline and foundation:** inspect the current storefront app, package scripts, Next.js 16.4 docs installed in `node_modules/next/dist/docs/`, backend customer/auth/catalog/cart contracts, and current Git status. Preserve unrelated changes.
2. **Design system and providers:** finish shadcn preset setup, theme provider (Light/Dark/System), root layout, fonts, responsive shell and query provider.
3. **Tenant + API foundation:** resolve active store safely; implement typed server/browser API clients, customer auth/cookie handling, error normalization and deliberate caching.
4. **SEO/social foundation:** store-level metadata, canonical URL rules, Open Graph/Twitter, JSON-LD, sitemap and robots.
5. **Catalog:** homepage, category listing, search, filters, product details and server-rendered metadata.
6. **Shopping workflows:** cart, wishlist, customer auth/account, checkout and order confirmation using backend contracts.
7. **Marketing measurement:** consent layer, GTM/GA4, Meta Pixel/CAPI, Google Ads conversions and event deduplication.
8. **Hardening:** accessibility, responsive QA, performance, SEO/social crawler checks, tracking validation, unit/integration/E2E tests and production build.

Do not install every planned package or build all modules at once. Add dependencies when the relevant foundation/feature is implemented. Work one vertical slice at a time and report changed files plus actual verification.

## 10. Current verified starting point (2026-11-20)

- Storefront path: `Desktop/CommerceOS/storefront`.
- Next.js `16.4.5`, React `19.3.1`, TypeScript and Tailwind CSS are in `package.json`.
- App uses root-level `app/`, `components/`, `hooks/`, `lib/` (not a `src/` directory).
- shadcn `components.json` exists and records the selected preset: `radix-lyra`, RSC enabled, CSS variables enabled, Lucide icons.
- `next-themes` is already a dependency.
- `@tanstack/react-query`, `zustand`, `zod` and React Hook Form are not currently listed in the Storefront package manifest as of this check.
- Package scripts remain `next dev`, `next build`, `next start`, lint, format and typecheck. Do not hardcode ports in package scripts; use environment/runtime configuration when port configuration is implemented.
- The user ran `pnpm dlx shadcn@latest apply --preset b2p7qNZGi` before initialization and received the expected “No components.json” error. Subsequently `components.json` is present. Verify whether the preset was fully applied before making further shadcn changes.
- No dependency installation, source implementation, build or tests were performed as part of recording these requirements.
- Root Git status at the time of writing showed only the existing `storefront` gitlink modified. Preserve and inspect the app's own status before the first implementation; do not reset or overwrite user changes.

## 11. Protected Storefront files (read-only unless explicitly authorized)

The following files are user-protected. They may be read/inspected when necessary, but must never be edited, modified, overwritten, reformatted, renamed, moved or deleted by the assistant unless the user explicitly grants permission for the specific change:

- `package.json`
- `providers/theme-provider.tsx`
- `app/globals.css`

If a task requires changing any protected file, stop before making the change and explain why it is needed; ask the user for explicit permission. Continue with other safe work only when it does not require modifying these files.

## 12. Explicit non-goals / guardrails

- Do not use RTK Query or introduce Redux into Storefront unless the user explicitly changes this decision.
- Do not use Zustand as a replacement for API/server state.
- Do not make client-only fetching the sole source of SEO-critical product/category content.
- Do not expose Meta CAPI tokens, payment credentials or other secrets to the browser.
- Do not invent tracking IDs, product ratings, stock, prices or backend endpoints.
- Do not assume a backend endpoint exists: inspect the actual NestJS DTO/controller/service contract before integration.
- Do not implement a tracking provider by firing events on arbitrary UI clicks; use verified business outcomes.
- Do not commit or push unless explicitly instructed.
