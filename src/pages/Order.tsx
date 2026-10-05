import { Link, useParams } from "react-router-dom";
import { money, longDate, tierLabel } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";

export function OrderPage() {
  const { id = "" } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === id);
  useTitle(order ? `${order.id} · Larken Contract` : "Order · Larken Contract");

  if (!order) {
    return (
      <div className="shell page">
        <header className="page-head">
          <p className="kicker">Order</p>
          <h1>That confirmation is not on this desk.</h1>
          <p className="lede">Orders live in this browser. A different browser, or a cleared ledger, will not have it.</p>
        </header>
        <Link className="btn" to="/account">
          Back to the account
        </Link>
      </div>
    );
  }

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">{order.status}</p>
        <h1>{order.id} is on the desk.</h1>
        <p className="lede">
          Placed {longDate(order.placedAt)} for {order.company}. {tierLabel(order.tier)} schedule, {order.terms}. A
          spec packet would normally leave with this confirmation. Here, it stays on the page.
        </p>
      </header>
      <div className="split">
        <div>
          <table className="sheet">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Piece</th>
                <th>Finish</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line) => (
                <tr key={`${line.sku}-${line.finish}`}>
                  <td>{line.sku}</td>
                  <td>
                    <Link to={`/product/${line.slug}`}>{line.name}</Link>
                  </td>
                  <td>{line.finish}</td>
                  <td>{line.qty}</td>
                  <td>{money(line.unit * line.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="summary">
          <h2>Ship-to</h2>
          <address>
            {order.ship.site}
            <br />
            {order.contact}
            <br />
            {order.ship.line1}
            {order.ship.line2 ? (
              <>
                <br />
                {order.ship.line2}
              </>
            ) : null}
            <br />
            {order.ship.city}, {order.ship.region} {order.ship.postal}
          </address>
          <dl className="totals">
            {order.po ? (
              <div>
                <dt>PO</dt>
                <dd>{order.po}</dd>
              </div>
            ) : null}
            {order.costCenter ? (
              <div>
                <dt>Cost center</dt>
                <dd>{order.costCenter}</dd>
              </div>
            ) : null}
            {order.projectName ? (
              <div>
                <dt>Project</dt>
                <dd>{order.projectName}</dd>
              </div>
            ) : null}
            {order.needBy ? (
              <div>
                <dt>Need by</dt>
                <dd>{order.needBy}</dd>
              </div>
            ) : null}
            <div>
              <dt>Delivery</dt>
              <dd>{order.whiteGlove ? "White glove" : "Dock"}</dd>
            </div>
            <div className="grand">
              <dt>Total</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
          <div className="hero-actions">
            <Link className="btn" to="/catalog">
              Continue specifying
            </Link>
            <Link className="btn ghost" to="/account">
              All orders
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
