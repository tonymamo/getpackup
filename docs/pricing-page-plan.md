# Pricing Page Implementation Plan

Goal: ship a standalone `/pricing` page on the marketing site (getpackup.com) so the Freemium model from [packupapp#84](https://github.com/getpackup/packupapp/issues/84) can go live, without waiting for the full marketing site rewrite. This plan is intentionally scoped small — reuse existing components/patterns in this repo (Gatsby 2, styled-components, `@components` alias) rather than introducing anything new.

Context this plan depends on (already shipped in `packupapp`):
- `plan: 'free' | 'pro'` field on the User document, source of truth for gating.
- `PlanGate` component and in-app "Upgrade to Pro" links in `Sidebar.tsx` and `settings.tsx`, both of which link to `https://getpackup.com/pricing?uid=<uid>` — that URL contract is fixed and this page must honor it.
- `resource.stripe-webhook.tsx` — already writes `plan: 'pro'` / `'free'` based on Stripe events, keyed off `client_reference_id` (checkout) or `customer.metadata.uid` (subscription updates/deletes).
- `functions/src/email-to-uid.ts` → exported as `lookupUidByEmail` (`functions/src/index.ts`), an `onRequest` Cloud Function already CORS-allowlisted for `https://getpackup.com` and `https://www.getpackup.com`. Rate-limited (5 req/min per IP), returns `{ uid }` on match or a deliberately vague 404 on no match (anti-enumeration).

## 0. Prerequisite (packupapp repo, not this repo) — must land first

`app/routes/resource.create-checkout-session.tsx` is still the unmodified Stripe sample scaffold. It has two gaps that will silently break the whole flow if not fixed before this page ships:

1. It never reads a `uid` from the form body and never sets `client_reference_id` (or customer metadata) on the Stripe session. Without this, the webhook's `session.client_reference_id` read is always empty and `checkout.session.completed` skips the plan write — **the user pays and never gets upgraded.**
2. `success_url` is hardcoded to `${origin}/test?success=true...` — a placeholder from before the real Settings return flow (`isCheckoutReturn` in `app/routes/settings.tsx`) existed.

Required fix in that file:
- Accept `uid` in `CreateCheckoutSessionBody`, require it (400 if missing, same as `lookup_key`).
- Pass `client_reference_id: uid` into `stripe.checkout.sessions.create(...)`.
- Set `success_url` to `${APP_URL}/settings?checkout=success` (reuses the existing "Processing upgrade" loading state already built in `settings.tsx`).
- Set `cancel_url` to `https://getpackup.com/pricing` (currently unset — Stripe falls back to browser back button, which is fine but explicit is better and lets someone land back on this page if they abandon checkout).

This is a small, mechanical, low-risk change (~10 lines) in `packupapp`, but it's the hard dependency between the two repos — track it as its own PR/commit there before wiring up this page's checkout form.

## 1. Manual setup (Stripe dashboard) — not code

- Create a Product: **"Packup Pro"**.
- Create one recurring monthly Price on it. Amount is **TBD** — will be under $5 USD/month, exact figure to be filled in later by the user. Use a placeholder in code/copy until finalized.
- Set the Price's `lookup_key` to `pro_monthly` — `create-checkout-session.tsx` looks up prices by `lookup_key`, not a hardcoded price ID, so this must match exactly what the pricing page form sends.
- No annual price for this version (see Out of Scope).

## 2. New environment variables (this repo)

Add to `.env.sample` and Netlify env config (mirroring the existing `GATSBY_SITE_URL` per-context pattern in `netlify.toml`):

- `GATSBY_APP_URL` — `https://app.getpackup.com` (checkout form POST target + "sign up in the app" link).
- `GATSBY_LOOKUP_UID_FUNCTION_URL` — the deployed Cloud Function trigger URL for `lookupUidByEmail`. No Firebase Hosting rewrite exists for a clean path, so this will be the raw Cloud Functions/Cloud Run URL — grab it from the Firebase console (Functions tab) after packupapp's `functions` are deployed, and confirm it responds to CORS from `getpackup.com` (it's already allowlisted in `functions/src/index.ts`).
- `GATSBY_STRIPE_PRICE_LOOKUP_KEY` — `pro_monthly`.

## 3. New page: `src/pages/pricing/index.tsx`

Follow the `src/pages/support/index.tsx` pattern exactly — a plain, self-contained `.tsx` page (not a CMS/markdown template like `contact.md`/`about.md`, since this page needs client-side state and a form submit). Use `Seo`, `PageContainer`, `Heading`, `Box`, `Row`/`Column`, `Button`, `HorizontalRule` from `@components`, and `styled-components` for the comparison table, matching the existing color/spacing tokens (`@styles/color`, `@styles/size`).

### 3a. Comparison table content

Two columns, **Free** and **Pro**, rows driven directly by the confirmed split in packupapp's `CONTEXT.md`:

| Feature | Free | Pro |
|---|---|---|
| Trips | Unlimited | Unlimited |
| Trip Members per trip | Up to 3 (owner + 2) | Unlimited |
| Gear Closet (master inventory + custom items) | ✓ | ✓ |
| Add from Gear Closet | ✓ | ✓ |
| Shopping List | ✓ | ✓ |
| Weather | ✓ | ✓ |
| Friends | ✓ | ✓ |
| Safety Itinerary & Emergency Contacts | ✓ | ✓ |
| Trip Chat (send messages) | Read-only | ✓ |
| Custom Tags (create new) | — | ✓ |

