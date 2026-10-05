export type Tier = "guest" | "trade" | "enterprise";

export type Category =
  | "Seating"
  | "Tables"
  | "Lighting"
  | "Storage"
  | "Textiles"
  | "Objects";

export interface Finish {
  id: string;
  name: string;
  swatch: string;
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  category: Category;
  collection: string;
  blurb: string;
  description: string;
  price: number;
  tradePrice: number;
  contractPrice: number;
  leadDays: number;
  stock: number | null;
  badge?: string;
  materials: string[];
  dimensions: string;
  weight: string;
  warranty: string;
  freight: string;
  origin: string;
  finishes: Finish[];
  related: string[];
}

export interface User {
  email: string;
  company: string;
  contact: string;
  short: string;
  tier: Tier;
  terms: string;
  costCenters: string[];
}

export interface CartLine {
  id: string;
  slug: string;
  finishId: string;
  qty: number;
}

export interface ProjectLine {
  slug: string;
  finishId: string;
  qty: number;
}

export interface Project {
  id: string;
  owner: string;
  name: string;
  site: string;
  notes: string;
  lines: ProjectLine[];
}

export type OrderStatus = "Confirmed" | "In production" | "Shipped";

export interface OrderLine {
  slug: string;
  name: string;
  sku: string;
  finish: string;
  qty: number;
  unit: number;
}

export interface ShipTo {
  site: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
}

export interface Order {
  id: string;
  placedAt: string;
  email: string;
  company: string;
  contact: string;
  tier: Tier;
  terms: string;
  po: string;
  costCenter: string;
  projectName: string;
  needBy: string;
  whiteGlove: boolean;
  ship: ShipTo;
  lines: OrderLine[];
  listValue: number;
  merchandise: number;
  discount: number;
  freight: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

export interface Ledger {
  cart: CartLine[];
  user: User | null;
  orders: Order[];
  projects: Project[];
  promo: string | null;
  recent: string[];
}

export type Tone =
  | "wood"
  | "walnut"
  | "cloth"
  | "metal"
  | "dark"
  | "leather"
  | "brass"
  | "wool"
  | "stone"
  | "rust";

export interface BoxShape {
  kind: "box";
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone: Tone;
  seams?: number;
  bands?: number;
}

export interface DrumShape {
  kind: "drum";
  x: number;
  y: number;
  z: number;
  r: number;
  h: number;
  tone: Tone;
}

export interface WireShape {
  kind: "wire";
  points: [number, number, number][];
  tone: Tone;
}

export type Shape = BoxShape | DrumShape | WireShape;
