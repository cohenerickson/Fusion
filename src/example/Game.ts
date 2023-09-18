import { Instance, Vector } from "..";
import { Player } from "./Player";

export class Game extends Instance {
  debug = true;

  setup() {
    this.addSprite(new Player(this));
  }
}
