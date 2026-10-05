import { useState } from "react";
import { Link } from "react-router-dom";
import { productBySku } from "../catalog";
import { money, priceFor } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";

interface Parsed {
  raw: string;
  sku: string;
  qty: number;
  known: boolean;
}

function parse(text: string): Parsed[] {
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

export function QuickOrder() {
  useTitle("Quick order · Larken Contract");
  const { addToCart, tier } = useStore();
  const [text, setText] = useState("HL-LNG-01 2\nKL-TSK-01 8\nAR-LMP-01 2");
  const [rows, setRows] = useState<Parsed[] | null>(null);
  const [done, setDone] = useState(false);

  return (
    <div className="shell page narrow">
      <header className="page-head">
        <p className="kicker">Quick order</p>
        <h1>Paste the SKUs.</h1>
        <p className="lede">
          One line each. SKU, then quantity. Unknown codes stay on the list and are not added. Finishes default to the
          first one on the spec; change them on the product page if the floor cares.
        </p>
      </header>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = parse(text);
          setRows(parsed);
          setDone(false);
        }}
      >
        <label className="field">
          <span>SKUs</span>
          <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} rows={8} />
        </label>
        <button type="submit" className="btn">
          Read the list
        </button>
      </form>
      {rows ? (
        <div className="section">
          <table className="sheet">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Piece</th>
                <th>Qty</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const product = productBySku(row.sku);
                return (
                  <tr key={`${row.raw}-${index}`}>
                    <td>{row.sku}</td>
                    <td>{product ? product.name : "Not in the catalog"}</td>
                    <td>{row.qty}</td>
                    <td>{product ? money(priceFor(product, tier) * row.qty) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="hero-actions">
            <button
              type="button"
              className="btn"
              disabled={!rows.some((row) => row.known)}
              onClick={() => {
                for (const row of rows) {
                  const product = productBySku(row.sku);
                  if (product) addToCart(product.slug, product.finishes[0].id, row.qty);
                }
                setDone(true);
              }}
            >
              Add the known SKUs
            </button>
            {done ? (
              <Link className="btn ghost" to="/cart">
                Review the order
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
