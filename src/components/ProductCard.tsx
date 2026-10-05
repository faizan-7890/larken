import { Link } from "react-router-dom";
import { leadLabel, money, priceFor, tierLabel } from "../pricing";
import { useStore } from "../store";
import type { Product } from "../types";
import { Plate } from "./Plate";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, tier } = useStore();
  const price = priceFor(product, tier);
  return (
    <article className="card">
      <Link to={`/product/${product.slug}`} className="card-media">
        <Plate slug={product.slug} sku={product.sku} badge={product.badge} />
      </Link>
      <div className="card-body">
        <p className="kicker">
          {product.category}
          <span className="dot"> · </span>
          {leadLabel(product.leadDays)}
        </p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="blurb">{product.blurb}</p>
        <div className="card-row">
          <p className="price">
            <strong>{money(price)}</strong>
            {tier !== "guest" ? <s>{money(product.price)}</s> : null}
            <span>{tierLabel(tier)}</span>
          </p>
          <button
            type="button"
            className="text-btn"
            onClick={() => addToCart(product.slug, product.finishes[0].id, 1)}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export function Totals({
  merchandise,
  scheduleSavings,
  discount,
  freight,
  tax,
  total,
  tierName,
  freightNote,
}: {
  merchandise: number;
  scheduleSavings: number;
  discount: number;
  freight: number;
  tax: number;
  total: number;
  tierName: string;
  freightNote?: string;
}) {
  return (
    <dl className="totals">
      <div>
        <dt>{tierName}</dt>
        <dd>{money(merchandise)}</dd>
      </div>
      {scheduleSavings > 0 ? (
        <div>
          <dt>Against list</dt>
          <dd>−{money(scheduleSavings)}</dd>
        </div>
      ) : null}
      {discount > 0 ? (
        <div>
          <dt>LARKEN10</dt>
          <dd>−{money(discount)}</dd>
        </div>
      ) : null}
      <div>
        <dt>{freightNote ?? "Freight"}</dt>
        <dd>{freight === 0 ? "Waived" : money(freight)}</dd>
      </div>
      <div>
        <dt>Tax, est.</dt>
        <dd>{money(tax)}</dd>
      </div>
      <div className="grand">
        <dt>Total</dt>
        <dd>{money(total)}</dd>
      </div>
    </dl>
  );
}
