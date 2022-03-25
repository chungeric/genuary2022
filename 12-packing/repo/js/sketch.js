let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let circles = [];
let xSpeed = 1; //3
let ySpeed = 1; //1
let dx = 0;
let dy = 0;
let noiseScale = 0.005;
let bgColor;
let strokeColor;
let rareColor;
let lineWeight = 2;

function setup() {
  createCanvas(500, 500);
  frameRate(60);
  // noLoop();
  // pixelDensity(1);
  bgColor = color(237, 237, 225);
  strokeColor = color(118, 177, 194);
  rareColor = color(191, 152, 61);
  // bgColor = color(0);
  // strokeColor = color(255);
  // rareColor = color(20, 255, 36);
  noiseSeed(random(100000));
}

function draw() {
  if (capture && frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    if (c.offscreen()) {
      circles.splice(i, 1);
    }
  }

  background(bgColor);
  let total = 8;
  let count = 0;
  let attempts = 0;
  while (count < total) {
    let newC = newCircle();
    if (newC !== null) {
      circles.push(newC);
      count++;
    }
    attempts++;
    if (attempts > 100) {
      break;
    }
  }
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    c.x += xSpeed;
    c.y += ySpeed;
    if (c.growing) {
      if (c.edges()) {
        c.growing = false;
      } else {
        for (let j = 0; j < circles.length; j++) {
          let other = circles[j];
          if (c !== other) {
            let d = dist(c.x, c.y, other.x, other.y);
            if (d - lineWeight * 2 < c.r + other.r) {
              c.growing = false;
              break;
            }
          }
        }
      }
    }
    c.show();
    c.grow();
  }
  dx += xSpeed;
  dy += ySpeed;

  // if (frameCount % 60 == 0) {
  //   frameCount = 0;
  //   circles = [];
  //   noiseSeed(random(100000));
  // }

  // save captures
  if (capture) {
    capturer.capture(canvas);
  }
}

function newCircle() {
  let x = random(width);
  let y = random(height);
  let n = noise((x - dx) * noiseScale, (y - dy) * noiseScale);
  let valid = true;
  if (n > 0.45) {
    return null;
  }
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(x, y, c.x, c.y);
    if (d - lineWeight * 2 < c.r) {
      valid = false;
      break;
    }
  }
  if (valid) {
    return new Circle(x, y);
  } else {
    return null;
  }
}

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 1;
    this.growing = true;
    this.rare = random() > 0.965;
  }
  grow = () => {
    if (this.growing) {
      this.r = this.r + 1;
    }
  };
  edges = () => {
    return (
      this.x + this.r > width ||
      this.x - this.r < 0 ||
      this.y + this.r > height ||
      this.y - this.r < 0
    );
  };
  offscreen = () => {
    return (
      this.x - this.r > width ||
      this.x + this.r < 0 ||
      this.y - this.r > height ||
      this.y + this.r < 0
    );
  };
  show = () => {
    let color = this.rare
      ? rareColor
      : lerpColor(bgColor, strokeColor, this.r / 18);
    stroke(color);
    strokeWeight(lineWeight);
    noFill();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  };
}

function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
    circles = [];
    capture = true;
    document.getElementById("toggle-capture").value =
      "Saving Frames... Press Again to Stop";
  } else {
    noLoop();
    capturer.stop();
    capturer.save();
  }
}

function cancelCapture() {
  location.reload();
  noiseSeed(random(100000));
}
