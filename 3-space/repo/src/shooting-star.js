import { drawCircle } from "./utils/draw";
import { rr } from "./utils/math";

export class ShootingStar {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = rr(
      this.ctx.canvas.clientWidth / 4,
      (this.ctx.canvas.clientWidth / 4) * 3
    );
    this.y = -20;
    this.radius = 1;
    this.speed = 30;
    this.angle = rr(Math.PI / -3, Math.PI / 3);
    this.tail = [{ x: this.x, y: this.y }];
    this.tailLength = 60;
  }
  draw = () => {
    if (this.y > this.ctx.canvas.clientHeight + this.tailLength * 2) {
      this.x = rr(
        this.ctx.canvas.clientWidth / 4,
        (this.ctx.canvas.clientWidth / 4) * 3
      );
      this.y = -20;
      this.angle = rr(Math.PI / -4, Math.PI / 4);
    }
    for (let i = 0; i < this.speed; i++) {
      for (let j = 0; j < this.tail.length; j++) {
        drawCircle(
          this.ctx,
          this.tail[j].x,
          this.tail[j].y,
          this.radius * 1 - (j + 1) / this.tail.length
        );
        this.ctx.fillStyle = `rgba(255,255,255,${1 - j / this.tail.length})`;
        this.ctx.fill();
      }
      this.x += Math.sin(this.angle);
      this.y += Math.cos(this.angle);
      this.tail.unshift({ x: this.x, y: this.y });
      if (this.tail.length > this.tailLength) {
        this.tail.pop();
      }
    }
  };
  getTail = () => {
    return this.tail;
  };
}
