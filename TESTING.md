# Testing plan

Larken Contract is a browser-only procurement desk. These checks prove the catalog, the three price schedules, the cart, and checkout. Nothing is charged, and no request should leave the browser.

Reset the desk before a manual case: clear site data for `http://127.0.0.1:5180`, or start from a private window. The ledger key is `larken.ledger.v1`.

## Run

```bash
npm test
npm run dev
```

Automated cases use Vitest and Testing Library against the shipped store, quote, and pages. Open [http://127.0.0.1:5180](http://127.0.0.1:5180) for the manual cases.

Sample desks:

| Desk | Email | Password | Schedule |
| --- | --- | --- | --- |
| Fieldwork Studio | studio@fieldwork.design | trade | Trade, net 30 |
| Northline Holdings | procurement@northline.com | enterprise | Contract, net 45, PO required |

`LARKEN10` is the only schedule code. It takes 10% off merchandise and does not change freight.

## Automated suite

`src/desk.test.tsx` already covers these. A failure here blocks a release.

| Area | Expect |
| --- | --- |
| Catalog | Every SKU has list, trade, and contract prices, at least one finish, and a drawing. More than one category exists. |
| Readme | Sample emails, passwords, and `LARKEN10` match the desks in `README.md`. |
| Quote | Guest, trade, and contract unit prices match the SKU schedule. A bad code discounts nothing. `LARKEN10` discounts merchandise only. Freight is $145 under $2,500 net, $0 at $2,500, and white-glove adds $280. A code that pulls net under $2,500 restores the $145. Tax is 7.25% of net merchandise. Total is net plus freight plus tax. |
| Cart | The same finish merges. A different finish stays a separate line. |
| Sign-in | A wrong password is refused. Fieldwork is trade, net 30. Northline is contract, net 45. |
| Projects | Lines copied from a project merge with the same finish already on the cart. |
| Place order | The stored order matches the quote. The cart and code clear. The card number is absent from the order and from `localStorage`. |
| Quick order | `HL-LNG-01 2` adds Hale in the default finish. An unknown SKU is skipped. A repeat merges. |
| Checkout | Enterprise with no purchase order does not place. With `PO-900` and a shaped card, the order matches the contract quote, including white-glove freight. |
| Routes | Home, catalog, Hale, cart, checkout, account, trade, projects, quick order, about, contact, and policies render. An empty checkout returns to the empty cart, not the missing page. |
| Product | Hale shows finishes and $2,480. Choosing Ink leather and adding it stores that finish at quantity 1. |

## Manual cases

Do these in the browser. Record the case id, the desk you used, and pass or fail.

### Catalog and search

| Id | Steps | Expect |
| --- | --- | --- |
| C1 | Open Catalog. | 12 SKUs. Hale shows $2,480 list. |
| C2 | Choose Seating, then Oak, then clear the filters. | The grid narrows, then returns to 12. |
| C3 | Choose Under $1,000. | Keel, Mare, Arc, Bridle, and Cinder remain. Sable does not. |
| C4 | Turn on quick ship. | Only pieces with a lead time of two weeks or less remain. Hale does not. |
| C5 | Sort by price, high. | Sable is first. |
| C6 | Search `HL-LNG` from the header, and also press `/` then Escape. | Suggestions show Hale. Enter opens the catalog query. Escape closes the list. |
| C7 | Open a missing URL, such as `/missing`. | The missing-page heading appears, with a link back to the catalog. |

### Price schedules

| Id | Steps | Expect |
| --- | --- | --- |
| P1 | As a guest, add Hale. | The line is $2,480. |
| P2 | Sign in as Fieldwork without clearing the cart. | Hale reprices to $2,108. Terms read net 30. |
| P3 | Sign out. | The same line returns to $2,480. |
| P4 | Sign in as Northline. | Hale is $1,984. Terms read net 45. Account lists the seeded orders and the Austin project. |
| P5 | On Trade, submit a new studio with any certificate number. | The account opens on the trade schedule. Catalog prices drop to trade. |

### Cart and quick order

| Id | Steps | Expect |
| --- | --- | --- |
| K1 | Add Hale twice from the catalog, then change the finish on the product page and add that too. | One line for the default finish, one line for the other. |
| K2 | Set a line to 0, and remove another. | A zero quantity deletes the line. Remove deletes the line. |
| K3 | Apply `NOPE`, then `LARKEN10`. | The bad code is refused. The good code shows 10% off merchandise. Freight is unchanged. |
| K4 | Raise the merchandise, after the code, to $2,500 or more. | Freight reads waived. |
| K5 | On Quick order, paste `KL-TSK-01 8` and `NOT-A-SKU 3`, read the list, and add the known SKUs. | Keel is added at 8. The unknown row is marked and not added. |
| K6 | On Hale, order more than the warehouse count of a quick-ship piece such as Quarry. | The cart warns that the balance is made to order. The line still stays. |

### Projects

| Id | Steps | Expect |
| --- | --- | --- |
| J1 | While signed out, open Projects. | The page asks for a trade or contract desk. |
| J2 | As Fieldwork, create "Floor 2" with a site and a note. Add Mare from the product page. | The project shows Mare. The cart is unchanged. |
| J3 | Bring the project into the order. | Mare is on the cart. The project still exists. |
| J4 | Delete the project. | It disappears from the list. The cart is unchanged. |

### Checkout

Use a shaped card such as `4242424242424242`, expiry `12/28`, and any three-digit CVC. Also try a too-short number and a bad expiry.

| Id | Steps | Expect |
| --- | --- | --- |
| O1 | Guest checkout with an empty company, a bad email, or an incomplete address. | Those fields are named. No order is created. |
| O2 | Guest checkout with a valid ship-to and a shaped card. Leave the PO blank. | The order is placed. Confirmation shows the id, ship-to, and total. The cart is empty. |
| O3 | Repeat O2 as Northline with no PO. | Placement is refused until a purchase order is entered. |
| O4 | Northline with a PO, a cost center, and white-glove checked. | The order shows the PO, white-glove delivery, and a total that includes $280. |
| O5 | After O2, search the page source and `localStorage` for the card number. | The number is not there. |
| O6 | Open the confirmation id, then open Account. | The order is listed. A made-up id says it is not on this desk. |

### Pages and layout

| Id | Steps | Expect |
| --- | --- | --- |
| U1 | Walk Home, About, Contact, and Policies. | Each page has its own heading. Contact with a blank note does not pretend to send. A filled note confirms it stayed in the browser. |
| U2 | Print the Hale spec. | Navigation and the add button are hidden. The spec table remains. |
| U3 | Narrow the window below 760px. | The menu opens and closes. Catalog, a product, and checkout are still usable. |
| U4 | Tab from the top of Home. | A skip link appears, and focus outlines are visible. |

## Out of scope

Payment capture, email, inventory changes on a server, and order status moving from Confirmed to Shipped. Those do not exist in this desk.

## Exit

Ship only when `npm test` passes and the manual cases above pass on a current `npm run dev` build. A failed schedule, merge, purchase-order, or card-storage check is a release blocker even if the page still renders.
