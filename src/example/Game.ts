import { Instance, Vector } from "..";
import { Player } from "./Player";

export class Game extends Instance {
  debug = true;
  player: Player = new Player();

  setup() {
    //this.player = new Player();

    this.addSprite(this.player);
  }
  
  update(delta: number) {
    if (this.keyboard.w || this.keyboard.arrowup) {
      this.player.y -= 0.5 * delta;
    }
    if (this.keyboard.a || this.keyboard.arrowleft) {
      this.player.x -= 0.5 * delta;
    }
    if (this.keyboard.s || this.keyboard.arrowdown) {
      this.player.y += 0.5 * delta;
    }
    if (this.keyboard.d || this.keyboard.arrowright) {
      this.player.x += 0.5 * delta;
    }
  }
}
