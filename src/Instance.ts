import { GameObject } from "./GameObject";
import { Sprite } from "./Sprite";
import { Vector } from "./Vector";

export abstract class Instance extends GameObject {
  paused: boolean = false;
  drawSprites: boolean = true;
  maxFPS: number = Infinity;
  fps: number = 0;
  debug: boolean = false;
  debugColor: string = "black";
  sprites: Set<Sprite>;
  scale: Vector;
  keyboard: { [key: string]: boolean } = {};
  private lastFrame: number;
  private frameTimes: number[];

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, false);

    this.sprites = new Set();
    this.scale = new Vector([1, 1]);

    this.lastFrame = performance.now();
    this.frameTimes = [];

    this.setup();

    requestAnimationFrame(this.draw.bind(this));
  }

  draw(time: DOMHighResTimeStamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.drawSprites) {
      for (const sprite of Array.from(this.sprites).sort((a, b) => a.z - b.z)) {
        sprite.draw(this.ctx);
      }
    }

    if (this.update)
      this.update(time - this.lastFrame, this.canvas.width, this.canvas.height);

    for (const sprite of Array.from(this.sprites).sort((a, b) => a.z - b.z)) {
      if (sprite.update)
        sprite.update(
          time - this.lastFrame,
          this.canvas.width,
          this.canvas.height
        );
    }

    // Draw the debugger
    if (this.debug) this.#drawDebugger();

    // Sample the last 5 seconds
    this.frameTimes.push(time - this.lastFrame);
    if (this.frameTimes.length > 60 * 5) {
      this.frameTimes.shift();
    }

    // Calculate the FPS
    this.fps = Math.floor(
      1000 /
        (this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length)
    );

    this.lastFrame = time;

    // Wait until the next frame
    setTimeout(
      () => {
        requestAnimationFrame(this.draw.bind(this));
      },
      1000 / this.maxFPS - (performance.now() - time)
    );
  }

  #drawDebugger() {
    this.ctx.font = "16px Monospace";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
  }

  /**
   * Get the current image data of the canvas
   *
   * @param colorSpace The color space of the image data
   */
  screenshot(colorSpace?: PredefinedColorSpace) {
    return this.ctx.createImageData(this.canvas.width, this.canvas.height, {
      colorSpace
    });
  }

  /**
   * Add a sprite to the game
   */
  addSprite(sprite: Sprite) {
    this.sprites.add(sprite);
  }
}
