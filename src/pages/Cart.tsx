import { useState } from "react";
import { Link } from "react-router-dom";
import { describeCart } from "../cartview";
import { Plate } from "../components/Plate";
import { Totals } from "../components/ProductCard";
import { money, tierLabel } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";

export function Cart() {
  useTitle("Current order · Larken Contract");
  const { cart, tier, user, promo, setQty, removeLine, applyPromo, clearPromo } = useStore();
  const view = describeCart(cart, tier, promo, false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Current order</p>
        <h1>{cart.length === 0 ? "Nothing on the order." : "The order"}</h1>
        <p className="lede">
          {user
            ? `${user.company} is on the ${tierLabel(tier).toLowerCase()} schedule, ${user.terms}.`
            : "You are on the list schedule. A trade desk saves 15% before the code."}
        </p>
      </header>
      {cart.length === 0 ? (
        <div className="empty">
          <p>The catalog is the faster way in. Quick order if the SKUs are already in a spreadsheet.</p>
          <div className="hero-actions">
            <Link className="btn" to="/catalog">
              Browse the catalog
            </Link>
            <Link className="btn ghost" to="/quick-order">
              Quick order
            </Link>
          </div>
        </div>
      ) : (
        <div className="split">
          <div className="line-table">
            {view.lines.map((line) => (
              <article key={line.id} className="line">
                <Link to={`/product/${line.slug}`} className="line-plate">
                  <Plate slug={line.slug} />
                </Link>
                <div>
                  <p className="kicker">{line.product.sku}</p>
                  <h2>
                    <Link to={`/product/${line.slug}`}>{line.product.name}</Link>
                  </h2>
                  <p className="fine">{line.finish.name}</p>
                  {line.product.stock != null && line.qty > line.product.stock ? (
                    <p className="fine warn">Above the warehouse count. The balance is made to order.</p>
                  ) : null}
                </div>
                <div className="stepper">
                  <button type="button" onClick={() => setQty(line.id, line.qty - 1)} aria-label={`Decrease ${line.product.name}`}>
                    −
                  </button>
                  <input
                    aria-label={`Quantity of ${line.product.name}`}
                    inputMode="numeric"
                    value={line.qty}
                    onChange={(event) => {
                      const next = Number(event.target.value.replace(/[^\d]/g, ""));
                      if (Number.isFinite(next)) setQty(line.id, Math.min(99, next));
                    }}
                  />
                  <button type="button" onClick={() => setQty(line.id, Math.min(99, line.qty + 1))} aria-label={`Increase ${line.product.name}`}>
                    +
                  </button>
                </div>
                <p className="line-price">{money(line.lineTotal)}</p>
                <button type="button" className="text-btn" onClick={() => removeLine(line.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Summary</h2>
            <Totals
              merchandise={view.merchandise}
              scheduleSavings={view.scheduleSavings}
              discount={view.discount}
              freight={view.freight}
              tax={view.tax}
              total={view.total}
              tierName={tierLabel(tier)}
            />
            <p className="fine">Freight is waived at $2,500 net. White-glove is chosen at checkout. Tax is an estimate at 7.25%.</p>
            <form
              className="promo"
              onSubmit={(event) => {
                event.preventDefault();
                const message = applyPromo(code);
                setError(message);
                if (!message) setCode("");
              }}
            >
              <label>
                <span className="sr">Schedule code</span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder={promo ?? "Schedule code"}
                  aria-label="Schedule code"
                />
              </label>
              <button type="submit" className="btn ghost">
                Apply
              </button>
            </form>
            {error ? <p className="err">{error}</p> : null}
            {promo ? (
              <p className="fine">
                {promo} is on this order.{" "}
                <button type="button" className="text-btn" onClick={clearPromo}>
                  Remove code
                </button>
              </p>
            ) : (
              <p className="fine">Try LARKEN10 for ten percent off merchandise.</p>
            )}
            <Link className="btn full" to="/checkout">
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
