import { useState } from "react";
import { Link } from "react-router-dom";
import { ACCOUNTS } from "../catalog";
import { Field } from "../components/Field";
import { longDate, money, tierLabel } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";

export function Account() {
  useTitle("Account · Larken Contract");
  const { user, orders, projects, signIn, signOut } = useStore();
  const [email, setEmail] = useState(ACCOUNTS[0].email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mine = user ? projects.filter((project) => project.owner === user.email) : [];

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Account</p>
        <h1>{user ? user.company : "The desk"}</h1>
        <p className="lede">
          {user
            ? `${user.contact} · ${tierLabel(user.tier)} schedule · ${user.terms}.`
            : "Sign in to a sample desk, or open a trade account with your own studio name."}
        </p>
      </header>

      {user ? (
        <div className="account-bar">
          <p>
            Signed in as {user.email}. Pricing on the catalog is {tierLabel(user.tier).toLowerCase()}.
          </p>
          <button type="button" className="btn ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="split account-grid">
          <form
            className="panel"
            onSubmit={(event) => {
              event.preventDefault();
              setError(signIn(email, password));
            }}
          >
            <h2>Sign in</h2>
            <Field label="Email" error={error ?? undefined}>
              <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <button type="submit" className="btn">
              Enter the desk
            </button>
          </form>
          <aside className="panel">
            <h2>Sample desks</h2>
            <ul className="cred-list">
              {ACCOUNTS.map((account) => (
                <li key={account.email}>
                  <strong>{account.company}</strong>
                  <span>
                    {account.email}
                    <br />
                    Password {account.password} · {tierLabel(account.tier)} · {account.terms}
                  </span>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setError(signIn(account.email, account.password));
                    }}
                  >
                    Use this desk
                  </button>
                </li>
              ))}
            </ul>
            <p className="fine">
              Or <Link to="/trade">open a trade account</Link> under another name. It prices at trade immediately.
            </p>
          </aside>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Orders on this browser</h2>
        </div>
        {orders.length === 0 ? (
          <p className="lede">None yet. A placed order, or a sample desk, will land here.</p>
        ) : (
          <table className="sheet">
            <thead>
              <tr>
                <th>Order</th>
                <th>Placed</th>
                <th>Company</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>{longDate(order.placedAt)}</td>
                  <td>{order.company}</td>
                  <td>{order.status}</td>
                  <td>{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {user ? (
        <section className="section">
          <div className="section-head">
            <h2>Project carts</h2>
            <Link className="text-link" to="/projects">
              Manage projects
            </Link>
          </div>
          {mine.length === 0 ? (
            <p>No projects for this desk.</p>
          ) : (
            <ul className="plain-list">
              {mine.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                  <span>
                    {project.lines.reduce((sum, line) => sum + line.qty, 0)} pieces · {project.site}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
