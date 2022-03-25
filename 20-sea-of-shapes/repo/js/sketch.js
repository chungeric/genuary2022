let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let textureNoiseScale = 0.02;
let waveNoiseScale = 0.002;
let numWaves = 15; // 13
let id = 0;
let count = 0;
// let palette = ["#072227", "#35858B", "#4FBDBA", "#AEFEFF"];
let palette = [
  "#03045E",
  "#023E8A",
  "#0077B6",
  "#0096C7",
  "#00B4D8",
  "#48CAE4",
  "#90E0EF",
  "#ADE8F4",
  "#CAF0F8",
];
let waveColor;

function setup() {
  createCanvas(600, 600);
  noStroke();
  noLoop();
  rectMode(CENTER);
  waveColor = random(palette);
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  background(random(palette));
  for (let i = 1; i < numWaves; i++) {
    waveShape(0, (height / numWaves) * i, width, (height / numWaves) * i);
    id = i;
  }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function waveShape(x1, y1, x2, y2) {
  if (id % 2 == 0) {
    waveColor = random(palette);
  }
  let d = dist(x1, y1, x2, y2);
  let numPoints = d;
  beginShape();
  for (let i = 0; i <= numPoints; i++) {
    let x = lerp(x1, x2, i / numPoints);
    let y = lerp(y1, y2, i / numPoints);
    let n = noise(y + x * waveNoiseScale);
    let v = height / 20;
    let newY = map(n, 0, 1, y - v, y + v);
    vertex(x, newY);
    let w = 30;
    if (random() < 0.02 && count > w * 1.6 && x > w && x < width - w) {
      fill(random(palette));
      let r = random();
      if (r < 0.5) {
        circle(x, newY, w);
      } else {
        push();
        translate(x, newY);
        rotate(random(TWO_PI));
        square(0, 0, w);
        pop();
      }
      // else {
      //   push();
      //   translate(x, newY);
      //   rotate(random(TWO_PI));
      //   triangle(-(w / 5) * 3, 10, (w / 5) * 3, 10, 0, (-w / 5) * 4);
      //   pop();
      // }

      count = 0;
    }
    count++;
  }
  vertex(width, height);
  vertex(0, height);
  fill(waveColor);
  endShape(CLOSE);
}
