import { Link } from "react-router-dom";
import { useTitle } from "../title";

export function About() {
  useTitle("About · Larken Contract");
  return (
    <div className="shell page narrow">
      <header className="page-head">
        <p className="kicker">About the mill</p>
        <h1>A frame shop that learned to invoice.</h1>
        <p className="lede">
          Larken started as a seating shop attached to a frame mill in Grand Rapids. The mill still cuts the oak. The
          desk exists so a facilities manager in Austin can specify a floor without a six-week thread of attachments.
        </p>
      </header>
      <ol className="timeline">
        <li>
          <span>1998</span>
          <p>Frame shop opens on Monroe Center. The first chairs are sold to the bank across the street.</p>
        </li>
        <li>
          <span>2006</span>
          <p>The first contract line, drawn for a lobby that had to survive a renovation and a merger.</p>
        </li>
        <li>
          <span>2014</span>
          <p>Trade desk. Resale certificates on file, net 30, and a person who answers the phone.</p>
        </li>
        <li>
          <span>2026</span>
          <p>Project carts and the three schedules, on the page, for the buyer who already knows the SKU.</p>
        </li>
      </ol>
      <p>
        The company on this website is fictional. The oak, the lead times, and the purchase-order field are here so the
        desk can be used end to end. <Link to="/contact">Write anyway</Link>, if only to see the confirmation.
      </p>
    </div>
  );
}
