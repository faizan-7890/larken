import { useState } from "react";
import { Field } from "../components/Field";
import { useTitle } from "../title";

export function Contact() {
  useTitle("Contact · Larken Contract");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="shell page">
      <div className="split">
        <header className="page-head">
          <p className="kicker">Contact</p>
          <h1>Write the desk.</h1>
          <p className="lede">
            Trade hours are weekdays, 8 to 5 Eastern. The showroom is at 418 Monroe Center, Suite 400, Grand Rapids.
            Call (616) 555-0148 if the question is about a lead time already on an order.
          </p>
          <address className="contact-address">
            Larken Contract
            <br />
            418 Monroe Center, Suite 400
            <br />
            Grand Rapids, Michigan 49503
          </address>
        </header>
        {sent ? (
          <div className="panel">
            <h2>Received, on this desk.</h2>
            <p>Nothing was emailed. The note stayed in the browser, which is the honest version of a demonstration form.</p>
          </div>
        ) : (
          <form
            className="panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim() || !note.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("Name, a real email shape, and a note.");
                return;
              }
              setError(null);
              setSent(true);
            }}
          >
            <Field label="Name" error={error ?? undefined}>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label="Email">
              <input value={email} onChange={(event) => setEmail(event.target.value)} inputMode="email" />
            </Field>
            <Field label="Note">
              <textarea value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            <button type="submit" className="btn">
              Send to the desk
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
