import { Game } from "./Game";

const game = new Game(document.querySelector<HTMLCanvasElement>("#game")!);

// @ts-ignore
window.game = game;
