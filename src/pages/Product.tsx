import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productBySlug } from "../catalog";
import { Plate } from "../components/Plate";
import { ProductCard } from "../components/ProductCard";
import { Piece } from "../iso";
import { leadLabel, money, priceFor, tierLabel } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";
import { NotFound } from "./NotFound";

export function ProductPage() {
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  const { addToCart, tier, user, projects, addToProject, remember } = useStore();
  const [finishId, setFinishId] = useState(product?.finishes[0].id ?? "");
  const [qty, setQty] = useState(1);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (!product) return;
    setFinishId(product.finishes[0].id);
    setQty(1);
    remember(product.slug);
  }, [product, remember]);

  useTitle(product ? `${product.name} · Larken Contract` : "Not in the catalog · Larken Contract");
  if (!product) return <NotFound />;

  const finish = product.finishes.find((item) => item.id === finishId) ?? product.finishes[0];
  const mine = projects.filter((project) => project.owner === user?.email);
  const price = priceFor(product, tier);
  const related = product.related.map((item) => productBySlug(item)).filter((item) => item != null);

  return (
    <div className="shell page">
      <p className="crumbs">
        <Link to="/catalog">Catalog</Link>
        <span>/</span>
        <Link to={`/catalog?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>/</span>
        {product.name}
      </p>
      <div className="pdp">
        <div className="gallery">
          <Plate slug={product.slug} sku={product.sku} badge={product.badge} />
          <div className="shop-drawing">
            <Piece slug={product.slug} ivory />
            <p>Shop drawing. Proportions of this SKU, not a shared scale.</p>
          </div>
        </div>
        <div className="buy">
          <p className="kicker">
            {product.collection} · {product.sku}
          </p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>
          <p className="price price-lg">
            <strong>{money(price)}</strong>
            {tier !== "guest" ? <s>{money(product.price)} list</s> : null}
            <span>{tierLabel(tier)}</span>
          </p>
          <p className="fine">
            {product.stock == null
              ? `Made to order. ${leadLabel(product.leadDays)} from confirmation.`
              : `${product.stock} in the Grand Rapids warehouse. ${leadLabel(product.leadDays)}.`}
            {product.stock != null && qty > product.stock
              ? " Quantity above the warehouse count is made to order and adds about two weeks."
              : ""}
          </p>

          <fieldset className="finish">
            <legend>Finish · {finish.name}</legend>
            <div className="swatches" role="radiogroup" aria-label="Finish">
              {product.finishes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={item.id === finish.id}
                  aria-label={item.name}
                  className="swatch"
                  style={{ background: item.swatch }}
                  onClick={() => setFinishId(item.id)}
                />
              ))}
            </div>
            <p className="fine">Finish is specified. It does not change the schedule price.</p>
          </fieldset>

          <div className="buy-row">
            <div className="stepper" aria-label="Quantity">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                −
              </button>
              <input
                aria-label="Quantity"
                inputMode="numeric"
                value={qty}
                onChange={(event) => {
                  const next = Number(event.target.value.replace(/[^\d]/g, ""));
                  if (Number.isFinite(next)) setQty(Math.min(99, Math.max(1, next || 1)));
                }}
              />
              <button type="button" onClick={() => setQty((value) => Math.min(99, value + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button type="button" className="btn" onClick={() => addToCart(product.slug, finish.id, qty)}>
              Add to order
            </button>
          </div>

          <div className="project-add">
            {user ? (
              mine.length > 0 ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!projectId) return;
                    addToProject(projectId, product.slug, finish.id, qty);
                  }}
                >
                  <label>
                    <span className="sr">Project</span>
                    <select value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
                      <option value="">Park on a project…</option>
                      {mine.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="btn ghost">
                    Add to project
                  </button>
                </form>
              ) : (
                <p className="fine">
                  No project carts yet. <Link to="/projects">Open one</Link> before the purchase order exists.
                </p>
              )
            ) : (
              <p className="fine">
                Project carts belong to a trade or contract desk. <Link to="/account">Sign in</Link> or{" "}
                <Link to="/trade">open trade</Link>.
              </p>
            )}
          </div>

          <table className="spec">
            <tbody>
              <tr>
                <th>SKU</th>
                <td>{product.sku}</td>
              </tr>
              <tr>
                <th>Dimensions</th>
                <td>{product.dimensions}</td>
              </tr>
              <tr>
                <th>Weight</th>
                <td>{product.weight}</td>
              </tr>
              <tr>
                <th>Materials</th>
                <td>{product.materials.join(", ")}</td>
              </tr>
              <tr>
                <th>Origin</th>
                <td>{product.origin}</td>
              </tr>
              <tr>
                <th>Freight</th>
                <td>{product.freight}</td>
              </tr>
              <tr>
                <th>Warranty</th>
                <td>{product.warranty}</td>
              </tr>
            </tbody>
          </table>
          <button type="button" className="text-btn no-print" onClick={() => window.print()}>
            Print this spec
          </button>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="section">
          <div className="section-head">
            <h2>Specified alongside</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
