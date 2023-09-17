export type VecInit = { x: number; y: number } | Vector;

export class Vector {
  x: number;
  y: number;
  direction: number = 0;
  magnitude: number = 0;

  constructor(p1: VecInit, p2?: VecInit) {
    this.x = p1.x;
    this.y = p1.y;

    if (p2) {
      this.direction = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      this.magnitude = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
  }
}
