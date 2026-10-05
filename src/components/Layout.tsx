import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../catalog";
import { money, priceFor } from "../pricing";
import { useStore } from "../store";

export function Layout() {
  const { count, user, notice, dismissNotice, tier } = useStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setSearching(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
        setSearching(true);
      }
      if (event.key === "Escape") setSearching(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((product) =>
      [product.name, product.sku, product.category, product.collection, product.blurb, ...product.materials]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ).slice(0, 6);
  }, [draft]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to the order of business
      </a>
      <div className="announce">
        <div className="shell">
          <p>
            Trade saves 15% against list. Contract schedules bill net 45.{" "}
            <Link to="/trade">Open a desk</Link>
          </p>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-row">
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <Link to="/" className="logo" aria-label="Larken Contract, home">
            <span>Larken</span>
            <small>Contract</small>
          </Link>
          <nav id="site-nav" className={open ? "site-nav open" : "site-nav"} aria-label="Primary">
            <div className="drop">
              <NavLink to="/catalog">Catalog</NavLink>
              <div className="drop-panel">
                {CATEGORIES.map((category) => (
                  <Link key={category} to={`/catalog?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/trade">Trade</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/quick-order">Quick order</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
          <div className="tools">
            <form
              className="search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                navigate(`/catalog?q=${encodeURIComponent(draft.trim())}`);
                setSearching(false);
              }}
            >
              <label className="sr" htmlFor="site-search">
                Search the catalog
              </label>
              <input
                id="site-search"
                ref={inputRef}
                type="search"
                placeholder="Search, or press /"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setSearching(true);
                }}
                onFocus={() => setSearching(true)}
              />
              {searching && draft.trim() && results.length > 0 ? (
                <div className="suggest" role="listbox">
                  {results.map((product) => (
                    <Link key={product.slug} to={`/product/${product.slug}`}>
                      <span>{product.sku}</span>
                      <strong>{product.name}</strong>
                      <em>{money(priceFor(product, tier))}</em>
                    </Link>
                  ))}
                </div>
              ) : null}
            </form>
            <NavLink to="/account" className="tool-link">
              {user ? user.short : "Account"}
            </NavLink>
            <NavLink to="/cart" className="tool-link order-link">
              Order <span>{count}</span>
            </NavLink>
          </div>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <p className="logo footer-logo">
              <span>Larken</span>
              <small>Contract</small>
            </p>
            <p className="footer-lead">
              Seating, tables, and light from a mill in Grand Rapids. Specified once, then left alone.
            </p>
          </div>
          <div>
            <p className="kicker">Catalog</p>
            <ul>
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link to={`/catalog?category=${encodeURIComponent(category)}`}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker">Desk</p>
            <ul>
              <li>
                <Link to="/trade">Trade accounts</Link>
              </li>
              <li>
                <Link to="/projects">Project carts</Link>
              </li>
              <li>
                <Link to="/quick-order">Quick order</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/policies">Freight & warranty</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="kicker">Showroom</p>
            <address>
              418 Monroe Center
              <br />
              Suite 400
              <br />
              Grand Rapids, MI 49503
              <br />
              <a href="tel:+16165550148">(616) 555-0148</a>
            </address>
            <p>
              <Link to="/contact">Write the desk</Link>
            </p>
          </div>
        </div>
        <div className="shell footer-base">
          <p>© 2026 Larken Contract. A fictional showroom. Nothing on this desk is charged.</p>
          <p>Weekdays 8–5 ET</p>
        </div>
      </footer>
      {notice ? (
        <div className="toast" role="status">
          <p>{notice}</p>
          <Link to="/cart" onClick={dismissNotice}>
            View order
          </Link>
        </div>
      ) : null}
    </>
  );
}
