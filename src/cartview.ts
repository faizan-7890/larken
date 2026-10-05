import { productBySlug } from "./catalog";
import { cents, priceFor, quote } from "./pricing";
import type { CartLine, Tier } from "./types";

export function describeCart(cart: CartLine[], tier: Tier, promo: string | null, whiteGlove = false) {
  const lines = cart.flatMap((line) => {
    const product = productBySlug(line.slug);
    if (!product) return [];
    const finish = product.finishes.find((item) => item.id === line.finishId) ?? product.finishes[0];
    const unit = priceFor(product, tier);
    return [{ ...line, product, finish, unit, lineTotal: cents(unit * line.qty) }];
  });
  const totals = quote(
    lines.map((line) => ({ unit: line.unit, qty: line.qty, list: line.product.price })),
    promo,
    whiteGlove,
  );
  return {
    lines,
    ...totals,
    scheduleSavings: cents(totals.listValue - totals.merchandise),
  };
}
