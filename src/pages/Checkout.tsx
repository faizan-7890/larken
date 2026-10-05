import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { describeCart } from "../cartview";
import { Field } from "../components/Field";
import { Totals } from "../components/ProductCard";
import { money, tierLabel } from "../pricing";
import { useStore, type CheckoutDraft } from "../store";
import { useTitle } from "../title";

const EMPTY = {
  email: "",
  company: "",
  contact: "",
  po: "",
  costCenter: "",
  projectName: "",
  needBy: "",
  site: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal: "",
  cardName: "",
  card: "",
  exp: "",
  cvc: "",
};

export function Checkout() {
  useTitle("Checkout · Larken Contract");
  const { cart, user, tier, promo, placeOrder } = useStore();
  const navigate = useNavigate();
  const [whiteGlove, setWhiteGlove] = useState(false);
  const [form, setForm] = useState({
    ...EMPTY,
    email: user?.email ?? "",
    company: user?.company ?? "",
    contact: user?.contact ?? "",
    costCenter: user?.costCenters[0] ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const view = describeCart(cart, tier, promo, whiteGlove);

  if (cart.length === 0) return <Navigate to="/cart" replace />;

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
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
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const draft: CheckoutDraft = {
      email: form.email.trim(),
      company: form.company.trim(),
      contact: form.contact.trim(),
      po: form.po.trim(),
      costCenter: form.costCenter.trim(),
      projectName: form.projectName.trim(),
      needBy: form.needBy,
      whiteGlove,
      ship: {
        site: form.site.trim() || form.company.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        city: form.city.trim(),
        region: form.region.trim(),
        postal: form.postal.trim(),
      },
    };
    const order = placeOrder(draft);
    navigate(`/orders/${order.id}`);
  }

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Checkout</p>
        <h1>Place the order</h1>
        <p className="lede">
          {tierLabel(tier)} pricing
          {user ? `, ${user.terms}, billed to ${user.company}` : ", due at order"}. Card details stay in this form and
          are thrown away.
        </p>
      </header>
      <form className="split" onSubmit={submit} noValidate>
        <div className="stack">
          <section>
            <h2>
              <span>01</span> Buyer and ship-to
            </h2>
            <div className="form-grid">
              <Field label="Company" error={errors.company}>
                <input value={form.company} onChange={(event) => update("company", event.target.value)} autoComplete="organization" />
              </Field>
              <Field label="Contact" error={errors.contact}>
                <input value={form.contact} onChange={(event) => update("contact", event.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email} className="span-2">
                <input value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" inputMode="email" />
              </Field>
              <Field label="Site name" className="span-2">
                <input value={form.site} onChange={(event) => update("site", event.target.value)} placeholder="Austin HQ, floor 4" />
              </Field>
              <Field label="Street" className="span-2" error={errors.ship}>
                <input value={form.line1} onChange={(event) => update("line1", event.target.value)} autoComplete="address-line1" />
              </Field>
              <Field label="Suite, dock, floor" className="span-2">
                <input value={form.line2} onChange={(event) => update("line2", event.target.value)} autoComplete="address-line2" />
              </Field>
              <Field label="City">
                <input value={form.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" />
              </Field>
              <Field label="State">
                <input value={form.region} onChange={(event) => update("region", event.target.value)} autoComplete="address-level1" placeholder="MI" />
              </Field>
              <Field label="Postal">
                <input value={form.postal} onChange={(event) => update("postal", event.target.value)} autoComplete="postal-code" />
              </Field>
            </div>
          </section>
          <section>
            <h2>
              <span>02</span> Commercial terms
            </h2>
            <div className="form-grid">
              <Field label={tier === "enterprise" ? "Purchase order" : "PO or reference"} error={errors.po}>
                <input value={form.po} onChange={(event) => update("po", event.target.value)} />
              </Field>
              <Field label="Cost center">
                {user && user.costCenters.length > 0 ? (
                  <select value={form.costCenter} onChange={(event) => update("costCenter", event.target.value)}>
                    {user.costCenters.map((center) => (
                      <option key={center}>{center}</option>
                    ))}
                  </select>
                ) : (
                  <input value={form.costCenter} onChange={(event) => update("costCenter", event.target.value)} />
                )}
              </Field>
              <Field label="Project name">
                <input value={form.projectName} onChange={(event) => update("projectName", event.target.value)} />
              </Field>
              <Field label="Need by">
                <input type="date" value={form.needBy} onChange={(event) => update("needBy", event.target.value)} />
              </Field>
            </div>
            <label className="check">
              <input type="checkbox" checked={whiteGlove} onChange={(event) => setWhiteGlove(event.target.checked)} />
              White-glove to the room, +{money(280)}
            </label>
          </section>
          <section>
            <h2>
              <span>03</span> Payment
            </h2>
            <p className="fine">Demonstration only. The number is checked for length and never written to this browser.</p>
            <div className="form-grid">
              <Field label="Name on card" error={errors.cardName} className="span-2">
                <input value={form.cardName} onChange={(event) => update("cardName", event.target.value)} autoComplete="cc-name" />
              </Field>
              <Field label="Card number" error={errors.card} className="span-2">
                <input value={form.card} onChange={(event) => update("card", event.target.value)} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" />
              </Field>
              <Field label="Expiry" error={errors.exp}>
                <input value={form.exp} onChange={(event) => update("exp", event.target.value)} placeholder="MM/YY" autoComplete="off" />
              </Field>
              <Field label="CVC" error={errors.cvc}>
                <input value={form.cvc} onChange={(event) => update("cvc", event.target.value)} inputMode="numeric" autoComplete="off" />
              </Field>
            </div>
          </section>
        </div>
        <aside className="summary">
          <h2>Review</h2>
          <ul className="review-lines">
            {view.lines.map((line) => (
              <li key={line.id}>
                <span>
                  {line.qty} × {line.product.name}
                  <small>{line.finish.name}</small>
                </span>
                <span>{money(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <Totals
            merchandise={view.merchandise}
            scheduleSavings={view.scheduleSavings}
            discount={view.discount}
            freight={view.freight}
            tax={view.tax}
            total={view.total}
            tierName={tierLabel(tier)}
            freightNote={whiteGlove ? "Freight · white glove" : "Freight"}
          />
          <button type="submit" className="btn full">
            Place order
          </button>
          <p className="fine">
            By placing this order you are confirming a demonstration. No invoice leaves the browser.{" "}
            <Link to="/policies">Freight and warranty</Link>
          </p>
        </aside>
      </form>
    </div>
  );
}
