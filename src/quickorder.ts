import { productBySku } from "./catalog";

export interface ParsedSku {
  raw: string;
  sku: string;
  qty: number;
  known: boolean;
}

export function parseQuickOrder(text: string): ParsedSku[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((raw) => {
      const parts = raw.split(/[\s,]+/).filter(Boolean);
      const sku = parts[0] ?? "";
      const qty = Math.min(99, Math.max(1, Number(parts[1] ?? "1") || 1));
      return { raw, sku, qty, known: Boolean(productBySku(sku)) };
    });
}
