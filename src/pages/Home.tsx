import { Link } from "react-router-dom";
import { CATEGORIES, CATEGORY_COPY, PRODUCTS, productBySlug } from "../catalog";
import { Piece } from "../iso";
import { leadLabel, money, priceFor, tierLabel } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";
import { ProductCard } from "../components/ProductCard";

const FLOOR = ["hale-lounge", "keel-task", "sable-table", "arc-lamp"];
const LONG_ROOM = ["hale-lounge", "field-bench", "arc-lamp", "quarry-rug"];

export function Home() {
  useTitle("Larken Contract");
  const { tier, recent } = useStore();
  const hale = productBySlug("hale-lounge")!;
  const seen = recent.map((slug) => productBySlug(slug)).filter((item) => item != null);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">
            <span>Contract collection</span> Grand Rapids
          </p>
          <h1>
            Specify it
            <br />
            once
          </h1>
          <p className="lede">
            Seating, tables, and light for the people who furnish a floor and then have to live with the purchase
            order. Lead times, three price schedules, and a spec on every SKU.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/catalog">
              Browse the catalog
            </Link>
            <Link className="btn ghost" to="/trade">
              Open a trade account
            </Link>
          </div>
          <ul className="facts">
            <li>
              <span>Warranty</span>
              12-year frame
            </li>
            <li>
              <span>Terms</span>
              Net 30 / Net 45
            </li>
            <li>
              <span>Mill</span>
              Still in Grand Rapids
            </li>
          </ul>
        </div>
        <div className="hero-stage">
          <div className="hero-art">
            <Piece slug="hale-lounge" ivory />
          </div>
          <Link to="/product/hale-lounge" className="spec-slip">
            <p className="kicker">Shop drawing · HL-LNG-01</p>
            <strong>Hale Lounge</strong>
            <p>White oak, oatmeal bouclé. Lead {leadLabel(hale.leadDays).toLowerCase()}.</p>
            <p className="price">
              <strong>{money(priceFor(hale, tier))}</strong>
              <span>{tierLabel(tier)}</span>
            </p>
          </Link>
        </div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <p className="kicker">
            <span>01</span> The lines
          </p>
          <h2>Six things we actually make.</h2>
        </div>
        <ul className="index">
          {CATEGORIES.map((category, index) => {
            const count = PRODUCTS.filter((product) => product.category === category).length;
            return (
              <li key={category}>
                <Link to={`/catalog?category=${encodeURIComponent(category)}`}>
                  <span className="index-no">0{index + 1}</span>
                  <strong>{category}</strong>
                  <em>{CATEGORY_COPY[category]}</em>
                  <span className="index-count">
                    {count} {count === 1 ? "SKU" : "SKUs"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <p className="kicker">
              <span>02</span> On the floor
            </p>
            <h2>Specified most often this quarter.</h2>
          </div>
          <Link className="text-link" to="/catalog">
            Full catalog
          </Link>
        </div>
        <div className="product-grid">
          {FLOOR.map((slug) => {
            const product = productBySlug(slug);
            return product ? <ProductCard key={slug} product={product} /> : null;
          })}
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <p className="kicker light">
            <span>03</span> The desk
          </p>
          <h2>Built for the person who has to buy twelve.</h2>
          <div className="band-grid">
            <article>
              <h3>A price for the buyer</h3>
              <p>List, trade, or a contract schedule. The same SKU, three numbers, no phone call to find out which.</p>
            </article>
            <article>
              <h3>Project carts</h3>
              <p>Park a floor under a name, a site, and a note. Move it onto an order when the purchase order clears.</p>
            </article>
            <article>
              <h3>Freight that names itself</h3>
              <p>Warehouse stock or the mill. A lead time on the page. White-glove when the room is above a loading dock.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="shell section story">
        <div>
          <p className="kicker">
            <span>04</span> The Long Room
          </p>
          <h2>A lobby that can wait.</h2>
          <p className="lede">
            Hale, Field, Arc, and the Quarry rug were drawn for the same kind of room: a reception that has to look
            considered on a Tuesday in year six. They share a lead conversation, not a matching finish.
          </p>
          <Link className="text-link" to="/catalog?q=Long%20Room">
            See the collection
          </Link>
        </div>
        <div className="story-grid">
          {LONG_ROOM.map((slug) => {
            const product = productBySlug(slug);
            if (!product) return null;
            return (
              <Link key={slug} to={`/product/${slug}`} className="story-card">
                <span className="kicker">{product.sku}</span>
                <strong>{product.name}</strong>
              </Link>
            );
          })}
        </div>
      </section>

      {seen.length > 0 ? (
        <section className="shell section">
          <div className="section-head">
            <div>
              <p className="kicker">Recently specified</p>
              <h2>Still open on this desk.</h2>
            </div>
          </div>
          <div className="product-grid">
            {seen.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="shell trade-strip">
        <div>
          <p className="kicker">Trade desk</p>
          <h2>Fifteen percent, on the page, before you ask.</h2>
          <p>
            A studio name and a resale certificate change the schedule to trade, net 30. Contract pricing is opened by
            the desk for buyers who furnish more than one address.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn" to="/trade">
            Open a trade account
          </Link>
          <Link className="btn ghost" to="/account">
            Sign in
          </Link>
        </div>
      </section>
    </>
  );
}
