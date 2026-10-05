import type { Category, Order, Product, Project, User } from "./types";
import { priceFor, quote } from "./pricing";

export const CATEGORIES: Category[] = [
  "Seating",
  "Tables",
  "Lighting",
  "Storage",
  "Textiles",
  "Objects",
];

export const CATEGORY_COPY: Record<Category, string> = {
  Seating: "Lounge, task, stool, and the bench that holds a lobby.",
  Tables: "Conference length, and the desk a person actually works at.",
  Lighting: "Brass, linen, and light that stays out of the way.",
  Storage: "Sideboards and shelves that take a floor without taking it over.",
  Textiles: "Wool underfoot, cut for the rooms we furnish.",
  Objects: "The last thing on the table. Still specified.",
};

export const PRODUCTS: Product[] = [
  {
    slug: "hale-lounge",
    sku: "HL-LNG-01",
    name: "Hale Lounge",
    category: "Seating",
    collection: "The Long Room",
    blurb: "Low lounge chair. White oak frame, oatmeal bouclé.",
    description:
      "A low lounge chair for the rooms where a meeting is supposed to feel less like a meeting. The frame is kiln-dried white oak from the Grand Rapids mill. The seat is eight-way hand tied, deep enough to stay in and low enough to see over.",
    price: 2480,
    tradePrice: 2108,
    contractPrice: 1984,
    leadDays: 28,
    stock: null,
    materials: ["Oak", "Bouclé"],
    dimensions: "32 W × 34 D × 31 H in · seat height 16 in",
    weight: "48 lb",
    warranty: "12-year frame. 2-year upholstery.",
    freight: "Blanket-wrapped. One chair per carton, tipped on the side.",
    origin: "Frame milled in Grand Rapids. Upholstered in-house.",
    finishes: [
      { id: "oatmeal", name: "Oatmeal bouclé", swatch: "#d8cbb8" },
      { id: "ink", name: "Ink leather", swatch: "#2a2c30" },
      { id: "rust", name: "Rust wool", swatch: "#8d4634" },
    ],
    related: ["field-bench", "arc-lamp", "cinder-vessel"],
  },
  {
    slug: "keel-task",
    sku: "KL-TSK-01",
    name: "Keel Task",
    category: "Seating",
    collection: "The Desk",
    blurb: "Task chair. Charcoal wool, aluminum base.",
    description:
      "The chair we sell when a floor is being counted in dozens. Charcoal wool over a molded shell, a polished aluminum column, and a tilt that does not need a diagram. Warehouse stock in Grand Rapids for the first thirty-six.",
    price: 890,
    tradePrice: 756,
    contractPrice: 712,
    leadDays: 10,
    stock: 36,
    badge: "Quick ship",
    materials: ["Aluminum", "Wool"],
    dimensions: "27 W × 27 D × 32–36 H in",
    weight: "31 lb",
    warranty: "12-year frame. 2-year upholstery and cylinder.",
    freight: "Cartoned. Stacks four high on a pallet.",
    origin: "Assembled in Grand Rapids.",
    finishes: [
      { id: "charcoal", name: "Charcoal wool", swatch: "#3a3d40" },
      { id: "fog", name: "Fog wool", swatch: "#c5c6c4" },
      { id: "black", name: "Black wool", swatch: "#1a1a1a" },
    ],
    related: ["ledger-desk", "bridle-pendant", "mare-stool"],
  },
  {
    slug: "mare-stool",
    sku: "MR-STL-01",
    name: "Mare Stool",
    category: "Seating",
    collection: "The Floor",
    blurb: "Counter stool. Turned oak, round seat.",
    description:
      "A counter stool for the pantry off a conference room, or the standing desk that lost the argument. Solid oak, a footrest you can actually find with a shoe, and a seat that is a circle because the room already has enough rectangles.",
    price: 640,
    tradePrice: 544,
    contractPrice: 512,
    leadDays: 7,
    stock: 18,
    badge: "Quick ship",
    materials: ["Oak"],
    dimensions: "15 dia × 26 H in",
    weight: "16 lb",
    warranty: "12-year frame.",
    freight: "Cartoned in pairs.",
    origin: "Grand Rapids mill.",
    finishes: [
      { id: "oak", name: "White oak", swatch: "#c6a36e" },
      { id: "ebonized", name: "Ebonized oak", swatch: "#2c2722" },
    ],
    related: ["keel-task", "sable-table", "linden-sideboard"],
  },
  {
    slug: "field-bench",
    sku: "FD-BNC-01",
    name: "Field Bench",
    category: "Seating",
    collection: "The Long Room",
    blurb: "Six-foot bench. Cognac leather, oak legs.",
    description:
      "The piece that goes under the window when a lobby has more waiting than chairs. Six feet of cognac leather on an oak underframe. It also works at the end of a conference table when the twelfth person was not on the plan.",
    price: 1680,
    tradePrice: 1428,
    contractPrice: 1344,
    leadDays: 21,
    stock: null,
    materials: ["Oak", "Leather"],
    dimensions: "72 W × 22 D × 18 H in",
    weight: "54 lb",
    warranty: "12-year frame. 2-year leather.",
    freight: "Blanket-wrapped. Ships on its back.",
    origin: "Grand Rapids.",
    finishes: [
      { id: "cognac", name: "Cognac leather", swatch: "#8a5a32" },
      { id: "black", name: "Black leather", swatch: "#242424" },
      { id: "oatmeal", name: "Oatmeal bouclé", swatch: "#d8cbb8" },
    ],
    related: ["hale-lounge", "quarry-rug", "linden-sideboard"],
  },
  {
    slug: "sable-table",
    sku: "SB-TBL-01",
    name: "Sable Table",
    category: "Tables",
    collection: "The Floor",
    blurb: "Ten-foot conference table. White oak, bronze legs.",
    description:
      "A ten-foot table for the room that has to hold both the board and the laptops. White oak top, three inches of overhang, legs in a dark bronze that does not try to match the chairs. Power is a separate specification. We do not hide it in the leg.",
    price: 4200,
    tradePrice: 3570,
    contractPrice: 3360,
    leadDays: 35,
    stock: null,
    materials: ["Oak", "Bronze"],
    dimensions: "120 W × 48 D × 29.5 H in",
    weight: "210 lb",
    warranty: "12-year frame and top.",
    freight: "Crated. Dock or white-glove. Two people minimum at receiving.",
    origin: "Top and base made in Grand Rapids.",
    finishes: [
      { id: "oak", name: "White oak", swatch: "#d7c09a" },
      { id: "smoked", name: "Smoked oak", swatch: "#7a6248" },
    ],
    related: ["keel-task", "linden-sideboard", "vesper-shelf"],
  },
  {
    slug: "ledger-desk",
    sku: "LG-DSK-01",
    name: "Ledger Desk",
    category: "Tables",
    collection: "The Desk",
    blurb: "Writing desk. Walnut top, three-drawer pedestal.",
    description:
      "A desk for one person, not a benching system. Walnut top, a pedestal of three drawers on the left, and an open side so a chair can actually pull in. Cable grommet is optional and ugly, so it is not standard.",
    price: 2140,
    tradePrice: 1819,
    contractPrice: 1712,
    leadDays: 21,
    stock: 4,
    materials: ["Walnut"],
    dimensions: "60 W × 28 D × 29.5 H in",
    weight: "96 lb",
    warranty: "12-year frame. 5-year drawer slides.",
    freight: "Blanket-wrapped with the pedestal off.",
    origin: "Grand Rapids mill.",
    finishes: [
      { id: "walnut", name: "Walnut", swatch: "#6b4a32" },
      { id: "ebonized", name: "Ebonized walnut", swatch: "#2a241f" },
    ],
    related: ["keel-task", "bridle-pendant", "vesper-shelf"],
  },
  {
    slug: "arc-lamp",
    sku: "AR-LMP-01",
    name: "Arc Lamp",
    category: "Lighting",
    collection: "The Long Room",
    blurb: "Floor lamp. Unlacquered brass, linen shade.",
    description:
      "An arc lamp that reaches a Hale without standing in the conversation. Unlacquered brass, which will darken where hands find it, and a linen shade lined so the bulb is a glow and not a point. Dimmer is in the stem.",
    price: 980,
    tradePrice: 833,
    contractPrice: 784,
    leadDays: 14,
    stock: 11,
    materials: ["Brass", "Linen"],
    dimensions: "18 W × 42 D × 62 H in",
    weight: "28 lb",
    warranty: "5-year electrical. 2-year finish.",
    freight: "Shade cartoned separately. Base in a crate.",
    origin: "Assembled in Grand Rapids. Shade sewn in North Carolina.",
    finishes: [
      { id: "brass", name: "Unlacquered brass", swatch: "#c6a15a" },
      { id: "blackened", name: "Blackened brass", swatch: "#3a342c" },
    ],
    related: ["hale-lounge", "bridle-pendant", "cinder-vessel"],
  },
  {
    slug: "bridle-pendant",
    sku: "BR-PND-01",
    name: "Bridle Pendant",
    category: "Lighting",
    collection: "The Desk",
    blurb: "Drum pendant. Linen shade, brass canopy.",
    description:
      "A drum pendant for over a Ledger or down the center of a Sable. Linen, a brass canopy, and a cloth cord. Drop is specified at order, from 24 to 72 inches. The price does not change with the drop.",
    price: 620,
    tradePrice: 527,
    contractPrice: 496,
    leadDays: 10,
    stock: 22,
    materials: ["Brass", "Linen"],
    dimensions: "18 dia × 12 H in · drop 24–72 in",
    weight: "9 lb",
    warranty: "5-year electrical. 2-year shade.",
    freight: "Cartoned. Hang-straight hardware included.",
    origin: "Shade sewn in North Carolina. Canopy turned in Grand Rapids.",
    finishes: [
      { id: "linen", name: "Natural linen", swatch: "#e6dcc8" },
      { id: "ink", name: "Ink linen", swatch: "#2c3140" },
    ],
    related: ["arc-lamp", "ledger-desk", "vesper-shelf"],
  },
  {
    slug: "linden-sideboard",
    sku: "LN-SDB-01",
    name: "Linden Sideboard",
    category: "Storage",
    collection: "The Floor",
    blurb: "Sideboard. White oak, two sliding doors.",
    description:
      "A sideboard for the wall behind a Sable, where the pitch books and the spare glassware have to live. White oak, two doors on a recessed pull, one adjustable shelf. The top overhang is there so a lamp cord can drop behind it.",
    price: 3180,
    tradePrice: 2703,
    contractPrice: 2544,
    leadDays: 28,
    stock: null,
    materials: ["Oak"],
    dimensions: "78 W × 20 D × 28 H in",
    weight: "142 lb",
    warranty: "12-year case. 5-year slides.",
    freight: "Crated. White-glove recommended above a second floor.",
    origin: "Grand Rapids mill.",
    finishes: [
      { id: "oak", name: "White oak", swatch: "#d2b48a" },
      { id: "walnut", name: "Walnut", swatch: "#6e4d34" },
    ],
    related: ["vesper-shelf", "sable-table", "field-bench"],
  },
  {
    slug: "vesper-shelf",
    sku: "VS-SHF-01",
    name: "Vesper Shelf",
    category: "Storage",
    collection: "The Desk",
    blurb: "Open shelf. Walnut, three bays.",
    description:
      "An open shelf for the books a closed cabinet would flatten. Walnut uprights, three bays, and a back that is deliberately missing so the wall stays the wall. Anchor hardware is in the carton. Use it.",
    price: 1460,
    tradePrice: 1241,
    contractPrice: 1168,
    leadDays: 21,
    stock: 6,
    materials: ["Walnut"],
    dimensions: "42 W × 16 D × 76 H in",
    weight: "78 lb",
    warranty: "12-year case.",
    freight: "Flat-packed uprights, shelves blanket-wrapped.",
    origin: "Grand Rapids mill.",
    finishes: [
      { id: "walnut", name: "Walnut", swatch: "#6b4630" },
      { id: "oak", name: "White oak", swatch: "#d2b48a" },
    ],
    related: ["linden-sideboard", "ledger-desk", "cinder-vessel"],
  },
  {
    slug: "quarry-rug",
    sku: "QR-RUG-01",
    name: "Quarry Rug",
    category: "Textiles",
    collection: "The Long Room",
    blurb: "Wool rug, 8 by 10. Stone ground, rust band.",
    description:
      "A wool rug sized for the Long Room, not a living room. Stone ground, one rust band, and a flat weave that a chair can roll up to and not sink into. Three remain on the floor. The next weaving is fourteen weeks.",
    price: 1890,
    tradePrice: 1606,
    contractPrice: 1512,
    leadDays: 7,
    stock: 3,
    badge: "Limited",
    materials: ["Wool"],
    dimensions: "8 × 10 ft",
    weight: "38 lb",
    warranty: "2 years against manufacturing defect. Wool color will shift in sun.",
    freight: "Rolled in a tube. Not folded.",
    origin: "Woven in North Carolina.",
    finishes: [
      { id: "stone", name: "Stone and rust", swatch: "#cfc6be" },
      { id: "ink", name: "Ink and stone", swatch: "#2e3238" },
    ],
    related: ["hale-lounge", "field-bench", "cinder-vessel"],
  },
  {
    slug: "cinder-vessel",
    sku: "CN-VSL-01",
    name: "Cinder Vessel",
    category: "Objects",
    collection: "The Long Room",
    blurb: "Stoneware vessel. Ash glaze, thrown in pairs.",
    description:
      "The object we put on a Sable when the room is otherwise finished and still looks like a specification. Stoneware, ash glaze, thrown in Grand Rapids in pairs that are siblings rather than copies. Crazing is part of the firing.",
    price: 240,
    tradePrice: 204,
    contractPrice: 192,
    leadDays: 7,
    stock: 14,
    badge: "Quick ship",
    materials: ["Stoneware"],
    dimensions: "11 dia × 13 H in",
    weight: "8 lb",
    warranty: "1 year against cracks beyond the crazing from the kiln.",
    freight: "Packed in a double carton. No stacking.",
    origin: "Thrown in Grand Rapids.",
    finishes: [
      { id: "ash", name: "Ash glaze", swatch: "#c8c2b8" },
      { id: "iron", name: "Iron glaze", swatch: "#5c5854" },
    ],
    related: ["hale-lounge", "arc-lamp", "quarry-rug"],
  },
];

