import { Instance, Sprite, Vector } from "..";

export class Player extends Sprite {
  constructor(instance: Instance) {
    super(instance, {
      src: "./player.png",
      x: 0,
      y: 0,
      width: 16,
      height: 16,
      scale: [4, 4]
    });
  }

  setup() {}

  update(delta: number) {
    if (this.keyboard["w"] || this.keyboard["arrowup"]) this.y -= 0.5 * delta;
    if (this.keyboard["a"] || this.keyboard["arrowleft"]) this.x -= 0.5 * delta;
    if (this.keyboard["s"] || this.keyboard["arrowdown"]) this.y += 0.5 * delta;
    if (this.keyboard["d"] || this.keyboard["arrowright"])
      this.x += 0.5 * delta;
  }
}
