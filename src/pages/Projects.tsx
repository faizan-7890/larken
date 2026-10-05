import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productBySlug } from "../catalog";
import { Field } from "../components/Field";
import { Plate } from "../components/Plate";
import { money, priceFor } from "../pricing";
import { useStore } from "../store";
import { useTitle } from "../title";

export function Projects() {
  useTitle("Projects · Larken Contract");
  const { user, projects, createProject } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mine = user ? projects.filter((project) => project.owner === user.email) : [];

  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">Projects</p>
        <h1>Park a floor before the PO exists.</h1>
        <p className="lede">
          A project cart holds finishes and quantities under a site name. It is not an order until you bring it across.
        </p>
      </header>
      {!user ? (
        <div className="empty">
          <p>Project carts sit on a trade or contract desk.</p>
          <div className="hero-actions">
            <Link className="btn" to="/account">
              Sign in
            </Link>
            <Link className="btn ghost" to="/trade">
              Open trade
            </Link>
          </div>
        </div>
      ) : (
        <div className="split">
          <div>
            {mine.length === 0 ? <p>No projects yet.</p> : null}
            <ul className="project-list">
              {mine.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`}>
                    <strong>{project.name}</strong>
                    <span>{project.site || "Site not named"}</span>
                    <em>
                      {project.lines.reduce((sum, line) => sum + line.qty, 0)} pieces · {project.id}
                    </em>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <form
            className="panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                setError("Name the project. A floor number is enough.");
                return;
              }
              const id = createProject(name, site, notes);
              if (id) navigate(`/projects/${id}`);
            }}
          >
            <h2>New project</h2>
            <Field label="Name" error={error ?? undefined}>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Austin HQ · Floor 4" />
            </Field>
            <Field label="Site">
              <input value={site} onChange={(event) => setSite(event.target.value)} />
            </Field>
            <Field label="Note">
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </Field>
            <button type="submit" className="btn">
              Open the project
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function ProjectPage() {
  const { id = "" } = useParams();
  const { projects, user, tier, setProjectQty, removeProject, projectToCart } = useStore();
  const project = projects.find((item) => item.id === id);
  const navigate = useNavigate();
  useTitle(project ? `${project.name} · Larken Contract` : "Project · Larken Contract");

  if (!project || (user && project.owner !== user.email)) {
    return (
      <div className="shell page">
        <header className="page-head">
          <h1>That project is not on this desk.</h1>
        </header>
        <Link className="btn" to="/projects">
          All projects
        </Link>
      </div>
    );
  }

  return (
    <div className="shell page">
      <p className="crumbs">
        <Link to="/projects">Projects</Link>
        <span>/</span>
        {project.name}
      </p>
      <header className="page-head">
        <p className="kicker">{project.id}</p>
        <h1>{project.name}</h1>
        <p className="lede">{project.site}</p>
        {project.notes ? <p>{project.notes}</p> : null}
      </header>
      {project.lines.length === 0 ? (
        <div className="empty">
          <p>Nothing parked. Add pieces from a product page.</p>
          <Link className="btn" to="/catalog">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <div className="line-table">
          {project.lines.map((line) => {
            const product = productBySlug(line.slug);
            if (!product) return null;
            const finish = product.finishes.find((item) => item.id === line.finishId) ?? product.finishes[0];
            return (
              <article key={`${line.slug}-${line.finishId}`} className="line">
                <Link to={`/product/${line.slug}`} className="line-plate">
                  <Plate slug={line.slug} />
                </Link>
                <div>
                  <p className="kicker">{product.sku}</p>
                  <h2>
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  </h2>
                  <p className="fine">
                    {finish.name} · {money(priceFor(product, tier))} {tier === "guest" ? "list" : tier}
                  </p>
                </div>
                <div className="stepper">
                  <button type="button" onClick={() => setProjectQty(project.id, line.slug, line.finishId, line.qty - 1)} aria-label="Decrease">
                    −
                  </button>
                  <input
                    aria-label="Quantity"
                    value={line.qty}
                    onChange={(event) => {
                      const next = Number(event.target.value.replace(/[^\d]/g, ""));
                      if (Number.isFinite(next)) setProjectQty(project.id, line.slug, line.finishId, Math.min(99, next));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setProjectQty(project.id, line.slug, line.finishId, Math.min(99, line.qty + 1))}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="hero-actions section">
        <button
          type="button"
          className="btn"
          disabled={project.lines.length === 0}
          onClick={() => {
            projectToCart(project.id);
            navigate("/cart");
          }}
        >
          Bring into the order
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            removeProject(project.id);
            navigate("/projects");
          }}
        >
          Delete project
        </button>
      </div>
    </div>
  );
}
