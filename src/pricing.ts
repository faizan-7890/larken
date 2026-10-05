import type { Product, Tier } from "./types";

export const PROMO_CODE = "LARKEN10";
export const TAX_RATE = 0.0725;
export const FREIGHT_FLAT = 145;
export const FREIGHT_FREE_AT = 2500;
export const WHITE_GLOVE = 280;

export function cents(n: number) {
  return Math.round(n * 100) / 100;
}

export function money(n: number) {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(n);
}

export function longDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function priceFor(product: Product, tier: Tier) {
  if (tier === "enterprise") return product.contractPrice;
  if (tier === "trade") return product.tradePrice;
  return product.price;
}

export function tierLabel(tier: Tier) {
  if (tier === "enterprise") return "Contract";
  if (tier === "trade") return "Trade";
  return "List";
}

export function leadLabel(days: number) {
  if (days <= 7) return "Ships this week";
  const weeks = Math.max(1, Math.round(days / 7));
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}

export function quote(
  lines: { unit: number; qty: number; list: number }[],
  promo: string | null,
  whiteGlove: boolean,
) {
  const merchandise = cents(lines.reduce((n, line) => n + line.unit * line.qty, 0));
  const listValue = cents(lines.reduce((n, line) => n + line.list * line.qty, 0));
  const discount = promo === PROMO_CODE ? cents(merchandise * 0.1) : 0;
  const net = cents(merchandise - discount);
  const freight = cents((net >= FREIGHT_FREE_AT ? 0 : FREIGHT_FLAT) + (whiteGlove ? WHITE_GLOVE : 0));
  const tax = cents(net * TAX_RATE);
  const total = cents(net + freight + tax);
  return { merchandise, listValue, discount, freight, tax, total, net };
}
