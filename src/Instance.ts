import { Sprite } from "./Sprite";
import { Vector } from "./Vector";

export abstract class Instance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  paused: boolean = false;
  drawSprites: boolean = true;
  maxFPS: number = Infinity;
  fps: number = 0;
  debug: boolean = false;
  debugColor: string = "black";
  sprites: Sprite[] = [];
  mouse: Vector = new Vector({ x: 0, y: 0 });
  scale: Vector;
  keyboard: { [key: string]: boolean } = {};

  constructor(query: string) {
    const canvas = document.querySelector(query);

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`No canvas found with query "${query}"`);
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      this.scale = new Vector({
        x: canvas.offsetWidth / canvas.width,
        y: canvas.offsetHeight / canvas.height
      });

      if (this.ctx) this.ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.onresize = resize;

    this.canvas = canvas;

    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    ctx.imageSmoothingEnabled = false;

    this.ctx = ctx;

    this.#init();
  }

  async #init() {
    // When the mouse is moved, update the mouse position
    this.canvas.addEventListener("mousemove", (e) => {
      let rect = this.canvas.getBoundingClientRect();

      this.mouse = new Vector(
        {
          x:
            ((e.clientX - rect.left) / (rect.right - rect.left)) *
            this.canvas.width,
          y:
            ((e.clientY - rect.top) / (rect.bottom - rect.top)) *
            this.canvas.height
        },
        {
          x: this.mouse.x,
          y: this.mouse.y
        }
      );

      this.mouseMoved(this.mouse);
    });

    window.addEventListener("keydown", (e) => {
      this.keyboard[e.key.toLowerCase()] = true;

      this.keyPressed(e.key.toLowerCase());
    });

    window.addEventListener("keyup", (e) => {
      this.keyboard[e.key.toLowerCase()] = false;

      this.keyReleased(e.key.toLowerCase());
    });

    await this.setup();

    this.#loop();
  }

  #loop() {
    let last = performance.now();
    let frameTimes: number[] = [];

    const loop = (time: number) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.drawSprites) {
        for (const sprite of this.sprites) {
          sprite?.draw(this.ctx);
        }
      }

      this.update(time - last, this.canvas.width, this.canvas.height);

      // Draw the debugger
      if (this.debug) this.#drawDebugger();

      // Sample the last 5 seconds
      frameTimes.push(time - last);
      if (frameTimes.length > 60 * 5) {
        frameTimes.shift();
      }

      // Calculate the FPS
      this.fps = Math.floor(
        1000 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length)
      );

      last = time;

      // Wait until the next frame
      setTimeout(
        () => {
          requestAnimationFrame(loop);
        },
        1000 / this.maxFPS - (performance.now() - time)
      );
    };

    requestAnimationFrame(loop);
  }

  #drawDebugger() {
    this.ctx.font = "16px Monospace";
    this.ctx.fillStyle = this.debugColor;
    this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
  }

  /**
   * Get the current image data of the canvas
   */
  screenshot() {
    return this.ctx.createImageData(this.canvas.width, this.canvas.height);
  }

  /**
   * Add a sprite to the game
   */
  addSprite(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  /**
   * Called when the game is loaded
   */
  abstract setup(): Promise<void> | void;

  /**
   * Called every frame
   *
   * @param delta The time since the last frame in milliseconds
   * @param width The width of the canvas
   * @param height The height of the canvas
   */
  update(delta: number, width: number, height: number): void {}

  /**
   * Called when the mouse is moved
   *
   * @param vec The vector of the mouse
   */
  mouseMoved(vec: Vector): void {}

  /**
   * Called when the mouse is pressed
   *
   * @param vec The vector of the mouse
   * @param button The button that was clicked
   */
  mouseClicked(vec: Vector, button: number): void {}

  /**
   * Called when the mouse is released
   *
   * @param vec The vector of the mouse
   * @param button The button that was released
   * @param held How long the button was held for
   */
  mouseReleased(vec: Vector, button: number, held: number): void {}

  /**
   * Called when a key is pressed
   *
   * @param key The key that was pressed
   */
  keyPressed(key: string): void {}

  /**
   * Called when a key is released
   */
  keyReleased(key: string): void {}
}
