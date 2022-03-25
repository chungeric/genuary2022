import { drawCircle } from "./utils/draw";
import { rr } from "./utils/math";

export class Moon {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = rr(0 + 60, this.ctx.canvas.clientWidth - 60);
    this.y = rr(0 + 100, this.ctx.canvas.clientHeight / 2);
    this.radius = 40;
    // this.phaseX = this.x + rr(0, this.radius * 2);
    // this.phaseY = this.y + rr(0, this.radius * 2);
    // this.craters = [];
    // for (let i = 0; i < 1; i++) {
    //   let x = rr(this.x - this.radius, this.x + this.radius);
    //   let y = rr(this.y - this.radius, this.y + this.radius);
    //   this.craters.push({ x, y });
    // }
  }

  draw = () => {
    this.drawSurface();
    // this.drawPhase();
  };

  drawPhase() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.9;
    drawCircle(this.ctx, this.phaseX, this.phaseY, this.radius);
    this.ctx.clip();
    drawCircle(this.ctx, this.x, this.y, this.radius);
    this.ctx.fillStyle = "#111";
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
    this.ctx.restore();
  }

  drawSurface = () => {
    drawCircle(this.ctx, this.x, this.y, this.radius);
    let gradient = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, "#eee");
    gradient.addColorStop(0.7, "#bbb");
    gradient.addColorStop(1, "#999");
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  };

  // getRadialGradient = (x, y, radius) => {
  //   let gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
  //   gradient.addColorStop(0, "#fff");
  //   gradient.addColorStop(0.5, "#eee");
  //   gradient.addColorStop(1, "#bbb");
  //   return gradient;
  // };

  // drawCraters = () => {
  //   for (let i = 0; i < this.craters.length; i++) {
  //     let x = this.craters[i].x;
  //     let y = this.craters[i].y;
  //     let r = this.radius / 3;
  //     drawCircle(this.ctx, x, y, r);
  //     this.ctx.fillStyle = this.getRadialGradient(x, y, r);
  //     this.ctx.fill();
  //   }
  // };
}
