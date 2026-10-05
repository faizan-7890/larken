import { Link } from "react-router-dom";
import { useTitle } from "../title";

export function NotFound() {
  useTitle("Not on the floor · Larken Contract");
  return (
    <div className="shell page">
      <header className="page-head">
        <p className="kicker">404</p>
        <h1>Not on the floor.</h1>
        <p className="lede">That page is not in the catalog, the desk, or the mill.</p>
      </header>
      <Link className="btn" to="/catalog">
        Browse the catalog
      </Link>
    </div>
  );
}
