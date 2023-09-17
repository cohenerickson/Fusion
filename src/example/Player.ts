import { Sprite } from "../";

export class Player extends Sprite {
  constructor() {
    super({
      src: "./player.png",
      x: 100,
      y: 100,
      width: 16,
      height: 16,
      scale: [4, 4]
    });
  }

  setup() {}
}
