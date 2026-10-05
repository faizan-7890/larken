import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, MATERIALS, PRODUCTS } from "../catalog";
import { ProductCard } from "../components/ProductCard";
import { priceFor } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";
import type { Product } from "../types";

const SORTS = [
  { id: "featured", label: "As specified" },
  { id: "price-asc", label: "Price, low" },
  { id: "price-desc", label: "Price, high" },
  { id: "lead", label: "Lead time" },
  { id: "name", label: "Name" },
] as const;

function bandOf(price: number) {
  if (price < 1000) return "under";
  if (price <= 2500) return "mid";
  return "over";
}

export function Catalog() {
  useTitle("Catalog · Larken Contract");
  const { tier } = useStore();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const material = params.get("material") ?? "";
  const q = params.get("q") ?? "";
  const ship = params.get("ship") === "1";
  const band = params.get("band") ?? "";
  const sort = params.get("sort") ?? "featured";

  function set(next: Record<string, string | null>) {
    const updated = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (!value) updated.delete(key);
      else updated.set(key, value);
    }
    setParams(updated);
  }

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = PRODUCTS.filter((product) => {
      if (category && product.category !== category) return false;
      if (material && !product.materials.includes(material)) return false;
      if (ship && product.leadDays > 14) return false;
      if (band && bandOf(priceFor(product, tier)) !== band) return false;
      if (!query) return true;
      const hay = [product.name, product.sku, product.category, product.collection, product.blurb, product.description, ...product.materials]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
    const priced = (product: Product) => priceFor(product, tier);
    if (sort === "price-asc") list = [...list].sort((a, b) => priced(a) - priced(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => priced(b) - priced(a));
    if (sort === "lead") list = [...list].sort((a, b) => a.leadDays - b.leadDays);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, material, q, ship, band, sort, tier]);

  const filtered = Boolean(category || material || q || ship || band);

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Catalog</p>
        <h1>{category || (q ? `Results for “${q}”` : "The catalog")}</h1>
        <p className="lede">
          {items.length} {items.length === 1 ? "SKU" : "SKUs"} on the {tier === "guest" ? "list" : tier} schedule.
          Prices follow the account signed in on this desk.
        </p>
      </header>
      <div className="catalog">
        <aside className="filters" aria-label="Filter the catalog">
          <div className="filter-block">
            <p className="kicker">Category</p>
            <button type="button" className={!category ? "chip on" : "chip"} onClick={() => set({ category: null })}>
              All
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "chip on" : "chip"}
                onClick={() => set({ category: category === item ? null : item })}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="filter-block">
            <p className="kicker">Material</p>
            {MATERIALS.map((item) => (
              <button
                key={item}
                type="button"
                className={material === item ? "chip on" : "chip"}
                onClick={() => set({ material: material === item ? null : item })}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="filter-block">
            <p className="kicker">Price</p>
            {[
              ["under", "Under $1,000"],
              ["mid", "$1,000–$2,500"],
              ["over", "Over $2,500"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={band === id ? "chip on" : "chip"}
                onClick={() => set({ band: band === id ? null : id })}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="check">
            <input type="checkbox" checked={ship} onChange={(event) => set({ ship: event.target.checked ? "1" : null })} />
            Quick ship, two weeks or less
          </label>
          {filtered ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => set({ category: null, material: null, q: null, ship: null, band: null })}
            >
              Clear filters
            </button>
          ) : null}
        </aside>
        <div>
          <div className="toolbar">
            <p>
              Showing {items.length} of {PRODUCTS.length}
            </p>
            <label>
              <span className="sr">Sort</span>
              <select value={sort} onChange={(event) => set({ sort: event.target.value === "featured" ? null : event.target.value })}>
                {SORTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {items.length === 0 ? (
            <div className="empty">
              <h2>Nothing on that schedule.</h2>
              <p>Clear a filter, or search a SKU directly.</p>
            </div>
          ) : (
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