Below the table, a third visual state for **not-yet-built Pro features**, styled grayed-out with a "Coming Soon" badge (small pill, muted color) rather than a checkmark or dash — per user preference to signal the roadmap without implying they're purchasable now:
- Trip Templates
- Weight Tracking (with charts)
- Print/Export packing list

### 3b. Price display

Single Pro price row/card: `$X.XX/mo` where `X.XX` is a literal placeholder token (e.g. a constant `PRICE_PLACEHOLDER = '—'` or `'X.XX'` clearly commented as TBD) — swap for the real number once finalized in the Stripe dashboard step above.

## 4. CTA + UID resolution flow

This is the only real interactive logic on the page. Behavior, per your decisions:

1. Page loads. Parse `uid` from the query string (`window.location.search` or Reach Router's `useLocation`, consistent with how other components in this repo already read location, e.g. see `@reach/router` usage in `Layout.tsx`).
2. Render one CTA button: **"Upgrade to Pro"**.
3. **If `uid` is present in the URL** (app-originated path): clicking the CTA submits the checkout form immediately with the known `uid` — no email step is ever shown.
4. **If `uid` is absent** (direct navigation to getpackup.com/pricing): clicking the CTA does *not* navigate anywhere yet. Instead it reveals an inline email input + "Continue" button in place of (or beside) the CTA.
5. Submitting the email input calls `fetch(GATSBY_LOOKUP_UID_FUNCTION_URL, { method: 'POST', body: JSON.stringify({ email }) })`.
   - **200 with `{ uid }`**: immediately submit the checkout form using that resolved `uid` (auto-submit, no extra click).
   - **404**: show the function's own message inline, styled as a neutral/muted notice (not a red error) — `"If an account exists, you will receive further instructions."` Do not reveal whether the email matched. Below it, a secondary line: `"Don't have an account yet? "` + a link to `${GATSBY_APP_URL}/signup` (confirm exact signup path in packupapp's `app/routes.ts` before wiring — likely `/signup` or `/`).
   - **429** (rate-limited): show a generic "Please try again in a moment" message — same neutral tone, no technical detail.
6. Keep the email step collapsed/hidden by default on every page load — it only ever appears after the CTA click when `uid` is missing, per your requirement.

## 5. Checkout submission mechanics

Use a plain HTML `<form method="post" action={`${GATSBY_APP_URL}/resource/create-checkout-session`}>` with hidden inputs for `lookup_key` (`GATSBY_STRIPE_PRICE_LOOKUP_KEY`) and `uid` (resolved value). This is a real top-level form navigation, not a `fetch` — so it works cross-origin without any CORS setup (browsers don't apply CORS to top-level navigations), and the existing `redirect(session.url, { status: 303 })` in `create-checkout-session.tsx` carries the browser straight to Stripe Checkout. Submit it via `formRef.current?.requestSubmit()` (or a real hidden submit) once the `uid` is known, whether that's on immediate CTA click (URL case) or after the async email lookup resolves (fallback case).

## 6. Navigation

Add a `Pricing` link to both:
- `src/components/Navbar.tsx` — alongside the existing `/blog`, `/about`, `/contact` links (~line 190-210).
- `src/components/Footer.tsx` — alongside the existing `/privacy`, `/terms`, `/support` links (~line 100-162).

Include the same `trackEvent(...)` analytics call pattern already used on other nav links in both files, for consistency with existing click tracking.

## 7. Testing

Follow this repo's existing Jest + RTL conventions (see `jest.config.js`, `setup-test-env.js`). Cover, at minimum:
- Renders the Free/Pro comparison table with all rows, and the three "Coming Soon" rows visually distinct.
- CTA click with `?uid=` present in URL submits the checkout form directly (mock `requestSubmit`/form action) without showing the email input.
- CTA click with no `uid` in URL reveals the email input instead of navigating.
- Email submit → mocked `lookupUidByEmail` 200 response → checkout form auto-submits with the resolved `uid`.
- Email submit → mocked 404 response → shows the vague neutral message + signup link, does not submit checkout.
- Email submit → mocked 429 response → shows generic retry message.

## Out of scope for this version (defer to later / full rewrite)

- Annual billing / multiple price tiers or a monthly-annual toggle.
- Any in-app (native wrapper) checkout — checkout is external-browser-only, per the PRD, to avoid Apple/Google IAP rules.
- schema.org `Product`/`Offer` structured data for SEO.
- Redesigning the rest of the marketing site — this page should look consistent with the current site, not the future rewrite.
- Final price copy — ships with a placeholder until the actual number is set.

## Suggested build order

1. Land the `create-checkout-session.tsx` fix in packupapp (Section 0) — blocks everything downstream.
2. Create the Stripe Product/Price + `lookup_key` (Section 1).
3. Add env vars + deploy/confirm the Cloud Function URL (Section 2).
4. Build the static comparison table content first (Section 3) — no logic, easy to review/demo.
5. Wire up the CTA/email/checkout interaction (Sections 4-5).
6. Add nav links (Section 6).
7. Tests (Section 7).
