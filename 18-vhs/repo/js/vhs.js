// let palette = ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"];
let palette = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];

class VHS {
  constructor(x, y, w, topdown = true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = this.w / 2;
    this.topdown = topdown;
    this.color = palette[round(random(palette.length - 1))];
  }

  // intersects = (vhs) => {
  //   return vhs.x > this.x && vhs.x < this.x + this.w;
  // };

  show = () => {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    if (this.topdown) {
      fill(this.color);
      rect(x, y, w, h, 2);
      x += w * 0.1;
      y += h * 0.25;
      w -= w * 0.1 * 2;
      h -= h * 0.25 * 2;
      // rect(x, y, w, h);
      fill(230);
      rect(x, y, w, h, 8);
      // rect(x + w * 0.18, y + h * 0.2, w - w * 0.18 * 2, h - h * 0.2 * 2, 30);
      x += w * 0.3;
      w -= w * 0.3 * 2;
      // circle(x - 1, y + h / 2, h - 10);
      // circle(x + w + 1, y + h / 2, h - 10);
      fill(this.color);
      rect(x, y, w, h);
    } else {
      let h = w / 4.5;
      fill(this.color);
      rect(x, y, w, h, 2);
      x += w * random(0.2, 0.35);
      y += h * 0.2;
      w -= w * 0.2 * 2;
      h -= h * 0.2 * 2;
      fill(230);
      rect(x, y, w, h, 2);
    }
  };
}
