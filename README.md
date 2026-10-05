# Larken Contract

A fictional Grand Rapids showroom for specifying contract furniture. The site is a working procurement desk: catalog, three price schedules, project carts, quick order by SKU, and a checkout that never charges a card.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5180

## Sample desks

| Desk | Email | Password | Schedule |
| --- | --- | --- | --- |
| Fieldwork Studio | studio@fieldwork.design | trade | Trade, net 30, 15% under list |
| Northline Holdings | procurement@northline.com | enterprise | Contract, net 45, purchase order required |

Schedule code `LARKEN10` takes ten percent off merchandise. Sign in after filling a cart and the prices move with the account.

Orders, projects, and the cart stay in this browser (`localStorage`). Nothing is sent to a server.
