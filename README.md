# Larken Contract

A fictional Grand Rapids showroom for specifying contract furniture. The site is a procurement desk: a catalog, three price schedules, project carts, quick order by SKU, and a checkout that never charges a card.

React 19, TypeScript, and Vite. No backend. The cart, account, projects, and orders stay in `localStorage` under `larken.ledger.v1`.

## Run

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:5180](http://127.0.0.1:5180).

```bash
npm test          # vitest
npm run build     # typecheck, then production build
npm run preview   # serve dist on the same port
```

## Desks

| Desk | Email | Password | Schedule |
| --- | --- | --- | --- |
| Fieldwork Studio | studio@fieldwork.design | trade | Trade, net 30 |
| Northline Holdings | procurement@northline.com | enterprise | Contract, net 45, purchase order required |

Trade is about 15% under list. Contract is about 20% under list. The prices are a schedule on each SKU, not a percentage applied at checkout. Signing in reprices the open cart.

`LARKEN10` takes 10% off merchandise only. It does not discount freight.

Opening a trade account on the Trade page applies the trade schedule immediately. Contract accounts are not self-serve; use the Northline desk to see purchase-order enforcement.

Each sample desk also loads earlier orders and a project cart. New orders are marked Confirmed. The samples include In production and Shipped. Status does not advance on its own.

## Buying

Freight is $145 and is waived when merchandise, after the schedule and any code, reaches $2,500. White-glove to the room adds $280. Tax is an estimate at 7.25% of that net merchandise.

Checkout asks for a card number, checks that it looks like one, and discards it. The number is not written into the order or into `localStorage`.

Quick order takes one SKU per line, then a quantity (`HL-LNG-01 2`). Unknown codes are skipped. The finish is the first one on the spec.

A project cart holds lines under a site name. "Bring into the order" copies them onto the cart and merges a matching finish.

Search sits in the header. Press `/` to focus it, and Escape to close the suggestions.

## Catalog

Twelve SKUs. Filter by category, material, price band, or quick ship (lead time of two weeks or less). Sort by the floor order, price, lead time, or name.

| SKU | Piece | Category | List | Trade | Contract |
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

Drawings are isometric shop drawings, not photographs. Shapes live in `src/pieces.ts` and are projected in `src/iso.tsx`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/catalog` | Catalog |
| `/product/:slug` | Product |
| `/cart` | Current order |
| `/checkout` | Checkout |
| `/orders/:id` | Confirmation |
| `/account` | Account |
| `/trade` | Trade desk |
| `/projects` | Project carts |
| `/projects/:id` | One project |
| `/quick-order` | Quick order |
| `/about` | Mill |
| `/contact` | Desk |
| `/policies` | Freight and warranty |

## Layout

```
src/
  main.tsx            root, router, store
  App.tsx             routes
  styles.css          the only stylesheet
  catalog.ts          products, sample desks, seed orders
  pricing.ts          schedules, promo, freight, tax
  cartview.ts         line prices and totals
  store.tsx           cart, account, orders, projects
  pieces.ts           drawing geometry
  iso.tsx             isometric renderer
  checkoutRules.ts    checkout validation
  quickorder.ts       SKU list parser
  desk.test.tsx       schedule, cart, and route tests
  pages/              one file per route
  components/         header, cards, plates, fields
```

Clear site data for this origin to reset the ledger. Larken Contract is fictional, and nothing on this desk is charged.
