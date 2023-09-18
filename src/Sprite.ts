import { GameObject } from "./GameObject";
import { Instance } from "./Instance";
import { Vector, VectorLike } from "./Vector";

type Options = {
  x: number;
  y: number;
  z?: number;
  width: number;
  height: number;
  src: string;
  frame?: number;
  scale?: VectorLike;
};

export abstract class Sprite extends GameObject {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  width: number = 0;
  height: number = 0;
  image: HTMLImageElement;
  frames: number = 0;
  scale: Vector;
  frame: number = 0;
  instance: Instance;

  constructor(instance: Instance, options: Options) {
    super(instance.canvas, false);

    this.instance = instance;
    this.x = options.x;
    this.y = options.y;
    this.z = options.z ?? 0;
    this.width = options.width;
    this.height = options.height;
    this.frame = options.frame ?? 0;

    this.scale = new Vector(options.scale ?? [1, 1]);

    this.image = new Image();
    this.image.src = options.src;

    this.image.onload = () => {
      this.frames = Math.floor(this.image.width / options.width);
    };
  }

  draw(ctx: CanvasRenderingContext2D, frame: number = this.frame) {
    if (!this.image) return;

    ctx.drawImage(
      this.image,
      this.width * frame,
      0,
      this.width,
      this.height,
      this.x - (this.width * this.scale.x) / 2,
      this.y - (this.height * this.scale.y) / 2,
      this.width * this.scale.x,
      this.height * this.scale.y
    );

    this.frame = frame;
  }

  /**
   * Move the sprite to the top of the render stack
   */
  toTop() {
    const highest = Array.from(this.instance.sprites).reduce((a, b) => {
      if (a.z > b.z) return a;
      return b;
    }).z;
    this.z = highest + 1;
  }

  /**
   * Move the sprite to the bottom of the render stack
   */
  toBottom() {
    const lowest = Array.from(this.instance.sprites).reduce((a, b) => {
      if (a.z < b.z) return a;
      return b;
    }).z;
    this.z = lowest - 1;
  }
}
