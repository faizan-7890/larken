import { Piece } from "../iso";

export function Plate({
  slug,
  sku,
  badge,
  ivory = false,
}: {
  slug: string;
  sku?: string;
  badge?: string;
  ivory?: boolean;
}) {
  return (
    <div className={ivory ? "plate plate-dark" : "plate"}>
      {badge ? <span className="badge">{badge}</span> : null}
      <Piece slug={slug} ivory={ivory} />
      {sku ? <span className="plate-sku">{sku}</span> : null}
    </div>
  );
}