export const MATERIALS = [...new Set(PRODUCTS.flatMap((product) => product.materials))].sort();

export function productBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function productBySku(sku: string) {
  const key = sku.trim().toUpperCase();
  return PRODUCTS.find((product) => product.sku.toUpperCase() === key);
}

export interface DemoAccount {
  email: string;
  password: string;
  company: string;
  contact: string;
  short: string;
  tier: User["tier"];
  terms: string;
  costCenters: string[];
}

export const ACCOUNTS: DemoAccount[] = [
  {
    email: "studio@fieldwork.design",
    password: "trade",
    company: "Fieldwork Studio",
    contact: "Amelia Cho",
    short: "Fieldwork",
    tier: "trade",
    terms: "Net 30",
    costCenters: [],
  },
  {
    email: "procurement@northline.com",
    password: "enterprise",
    company: "Northline Holdings",
    contact: "Jordan Hale",
    short: "Northline",
    tier: "enterprise",
    terms: "Net 45",
    costCenters: ["HQ-14", "AUS-02", "NYC-07"],
  },
];

function line(slug: string, finishId: string, qty: number, tier: User["tier"]) {
  const product = productBySlug(slug);
  if (!product) throw new Error(slug);
  const finish = product.finishes.find((item) => item.id === finishId) ?? product.finishes[0];
  return {
    slug,
    name: product.name,
    sku: product.sku,
    finish: finish.name,
    qty,
    unit: priceFor(product, tier),
    list: product.price,
    finishId: finish.id,
  };
}

