import { rr } from "./utils/math";

export class Galaxy {
  constructor(ctx) {
    this.ctx = ctx;
    let margin = 50;
    this.x = rr(margin, this.ctx.canvas.clientWidth - margin);
    this.y = rr(margin, this.ctx.canvas.clientHeight - margin);
    this.hue = rr(0, 360);
    this.rotation = rr(0, Math.PI * 2);
    this.len = rr(100, 300);
  }

  draw = () => {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.rotation);
    this.ctx.transform(1, 0.9, 0, 1, 0, 0);
    this.ctx.translate(-this.x, -this.y);
    this.ctx.moveTo(this.x, this.y);
    this.ctx.beginPath();
    for (let i = 0; i < this.len; i++) {
      let angle = 0.1 * i;
      let x = this.x + (1 + angle) * Math.cos(angle);
      let y = this.y + (1 + angle) * Math.sin(angle);
      this.ctx.lineTo(x, y);
    }
    this.ctx.strokeStyle = `hsl(${this.hue}, 50%, 50%)`;
    this.ctx.stroke();
    this.ctx.restore();
  };
}
