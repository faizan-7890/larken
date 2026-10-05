# Larken Contract — Instructions

Improvement plan, known issues, and enhancement roadmap for the Larken Contract project.

---

## Table of Contents

- [Bugs & Fixes](#bugs--fixes)
- [Architecture Improvements](#architecture-improvements)
- [UX & Design Updates](#ux--design-updates)
- [Performance Optimizations](#performance-optimizations)
- [Accessibility Fixes](#accessibility-fixes)
- [Testing Plan](#testing-plan)
- [Feature Enhancements](#feature-enhancements)
- [Enhancement Roadmap](#enhancement-roadmap)

---

## Bugs & Fixes

### Critical

| # | Issue | File | Details |
|---|---|---|---|
| 1 | **No error boundaries** | `App.tsx` | If `productBySlug()` returns `undefined` and a component dereferences it without a guard, the entire app white-screens. Wrap route content in a React `ErrorBoundary` component. |
| 2 | **Stale ref in `placeOrder`** | `store.tsx` | `placeOrder` uses a `let created` variable mutated inside `commit()`. If React batches or defers the state update, `created` could theoretically remain `null`. Replace with a return value from `commit()` or use `useRef`. |
| 3 | **Cart ID collisions** | `store.tsx` | Cart line IDs are `slug::finishId`. If a product is added with the same slug and finish from different entry points simultaneously, quantities can merge unexpectedly. Not a real-world issue at current scale, but the ID scheme is fragile. |

### Minor

| # | Issue | File | Details |
|---|---|---|---|
| 4 | **Search results don't close on outside click** | `Layout.tsx` | The typeahead suggest panel only closes on route change or `Escape`. Clicking outside the panel should dismiss it. Add a click-outside listener. |
| 5 | **No loading state on checkout submit** | `Checkout.tsx` | The "Place order" button has no disabled/loading state after click. In a real app this invites double-submission. Add a `submitting` state. |
| 6 | **Promo code is case-sensitive in display** | `ProductCard.tsx` | The totals display hardcodes `LARKEN10` as the label (line 77), but the input comparison in `store.tsx` normalizes to uppercase. Minor inconsistency. |
| 7 | **`localStorage` quota not handled** | `store.tsx` | `localStorage.setItem()` can throw `QuotaExceededError` if storage is full. Wrap in try/catch. |

---

## Architecture Improvements

### 1. Split the Store Context

**Problem:** The entire app re-renders on any state change because `StoreProvider` puts everything — cart, user, orders, projects, promo, recent, and all 16 methods — into a single context value. Even though `useMemo` is used, `ledger` is in the dependency array, so any field change invalidates the memo.

**Solution:** Split into focused contexts:

```
CartContext      → cart, addToCart, setQty, removeLine, clearCart, count
AuthContext      → user, tier, signIn, signOut, openTrade
OrderContext     → orders, placeOrder
ProjectContext   → projects, createProject, addToProject, removeProject, projectToCart
PromoContext     → promo, applyPromo, clearPromo
```

Or migrate to **Zustand** or **Jotai** for granular subscriptions without the boilerplate.

### 2. Add Code Splitting

**Problem:** All 14 pages are eagerly imported in `App.tsx`. The initial bundle includes every page even though a user typically visits 2–3 per session.

**Solution:**

```tsx
const Catalog = lazy(() => import("./pages/Catalog"));
const Product = lazy(() => import("./pages/Product"));
// ... wrap routes in <Suspense fallback={<PageSkeleton />}>
```

### 3. Extract Data Layer

**Problem:** `catalog.ts` is 550 lines mixing product data, account data, seed data factories, and lookup functions. It's doing too many things.

**Solution:** Split into:

- `data/products.ts` — product array and lookup functions
- `data/accounts.ts` — demo accounts
- `data/seeds.ts` — seed order and project factories
- `data/categories.ts` — category list and copy

### 4. CSS Architecture

**Problem:** `styles.css` is a single 721-line file with no scoping. Class names are managed by convention, which doesn't scale.

**Options:**

- **CSS Modules** — rename to `*.module.css` per component for local scoping
- **CSS Layers** — use `@layer` to organize reset, tokens, layout, components, pages, utilities
- **Keep monolith but organize** — add clear section comments and a table of contents at the top

### 5. Add localStorage Migration

**Problem:** The storage key is `larken.ledger.v1`, implying versioning was planned, but there's no migration logic. If the `Ledger` type changes, old data silently breaks.

**Solution:**

```tsx
function migrate(raw: unknown): Ledger {
  const data = raw as Record<string, unknown>;
  const version = data?.version ?? 1;
  if (version === 1) {
    // transform v1 → v2
  }
  return data as Ledger;
}
```

---

## UX & Design Updates

### Navigation

| # | Update | Priority |
|---|---|---|
| 1 | Add **breadcrumbs** on all inner pages (currently only on Product page) | Medium |
| 2 | Add **active indicator** on mobile nav items | Medium |
| 3 | **Sticky "Add to cart" bar** on product page when scrolled past the buy section | Low |
| 4 | Add **back to top** button on long pages (Catalog, Home) | Low |

### Product Pages

| # | Update | Priority |
|---|---|---|
| 5 | Show **finish name** below the selected swatch, not just as a tooltip | High |
| 6 | Add **image zoom** or larger view toggle on the isometric render | Medium |
| 7 | Show **stock count** ("3 remaining") on limited items | Medium |
| 8 | Add **"Add to project" dropdown** directly on catalog cards, not just the PDP | Low |

### Cart & Checkout

| # | Update | Priority |
|---|---|---|
| 9 | Add **empty cart illustration** instead of just text | Medium |
| 10 | Show **estimated delivery date** per line item based on lead days | Medium |
| 11 | Add **order summary accordion** on mobile checkout | Medium |
| 12 | Add **"Save for later"** functionality to move items out of cart temporarily | Low |

### General

| # | Update | Priority |
|---|---|---|
| 13 | Add **page transitions / route animations** using React Router or Framer Motion | Low |
| 14 | Add **dark mode toggle** (the design system already has dark tones) | Low |
| 15 | Add a **favicon that reflects cart count** or a notification dot | Low |

---

## Performance Optimizations

| # | Optimization | Impact | Effort |
|---|---|---|---|
| 1 | **Lazy load pages** with `React.lazy()` + `Suspense` | High | Low |
| 2 | **Memoize product lookups** — `productBySlug` does a linear scan every call. Build a `Map<string, Product>` once. | Medium | Low |
| 3 | **Debounce search input** — typeahead re-filters on every keystroke against all products | Low | Low |
| 4 | **Virtualize product grid** — not needed at 12 products, but would matter at 100+ | Low | Medium |
| 5 | **Preload fonts** — add `<link rel="preload">` for the three Google Fonts to avoid FOUT | Medium | Low |
| 6 | **Self-host fonts** — eliminate the Google Fonts round-trip entirely | Medium | Medium |
| 7 | **Split CSS** — extract critical/above-the-fold CSS for faster first paint | Low | High |

---

## Accessibility Fixes

| # | Issue | Fix |
|---|---|---|
| 1 | **Search suggest panel** uses `role="listbox"` but options are `<Link>` without `role="option"` | Add `role="option"` to each suggestion link |
| 2 | **No arrow key navigation** in search suggestions | Implement `onKeyDown` handler for `ArrowUp`, `ArrowDown`, `Enter` |
| 3 | **Swatch buttons** use `aria-checked` but are `<button>`, not `role="radio"` | Wrap swatches in a `role="radiogroup"` and add `role="radio"` to each swatch |
| 4 | **Toast notification** appears but isn't announced loudly enough | Consider `role="alert"` instead of `role="status"` for add-to-cart feedback |
| 5 | **Form validation errors** are not linked to inputs | Add `aria-describedby` on inputs pointing to their error message `id` |
| 6 | **Stepper buttons** (`+` / `−`) have no accessible labels | Add `aria-label="Increase quantity"` / `aria-label="Decrease quantity"` |
| 7 | **Missing `<h1>` on some pages** | Audit all pages to ensure a single `<h1>` exists on each |

---

## Testing Plan

### Unit Tests (Priority: High)

Set up **Vitest** (pairs naturally with Vite) and test pure logic:

| Module | What to test |
|---|---|
| `pricing.ts` | `priceFor()` returns correct tier prices; `quote()` computes merchandise, discount, freight, tax, total correctly; promo code applies 10%; freight waived above $2,500; white-glove adds $280 |
| `cartview.ts` | `describeCart()` enriches lines with product data and computes `scheduleSavings` |
| `catalog.ts` | `productBySlug()` and `productBySku()` return correct products; `seedOrders()` and `seedProjects()` produce valid shaped data |
| `title.ts` | `useTitle()` sets `document.title` |

### Integration Tests (Priority: Medium)

Use **React Testing Library** to test component behavior:

| Component | What to test |
|---|---|
| `StoreProvider` | `addToCart` adds a line; `signIn` with valid/invalid credentials; `placeOrder` clears cart and creates order; `applyPromo` with valid/invalid code |
| `ProductCard` | Renders name, price, category; "Add" button fires `addToCart` |
| `Checkout` | Form validation shows errors for empty fields; successful submit navigates to order page |
| `Layout` | Search input filters products; nav links render; cart count updates |

### E2E Tests (Priority: Low)

Use **Playwright** for critical user journeys:

1. **Browse → Add → Checkout** — visit catalog, add a product, proceed to checkout, place order, verify confirmation
2. **Sign in → Price change** — add item as guest, sign in as trade, verify price drops 15%
3. **Project workflow** — sign in, create project, add items, move to cart
4. **Promo code** — add items, apply `LARKEN10`, verify 10% discount in totals

---

## Feature Enhancements

### Tier 1 — High Value, Low Effort

| # | Feature | Description |
|---|---|---|
| 1 | **Wishlist / Favorites** | Heart icon on cards to save products. Persist in `localStorage`. Show on Account page. |
| 2 | **Order PDF export** | "Download PDF" on order confirmation page using `window.print()` with the existing print stylesheet. |
| 3 | **Compare products** | Select 2–3 products and see specs side by side in a table. |
| 4 | **Recently viewed carousel** | Already tracked in state (`recent`). Show on Home page as a horizontal scroll. Currently shows as a grid — enhance to a proper carousel. |

### Tier 2 — Medium Value, Medium Effort

| # | Feature | Description |
|---|---|---|
| 5 | **Product image gallery** | Multiple isometric views per product — front, side, top-down. Rotate through angles. |
| 6 | **Quantity discounts** | Volume breaks at 6, 12, 24+ units. Show "buy 12, save 5%" badge. |
| 7 | **Multi-address shipping** | Split an order across multiple ship-to addresses (common in contract furniture). |
| 8 | **Email order confirmation** | Integrate with a service like EmailJS or Resend to send a formatted receipt (optional, requires external service). |
| 9 | **Inventory tracking** | Decrement `stock` on order placement. Show "Out of stock" badge when depleted. Currently stock is display-only. |

### Tier 3 — High Value, High Effort

| # | Feature | Description |
|---|---|---|
| 10 | **3D product configurator** | Interactive Three.js or React Three Fiber viewer. Rotate, zoom, change finishes live. Replace or complement the isometric SVG. |
| 11 | **Backend API** | Express or Next.js API routes for real persistence, user auth, and order management. PostgreSQL or SQLite. |
| 12 | **Admin dashboard** | Manage products, view orders, update statuses, export reports. |
| 13 | **Multi-tenant** | Support multiple showrooms/brands with shared infrastructure. |

---

## Enhancement Roadmap

### Phase 1 — Foundation (Week 1–2)

> Fix bugs, add tests, improve architecture.

- [ ] Add React Error Boundary to `App.tsx`
- [ ] Wrap `localStorage.setItem()` in try/catch
- [ ] Add click-outside handler to search suggestions
- [ ] Set up Vitest and write unit tests for `pricing.ts` and `cartview.ts`
- [ ] Build a `Map` for product lookups instead of linear `.find()`
- [ ] Add `React.lazy()` code splitting for all page components
- [ ] Add loading/disabled state to checkout submit button

### Phase 2 — UX Polish (Week 3–4)

> Improve the shopping experience.

- [ ] Fix accessibility issues (ARIA roles on search, swatches, form errors)
- [ ] Add stepper button labels
- [ ] Add finish name display below selected swatch on PDP
- [ ] Add stock count badge on limited items
- [ ] Add estimated delivery dates on cart lines
- [ ] Add breadcrumbs to all inner pages
- [ ] Add order PDF export via print stylesheet
- [ ] Debounce search input

### Phase 3 — Features (Week 5–6)

> Add new capabilities.

- [ ] Implement wishlist / favorites with localStorage persistence
- [ ] Add product compare (2–3 products side by side)
- [ ] Add "Save for later" on cart
- [ ] Upgrade recently viewed to a horizontal carousel
- [ ] Add quantity discount tiers and badges
- [ ] Split `catalog.ts` into focused data modules
- [ ] Organize CSS with `@layer` or CSS Modules

### Phase 4 — Advanced (Week 7+)

> Platform-level improvements.

- [ ] Add Playwright E2E tests for critical user journeys
- [ ] Evaluate Three.js product configurator as an alternative to isometric SVG
- [ ] Consider backend API for real persistence
- [ ] Self-host fonts and optimize loading
- [ ] Add page transition animations
- [ ] Add dark mode toggle
- [ ] Investigate SSR/SSG with Next.js or Vite SSR for SEO

---

## File Checklist

Files that need changes, grouped by priority:

### Must Touch

- `src/App.tsx` — add Error Boundary, lazy imports
- `src/store.tsx` — localStorage error handling, consider context splitting
- `src/components/Layout.tsx` — search click-outside, ARIA fixes
- `src/pages/Checkout.tsx` — submit button loading state
- `src/pages/Product.tsx` — finish name display, stock count

### Should Touch

- `src/catalog.ts` — split into focused modules
- `src/pricing.ts` — add unit tests
- `src/cartview.ts` — add unit tests
- `src/styles.css` — organize with sections or layers
- `src/components/ProductCard.tsx` — wishlist button, stepper labels

### Nice to Touch

- `src/iso.tsx` — multiple viewing angles
- `src/pieces.ts` — additional shape variants per product
- `src/pages/Home.tsx` — recently viewed carousel upgrade
- `src/pages/Cart.tsx` — save for later, delivery estimates
- `src/pages/Account.tsx` — wishlist display, order tracking
