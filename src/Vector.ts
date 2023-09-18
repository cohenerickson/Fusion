/**
 * `{ x: number; y: number; direction?: number; magnitude?: number }`
 *
 * `[x, y]`
 *
 * `[x, y, direction, magnitude]`
 *
 * `Vector`
 */
export type VectorLike =
  | { x: number; y: number; direction?: number; magnitude?: number }
  | [number, number]
  | [number, number, number, number]
  | Vector;

export class Vector {
  x: number;
  y: number;
  direction: number = 0;
  magnitude: number = 0;

  constructor(p1: VectorLike, p2?: VectorLike) {
    if (Array.isArray(p1)) {
      this.x = p1[0];
      this.y = p1[1];
    } else {
      this.x = p1.x;
      this.y = p1.y;
    }

    if (p2) {
      if (Array.isArray(p2)) {
        this.direction = Math.atan2(p2[1] - this.y, p2[0] - this.x);
        this.magnitude = Math.sqrt(
          (p2[0] - this.x) ** 2 + (p2[1] - this.y) ** 2
        );
      } else {
        this.direction = Math.atan2(p2.y - this.y, p2.x - this.x);
        this.magnitude = Math.sqrt((p2.x - this.x) ** 2 + (p2.y - this.y) ** 2);
      }
    } else {
      if (Array.isArray(p1)) {
        this.direction = p1[2] ?? 0;
        this.magnitude = p1[3] ?? 0;
      } else {
        this.direction = p1.direction ?? 0;
        this.magnitude = p1.magnitude ?? 0;
      }
    }
  }
}
