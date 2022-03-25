class Ball {
  constructor(x, r, color = 255, offset = 0) {
    this.x = x;
    this.y = 0;
    this.r = r;
    this.offset = offset;
    this.color = color;
    // this.speed = map(random(), 0, 1, 1, 3);
    // this.jumpHeight = map(random(), 0, 1, height/3, height);
    // this.jumpFrequency = map(random(), 0, 1, 1, 3);
    this.speed = 30;
    this.jumpHeight = height;
    this.jumpFrequency = 0.6;
  }
  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.r * 2);
  }
}
