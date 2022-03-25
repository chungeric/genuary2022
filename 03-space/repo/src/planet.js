import { drawCircle } from "./utils/draw";
import { rr } from "./utils/math";

export class Planet {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = rr(0, this.ctx.canvas.clientWidth);
    this.y = rr(0, this.ctx.canvas.clientHeight);
    this.brightness = rr(50, 100);
    this.hue = rr(0, 360);
    this.radius = rr(1, 2);
  }

  draw = () => {
    drawCircle(this.ctx, this.x, this.y, this.radius);
    this.ctx.fillStyle = `hsl(${this.hue}, 70%, ${this.brightness}%)`;
    this.ctx.fill();
  };
}
