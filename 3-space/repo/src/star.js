import { drawCircle } from "./utils/draw";
import { rr } from "./utils/math";

export class Star {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = rr(0, this.ctx.canvas.clientWidth);
    this.y = rr(0, this.ctx.canvas.clientHeight);
    this.brightness = rr(0, 100);
    this.radius = rr(0.3, 0.8);
    this.canTwinkle = Math.random() > 0.9;
  }

  twinkle = () => {
    this.brightness = rr(0, 100);
  };

  draw = () => {
    if (this.canTwinkle && Math.random() > 0.95) this.twinkle();
    drawCircle(this.ctx, this.x, this.y, this.radius);
    this.ctx.fillStyle = `hsl(0, 0%, ${this.brightness}%)`;
    this.ctx.fill();
  };
}
