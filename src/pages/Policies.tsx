import { Link } from "react-router-dom";
import { useTitle } from "../title";

export function Policies() {
  useTitle("Freight & warranty · Larken Contract");
  return (
    <div className="shell page narrow prose">
      <header className="page-head">
        <p className="kicker">Policies</p>
        <h1>Freight, returns, warranty.</h1>
      </header>
      <h2>Freight</h2>
      <p>
        Dock delivery is $145, waived when merchandise after schedule and code is $2,500 or more. White-glove to the
        room is an extra $280, chosen at checkout. Crated tables need two people at receiving. Rugs ship rolled, never
        folded.
      </p>
      <h2>Lead time</h2>
      <p>
        Warehouse counts ship inside the lead printed on the SKU. Quantity above that count, and anything marked made
        to order, is cut at the mill. A need-by date is a request, not a promise the checkout can make.
      </p>
      <h2>Returns</h2>
      <p>
        Stocked goods in original cartons can be returned within 14 days of delivery. Made-to-order frames, cut rugs,
        and specified finishes are not returnable unless the piece arrives damaged or not as specified. Write the desk
        before sending anything back.
      </p>
      <h2>Warranty</h2>
      <p>
        Frames are warranted for 12 years of ordinary contract use. Upholstery is 2 years. Lighting is 5 years
        electrical and 2 years on the finish. Unlacquered brass will darken. Wool will fade in a south window. Neither
        is a defect.
      </p>
      <h2>This website</h2>
      <p>
        Larken Contract is a fictional showroom. Checkout checks the shape of a card number and discards it. No payment
        is processed, and no order leaves this browser. <Link to="/catalog">Return to the catalog</Link>.
      </p>
    </div>
  );
}
