# Larken Contract

A fictional Grand Rapids showroom for specifying contract furniture. The site is a working procurement desk — catalog, three price schedules, project carts, quick order by SKU, and a checkout that never charges a card.

Built with React 19, TypeScript, and Vite. No backend. Everything lives in `localStorage`.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:5180](http://127.0.0.1:5180)

### Build for Production

```bash
npm run build
npm run preview
```

---

## Features

### Catalog & Product Pages

- **12 products** across 6 categories — Seating, Tables, Lighting, Storage, Textiles, Objects
- Filter by category, material, and stock availability
- Sort by name or price
- Full-text search with typeahead (press `/` to focus)
- Product detail pages with spec tables, finish selectors, and related items

### Isometric Product Renders

Every product image is generated in code — no image assets. A custom isometric SVG renderer projects 3D primitives (boxes, drums, wire curves) with painter's-algorithm face sorting and tone-based shading. Product shapes are defined in `src/pieces.ts` and rendered by `src/iso.tsx`.

### Three Price Schedules

| Schedule | Discount | Terms |
| --- | --- | --- |
| List (guest) | — | Due at order |
| Trade | 15% under list | Net 30 |
| Contract | 20% under list | Net 45, PO required |

Prices update across the entire site when an account is signed in.

### Cart & Checkout

- Add from catalog cards, product pages, or by SKU via Quick Order
- Quantity steppers on every line
- Promo code support — enter `LARKEN10` for 10% off merchandise
- Freight waived at $2,500+; optional white-glove delivery (+$280)
- Tax estimated at 7.25%
- Full checkout form with buyer, ship-to, commercial terms, and a payment section that validates card shape but never stores or transmits anything

### Project Carts

- Create named projects with a site address and notes
- Park product lines onto a project without committing to an order
- Move an entire project onto the active cart when the purchase order clears

### Account & Orders

- Sign in with demo credentials to load seed data (orders, projects)
- Open a trade account with a company name and email
- View order history with status timeline (Confirmed → In production → Shipped)

---

## Demo Accounts

| Desk | Email | Password | Schedule |
| --- | --- | --- | --- |
| Fieldwork Studio | `studio@fieldwork.design` | `trade` | Trade, net 30, 15% under list |
| Northline Holdings | `procurement@northline.com` | `enterprise` | Contract, net 45, purchase order required |

Each account ships with pre-seeded orders and projects. Schedule code `LARKEN10` takes ten percent off merchandise. Sign in after filling a cart and the prices move with the account.

---

## Catalog

| SKU | Product | Category | List | Trade | Contract |
| --- | --- | --- | --- | --- | --- |
| HL-LNG-01 | Hale Lounge | Seating | $2,480 | $2,108 | $1,984 |
| KL-TSK-01 | Keel Task | Seating | $890 | $756 | $712 |
| MR-STL-01 | Mare Stool | Seating | $640 | $544 | $512 |
| FD-BNC-01 | Field Bench | Seating | $1,680 | $1,428 | $1,344 |
| SB-TBL-01 | Sable Table | Tables | $4,200 | $3,570 | $3,360 |
| LG-DSK-01 | Ledger Desk | Tables | $2,140 | $1,819 | $1,712 |
| AR-LMP-01 | Arc Lamp | Lighting | $980 | $833 | $784 |
| BR-PND-01 | Bridle Pendant | Lighting | $620 | $527 | $496 |
| LN-SDB-01 | Linden Sideboard | Storage | $3,180 | $2,703 | $2,544 |
| VS-SHF-01 | Vesper Shelf | Storage | $1,460 | $1,241 | $1,168 |
| QR-RUG-01 | Quarry Rug | Textiles | $1,890 | $1,606 | $1,512 |
| CN-VSL-01 | Cinder Vessel | Objects | $240 | $204 | $192 |

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript (strict) |
| Routing | React Router v7 |
| Build tool | Vite 7 |
| Styling | Vanilla CSS — single `styles.css` |
| State | React Context with `localStorage` persistence |
| Fonts | Fraunces (serif), Outfit (sans), IBM Plex Mono |
| Product images | Custom isometric SVG renderer |

No component library. No CSS framework. No state library. No backend.

---

## Project Structure

```
larken/
├── index.html                  # Entry HTML with font preloads and meta
├── vite.config.ts              # Dev server on port 5180
├── tsconfig.json               # Strict TypeScript config
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                # React root with BrowserRouter + StoreProvider
    ├── App.tsx                 # Route definitions (14 routes)
    ├── styles.css              # Full design system — tokens, layout, responsive
    ├── types.ts                # TypeScript types for every domain concept
    ├── catalog.ts              # Product data, demo accounts, seed orders/projects
    ├── pricing.ts              # Price engine, quoting, promo codes, formatting
    ├── store.tsx               # Global state context — cart, auth, orders, projects
    ├── cartview.ts             # Cart enrichment helper with totals
    ├── pieces.ts               # 3D shape definitions per product
    ├── iso.tsx                 # Isometric SVG renderer
    ├── title.ts                # Document title hook
    ├── components/
    │   ├── Layout.tsx          # Header, nav, footer, search, toast notifications
    │   ├── ProductCard.tsx     # Catalog card + Totals component
    │   ├── Plate.tsx           # Product image plate wrapper
    │   └── Field.tsx           # Form field wrapper
    └── pages/
        ├── Home.tsx            # Hero, category index, featured products, collections
        ├── Catalog.tsx         # Filterable, sortable product grid
        ├── Product.tsx         # Product detail — specs, finishes, add to cart/project
        ├── Cart.tsx            # Order review with line management and promo codes
        ├── Checkout.tsx        # 3-section form with validation and order placement
        ├── Order.tsx           # Order confirmation and detail
        ├── Account.tsx         # Sign in, account info, order history
        ├── Trade.tsx           # Trade account application and tier comparison
        ├── Projects.tsx        # Project list, create, detail, and move-to-cart
        ├── QuickOrder.tsx      # Add to cart by SKU lookup
        ├── About.tsx           # Brand story
        ├── Contact.tsx         # Showroom address and contact form
        ├── Policies.tsx        # Freight and warranty policies
        └── NotFound.tsx        # 404
```

---

## Design Notes

- **Typography** uses three font families with purpose — Fraunces for headings, Outfit for body, IBM Plex Mono for labels, SKUs, and metadata.
- **Color palette** is a warm paper-ink scheme (`#efeae2` / `#1c1916`) with a burnt accent (`#7a4e22`). A subtle SVG noise texture overlay adds grain.
- **Responsive** at three breakpoints (980px, 760px) with a mobile hamburger menu. Print stylesheet hides navigation and interactive elements.
- **Accessibility** includes a skip link, ARIA attributes on interactive elements, `prefers-reduced-motion` support, and semantic HTML throughout.
- **Keyboard shortcuts** — press `/` from anywhere to focus search, `Escape` to dismiss.

---

## Data & Persistence

All state is serialized to `localStorage` under the key `larken.ledger.v1`. This includes the cart, signed-in user, orders, projects, active promo code, and recently viewed products. Nothing is sent to a server. Clearing browser storage resets everything.

---

## License

A fictional showroom. Nothing on this desk is charged.
