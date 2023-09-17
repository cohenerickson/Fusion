import { NO_TEXTURE } from "./util";

type Options = {
  x: number;
  y: number;
  z?: number;
  width: number;
  height: number;
  src: string;
  frame?: number;
  scale?: [number, number];
};

export class Sprite {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  width: number = 0;
  height: number = 0;
  image: HTMLImageElement;
  frames: number = 0;
  scaleX: number = 1;
  scaleY: number = 1;
  frame: number = 0;

  constructor(options: Options) {
    this.x = options.x;
    this.y = options.y;
    this.z = options.z ?? 0;
    this.width = options.width;
    this.height = options.height;
    this.frame = options.frame ?? 0;

    if (options.scale) {
      this.scaleX = options.scale[0];
      this.scaleY = options.scale[1];
    }

    const image = new Image();
    image.src = options.src;

    image.onload = () => {
      this.image = image;

      this.frames = Math.floor(image.width / options.width);
    };

    image.onerror = () => {
      console.warn(`Could not load image "${options.src}"`);
      image.src = NO_TEXTURE;

      setInterval(() => {
        this.frame = this.frame === 0 ? 1 : 0;
      }, 1000);
    };

    this.setup();
  }

  /**
   * Called when the sprite is created
   */
  setup(): void | Promise<void> {}

  draw(ctx: CanvasRenderingContext2D, frame: number = this.frame) {
    if (!this.image) return;

    // interpolate the new position

    ctx.drawImage(
      this.image,
      this.width * frame,
      0,
      this.width,
      this.height,
      this.x - (this.width * this.scaleX) / 2,
      this.y - (this.height * this.scaleY) / 2,
      this.width * this.scaleX,
      this.height * this.scaleY
    );

    this.frame = frame;
  }
}