function makeOrder(
  partial: Omit<Order, "lines" | "listValue" | "merchandise" | "discount" | "freight" | "tax" | "total"> & {
    spec: { slug: string; finishId: string; qty: number }[];
  },
): Order {
  const built = partial.spec.map((item) => line(item.slug, item.finishId, item.qty, partial.tier));
  const totals = quote(
    built.map((item) => ({ unit: item.unit, qty: item.qty, list: item.list })),
    null,
    partial.whiteGlove,
  );
  return {
    ...partial,
    lines: built.map((item) => ({
      slug: item.slug,
      name: item.name,
      sku: item.sku,
      finish: item.finish,
      qty: item.qty,
      unit: item.unit,
    })),
    ...totals,
  };
}

export function seedOrders(account: DemoAccount): Order[] {
  if (account.tier === "enterprise") {
    return [
      makeOrder({
        id: "LK-10421",
        placedAt: "2026-08-12T15:10:00.000Z",
        email: account.email,
        company: account.company,
        contact: account.contact,
        tier: account.tier,
        terms: account.terms,
        po: "PO-88421",
        costCenter: "AUS-02",
        projectName: "Austin HQ · Floor 4",
        needBy: "2026-09-02",
        whiteGlove: true,
        status: "Shipped",
        ship: {
          site: "Austin HQ",
          line1: "300 Colorado Street",
          line2: "Floor 4 loading",
          city: "Austin",
          region: "TX",
          postal: "78701",
        },
        spec: [
          { slug: "keel-task", finishId: "charcoal", qty: 12 },
          { slug: "sable-table", finishId: "oak", qty: 2 },
        ],
      }),
      makeOrder({
        id: "LK-10388",
        placedAt: "2026-09-02T14:04:00.000Z",
        email: account.email,
        company: account.company,
        contact: account.contact,
        tier: account.tier,
        terms: account.terms,
        po: "PO-89002",
        costCenter: "NYC-07",
        projectName: "New York reception",
        needBy: "2026-10-20",
        whiteGlove: false,
        status: "In production",
        ship: {
          site: "New York reception",
          line1: "11 Howard Street",
          line2: "",
          city: "New York",
          region: "NY",
          postal: "10013",
        },
        spec: [
          { slug: "hale-lounge", finishId: "oatmeal", qty: 4 },
          { slug: "arc-lamp", finishId: "brass", qty: 2 },
        ],
      }),
    ];
  }
  return [
    makeOrder({
      id: "LK-10354",
      placedAt: "2026-09-20T17:40:00.000Z",
      email: account.email,
      company: account.company,
      contact: account.contact,
      tier: account.tier,
      terms: account.terms,
      po: "FW-221",
      costCenter: "",
      projectName: "Harbor studio library",
      needBy: "2026-10-18",
      whiteGlove: false,
      status: "Confirmed",
      ship: {
        site: "Fieldwork studio",
        line1: "90 Union Street",
        line2: "Studio 2",
        city: "Portland",
        region: "ME",
        postal: "04101",
      },
      spec: [{ slug: "linden-sideboard", finishId: "oak", qty: 1 }],
    }),
  ];
}

export function seedProjects(account: DemoAccount): Project[] {
  if (account.tier === "enterprise") {
    return [
      {
        id: "PR-AUS4",
        owner: account.email,
        name: "Austin HQ · Floor 4",
        site: "300 Colorado Street, Austin",
        notes: "Waiting on the landlord for the loading dock. Do not ship the rug early.",
        lines: [
          { slug: "hale-lounge", finishId: "oatmeal", qty: 6 },
          { slug: "field-bench", finishId: "cognac", qty: 2 },
          { slug: "arc-lamp", finishId: "brass", qty: 4 },
          { slug: "quarry-rug", finishId: "stone", qty: 2 },
        ],
      },
    ];
  }
  return [
    {
      id: "PR-HARBOR",
      owner: account.email,
      name: "Harbor studio library",
      site: "90 Union Street, Portland",
      notes: "Stools at the pin-up rail. Shelf against the north wall.",
      lines: [
        { slug: "mare-stool", finishId: "oak", qty: 4 },
        { slug: "vesper-shelf", finishId: "walnut", qty: 1 },
        { slug: "bridle-pendant", finishId: "linen", qty: 2 },
      ],
    },
  ];
}
