import { PIECES } from "./pieces";
import type { BoxShape, DrumShape, Shape } from "./types";

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}

function ellipseRadii(r: number) {
  return { rx: r * COS * Math.SQRT2, ry: r * SIN * Math.SQRT2 };
}

function pathOf(pts: [number, number, number][], close: boolean) {
  const d =
    pts
      .map((pt, i) => {
        const [x, y] = project(pt[0], pt[1], pt[2]);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ") + (close ? " Z" : "");
  return d;
}

function farOf(shape: Shape) {
  if (shape.kind === "box") return shape.x + shape.y + shape.d;
  if (shape.kind === "drum") return shape.x + shape.y + shape.r;
  return 0;
}

function pointsOf(shape: Shape): [number, number][] {
  if (shape.kind === "wire") return shape.points.map((p) => project(p[0], p[1], p[2]));
  if (shape.kind === "box") {
    const { x, y, z, w, d, h } = shape;
    const corners: [number, number, number][] = [
      [x, y, z],
      [x + w, y, z],
      [x, y + d, z],
      [x + w, y + d, z],
      [x, y, z + h],
      [x + w, y, z + h],
      [x, y + d, z + h],
      [x + w, y + d, z + h],
    ];
    return corners.map((c) => project(c[0], c[1], c[2]));
  }
  const { rx, ry } = ellipseRadii(shape.r);
  const tops = [shape.z, shape.z + shape.h].flatMap((z) => {
    const [cx, cy] = project(shape.x, shape.y, z);
    return [
      [cx - rx, cy],
      [cx + rx, cy],
      [cx, cy - ry],
      [cx, cy + ry],
    ] as [number, number][];
  });
  return tops;
}

function BoxFaces({ shape }: { shape: BoxShape }) {
  const { x, y, z, w, d, h, tone } = shape;
  const side = pathOf(
    [
      [x + w, y, z],
      [x + w, y + d, z],
      [x + w, y + d, z + h],
      [x + w, y, z + h],
    ],
    true,
  );
  const front = pathOf(
    [
      [x, y, z],
      [x + w, y, z],
      [x + w, y, z + h],
      [x, y, z + h],
    ],
    true,
  );
  const top = pathOf(
    [
      [x, y, z + h],
      [x + w, y, z + h],
      [x + w, y + d, z + h],
      [x, y + d, z + h],
    ],
    true,
  );
  const seams = Array.from({ length: shape.seams ?? 0 }, (_, index) => {
    const sx = x + (w * (index + 1)) / ((shape.seams ?? 0) + 1);
    return pathOf(
      [
        [sx, y, z],
        [sx, y, z + h],
      ],
      false,
    );
  });
  const bands = Array.from({ length: shape.bands ?? 0 }, (_, index) => {
    const sz = z + (h * (index + 1)) / ((shape.bands ?? 0) + 1);
    return pathOf(
      [
        [x, y, sz],
        [x + w, y, sz],
      ],
      false,
    );
  });
  return (
    <g>
      <path d={side} className={`face face-mid tone-${tone}`} />
      <path d={front} className={`face face-shade tone-${tone}`} />
      <path d={top} className={`face face-top tone-${tone}`} />
      {seams.map((d) => (
        <path key={d} d={d} className="seam" />
      ))}
      {bands.map((d) => (
        <path key={d} d={d} className="seam" />
      ))}
    </g>
  );
}

function DrumFaces({ shape }: { shape: DrumShape }) {
  const { rx, ry } = ellipseRadii(shape.r);
  const [cx, cy] = project(shape.x, shape.y, shape.z + shape.h);
  const [bx, by] = project(shape.x, shape.y, shape.z);
  const side = `M ${cx - rx} ${cy} L ${bx - rx} ${by} A ${rx} ${ry} 0 0 0 ${bx + rx} ${by} L ${cx + rx} ${cy} Z`;
  return (
    <g>
      <path d={side} className={`face face-mid tone-${shape.tone}`} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={`face face-top tone-${shape.tone}`} />
    </g>
  );
}

export function Piece({ slug, ivory = false }: { slug: string; ivory?: boolean }) {
  const shapes = PIECES[slug] ?? [];
  const solids = shapes.filter((shape) => shape.kind !== "wire").sort((a, b) => farOf(b) - farOf(a));
  const wires = shapes.filter((shape) => shape.kind === "wire");
  const flat = shapes.flatMap(pointsOf);
  if (flat.length === 0) return null;
  const xs = flat.map((p) => p[0]);
  const ys = flat.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padX = (maxX - minX) * 0.1 + 6;
  const padY = (maxY - minY) * 0.1 + 6;
  const viewBox = `${minX - padX} ${minY - padY} ${maxX - minX + padX * 2} ${maxY - minY + padY * 2}`;

  return (
    <svg className={ivory ? "iso ivory" : "iso"} viewBox={viewBox} role="img" aria-hidden="true">
      {solids.map((shape, index) =>
        shape.kind === "box" ? (
          <BoxFaces key={index} shape={shape} />
        ) : shape.kind === "drum" ? (
          <DrumFaces key={index} shape={shape} />
        ) : null,
      )}
      {wires.map((shape, index) =>
        shape.kind === "wire" ? (
          <path key={`w${index}`} d={pathOf(shape.points, false)} className={`wire tone-${shape.tone}`} />
        ) : null,
      )}
    </svg>
  );
}
