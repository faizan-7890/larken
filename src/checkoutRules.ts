import type { Tier } from "./types";

export interface CheckoutFields {
  email: string;
  company: string;
  contact: string;
  po: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  cardName: string;
  card: string;
  exp: string;
  cvc: string;
}

/** Shape-check the desk form. Card fields are validated and then dropped by the caller. */
export function checkoutErrors(form: CheckoutFields, tier: Tier) {
  const next: Record<string, string> = {};
  if (!form.company.trim()) next.company = "Name the company receiving the goods.";
  if (!form.contact.trim()) next.contact = "Name the person who will sign for them.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "The desk needs a real email shape.";
  if (!form.line1.trim() || !form.city.trim() || !form.region.trim() || !form.postal.trim()) {
    next.ship = "Ship-to needs a street, city, state, and postal code.";
  }
  if (tier === "enterprise" && !form.po.trim()) next.po = "Contract orders need a purchase order.";
  const digits = form.card.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) next.card = "Enter a card number. It is checked for shape and discarded.";
  if (!/^\d{2}\s*\/\s*\d{2}$/.test(form.exp.trim())) next.exp = "Use MM/YY.";
  if (!/^\d{3,4}$/.test(form.cvc.trim())) next.cvc = "CVC is three or four digits. It is not stored.";
  if (!form.cardName.trim()) next.cardName = "Name the card.";
  return next;
}
