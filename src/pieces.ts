import type { Shape, Tone } from "./types";

function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  tone: Tone,
  extra?: { seams?: number; bands?: number },
): Shape {
  return { kind: "box", x, y, z, w, d, h, tone, ...extra };
}

function drum(x: number, y: number, z: number, r: number, h: number, tone: Tone): Shape {
  return { kind: "drum", x, y, z, r, h, tone };
}

function wire(points: [number, number, number][], tone: Tone): Shape {
  return { kind: "wire", points, tone };
}

function legs(w: number, d: number, h: number, inset: number, tone: Tone, t = 2.2): Shape[] {
  return [
    box(inset, inset, 0, t, t, h, tone),
    box(w - inset - t, inset, 0, t, t, h, tone),
    box(inset, d - inset - t, 0, t, t, h, tone),
    box(w - inset - t, d - inset - t, 0, t, t, h, tone),
  ];
}

function arcPoints(): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const ang = (t * Math.PI) / 2;
    points.push([Math.sin(ang) * 32, 0, 48 - (1 - Math.cos(ang)) * 26]);
  }
  return points;
}

export const PIECES: Record<string, Shape[]> = {
  "hale-lounge": [
    box(5, 3, 0, 2.3, 2.3, 12, "wood"),
    box(30, 3, 0, 2.3, 2.3, 12, "wood"),
    box(5, 27, 0, 2.3, 2.3, 12, "wood"),
    box(30, 27, 0, 2.3, 2.3, 12, "wood"),
    box(4, 2, 12, 28, 26, 5, "cloth"),
    box(4, 24, 16, 28, 4.2, 16, "cloth"),
    box(0, 4, 13, 4, 22, 8, "wood"),
    box(32, 4, 13, 4, 22, 8, "wood"),
  ],
  "keel-task": [
    drum(0, 0, 0, 13, 1.5, "metal"),
    drum(0, 0, 1.5, 1.7, 16, "metal"),
    box(-12, -12, 17.5, 24, 22, 3.8, "dark"),
    box(-10, 7, 20.6, 20, 3.4, 20, "dark"),
  ],
  "mare-stool": [
    drum(0, 0, 0, 8, 1.3, "wood"),
    drum(0, 0, 1.3, 1.45, 22, "wood"),
    drum(0, 0, 9, 5.2, 0.9, "wood"),
    drum(0, 0, 23.3, 8.2, 2.6, "wood"),
  ],
  "field-bench": [
    ...legs(62, 16, 15, 3.2, "wood", 2.3),
    box(0, 0, 15, 62, 16, 3.4, "leather"),
  ],
  "sable-table": [
    ...legs(96, 36, 28, 4, "dark", 2.6),
    box(0, 0, 28, 96, 36, 2.1, "wood"),
  ],
  "ledger-desk": [
    box(2, 2, 0, 16, 22, 28, "walnut", { bands: 2 }),
    box(40, 2, 0, 2.3, 2.3, 28, "walnut"),
    box(40, 20, 0, 2.3, 2.3, 28, "walnut"),
    box(0, 0, 28, 52, 26, 1.8, "walnut"),
  ],
  "arc-lamp": [
    drum(0, 0, 0, 9, 1.4, "brass"),
    drum(0, 0, 1.4, 1.15, 46.6, "brass"),
    wire(arcPoints(), "brass"),
    drum(32, 0, 12, 5.4, 8, "cloth"),
  ],
  "bridle-pendant": [
    drum(0, 0, 34, 3.4, 1.3, "brass"),
    wire(
      [
        [0, 0, 34],
        [0, 0, 22],
      ],
      "brass",
    ),
    drum(0, 0, 10, 9, 12, "cloth"),
    drum(0, 0, 8.6, 1.8, 1.4, "brass"),
  ],
  "linden-sideboard": [
    box(2, 2, 0, 2.4, 2.4, 3, "wood"),
    box(46, 2, 0, 2.4, 2.4, 3, "wood"),
    box(2, 14, 0, 2.4, 2.4, 3, "wood"),
    box(46, 14, 0, 2.4, 2.4, 3, "wood"),
    box(0, 0, 3, 50, 18, 24, "wood", { seams: 1 }),
    box(-1.2, -1.2, 27, 52.4, 20.4, 1.7, "wood"),
  ],
  "vesper-shelf": [
    box(0, 0, 0, 1.8, 14, 56, "walnut"),
    box(34, 0, 0, 1.8, 14, 56, "walnut"),
    box(0, 0, 0, 35.8, 14, 1.4, "walnut"),
    box(0, 0, 18, 35.8, 14, 1.4, "walnut"),
    box(0, 0, 36, 35.8, 14, 1.4, "walnut"),
    box(0, 0, 54.2, 35.8, 14, 1.6, "walnut"),
  ],
  "quarry-rug": [
    box(0, 0, 0, 48, 32, 0.8, "wool"),
    box(0, 14, 0.8, 48, 3.2, 0.28, "rust"),
  ],
  "cinder-vessel": [
    drum(0, 0, 0, 7.4, 3.2, "stone"),
    drum(0, 0, 2.8, 6.2, 6.4, "stone"),
    drum(0, 0, 8.8, 4.8, 4.6, "stone"),
    drum(0, 0, 13, 3.1, 2.4, "stone"),
  ],
};
