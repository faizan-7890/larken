import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../components/Field";
import { useStore } from "../store";
import { useTitle } from "../title";

export function Trade() {
  useTitle("Trade · Larken Contract");
  const { openTrade, user } = useStore();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [certificate, setCertificate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Trade desk</p>
        <h1>Three schedules. One catalog.</h1>
        <p className="lede">
          The public price is list. Studios with a resale certificate buy at trade, fifteen percent under list, net 30.
          Companies that furnish more than one address are moved to a contract schedule, net 45, with a purchase order
          required at checkout.
        </p>
      </header>
      <div className="tier-grid">
        <article className="panel">
          <p className="kicker">List</p>
          <h2>Anyone</h2>
          <p>The number on the page before you sign in. Due at order. Useful for a single replacement, not a floor.</p>
        </article>
        <article className="panel">
          <p className="kicker">Trade · 15%</p>
          <h2>Studios</h2>
          <p>Net 30. The discount shows the moment the account opens, including on an order already in the cart.</p>
        </article>
        <article className="panel">
          <p className="kicker">Contract</p>
          <h2>Procurement</h2>
          <p>About twenty percent under list. Net 45. Cost centers, and a purchase order the checkout will not skip.</p>
        </article>
      </div>
      <div className="split">
        <form
          className="panel"
          onSubmit={(event) => {
            event.preventDefault();
            const next: Record<string, string> = {};
            if (!company.trim()) next.company = "The schedule needs a studio or company name.";
            if (!contact.trim()) next.contact = "Name the buyer.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Email should look like an email.";
            if (!certificate.trim()) next.certificate = "A certificate number, even a sample one.";
            setErrors(next);
            if (Object.keys(next).length) return;
            openTrade({ company, contact, email });
            navigate("/account");
          }}
        >
          <h2>Open trade</h2>
          <p className="fine">This demonstration accepts the certificate and applies trade pricing immediately.</p>
          <Field label="Studio or company" error={errors.company}>
            <input value={company} onChange={(event) => setCompany(event.target.value)} />
          </Field>
          <Field label="Buyer" error={errors.contact}>
            <input value={contact} onChange={(event) => setContact(event.target.value)} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} inputMode="email" />
          </Field>
          <Field label="Resale certificate" error={errors.certificate}>
            <input value={certificate} onChange={(event) => setCertificate(event.target.value)} placeholder="RC-10442" />
          </Field>
          <button type="submit" className="btn">
            Apply the trade schedule
          </button>
        </form>
        <aside className="panel">
          <h2>Already on a schedule</h2>
          {user ? (
            <p>
              {user.company} is signed in on {user.terms}. <Link to="/catalog">Return to the catalog</Link> and the
              prices will have moved.
            </p>
          ) : (
            <p>
              Northline Holdings is the sample contract desk. Fieldwork Studio is the sample trade desk. Both are on
              the <Link to="/account">account page</Link>, passwords included, because this is a showroom and not a
              bank.
            </p>
          )}
          <p className="fine">Contract schedules are not self-serve. Use the Northline sample to see PO enforcement.</p>
        </aside>
      </div>
    </div>
  );
}
