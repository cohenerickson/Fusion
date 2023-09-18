import { Vector } from "./Vector";

export interface GameObject {
  /**
   * Called every frame
   *
   * @param delta The time since the last frame in milliseconds
   * @param width The width of the canvas
   * @param height The height of the canvas
   */
  update?(delta: number, width: number, height: number): void;

  /**
   * Called when the mouse is moved
   *
   * @param vec The vector of the mouse
   */
  mouseMoved?(vec: Vector): void;

  /**
   * Called when the mouse is pressed
   *
   * @param vec The vector of the mouse
   * @param button The button that was clicked
   */
  mouseDown(vec: Vector, button: number): void;

  /**
   * Called when the mouse is released
   *
   * @param vec The vector of the mouse
   * @param button The button that was released
   * @param held How long the button was held for
   */
  mouseUp(vec: Vector, button: number, held: number): void;

  /**
   * Called when a key is pressed
   *
   * @param key The key that was pressed
   */
  keyDown(key: string): void;

  /**
   * Called when a key is released
   */
  keyUp(key: string): void;

  /**
   * Called when the mouse is scrolled
   */
  wheel?(vec: Vector, delta: number): void;
}

export abstract class GameObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: Vector;
  keyboard: { [key: string]: boolean } = {};
  private static objects: Set<GameObject> = new Set();

  constructor(canvas: HTMLCanvasElement, setup: boolean = true) {
    GameObject.objects.add(this);
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d")!;

    this.resize();
    window.addEventListener("resize", this.resize.bind(this));

    this.mouse = new Vector([0, 0]);

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

      if (this.mouseMoved) this.mouseMoved(this.mouse);
    });

    window.addEventListener("keydown", (e) => {
      this.keyboard[e.key.toLowerCase()] = true;

      if (this.keyDown) this.keyDown(e.key.toLowerCase());
    });

    window.addEventListener("keyup", (e) => {
      this.keyboard[e.key.toLowerCase()] = false;

      if (this.keyUp) this.keyUp(e.key.toLowerCase());
    });

    window.addEventListener("mousedown", (e) => {
      if (this.mouseDown) this.mouseDown(this.mouse, e.button);
    });

    window.addEventListener("mouseup", (e) => {
      if (this.mouseUp)
        this.mouseUp(this.mouse, e.button, e.timeStamp - e.timeStamp);
    });

    window.addEventListener("wheel", (e) => {
      if (this.wheel) this.wheel(this.mouse, e.deltaY);
    });

    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    if (setup) {
      this.setup();
    }
  }

  private resize() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;

    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Called on initialisation
   */
  abstract setup(): Promise<void> | void;
}
