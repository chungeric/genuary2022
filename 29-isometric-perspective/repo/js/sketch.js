let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});
let numRows = 13;
let numCols = 13;
let palettes = [
  ["#d6eb1c", "#f0a211", "#d43f2f"],
  ["#36a855", "#25743a", "#184e27"],
];

function setup() {
  createCanvas(600, 600);
  noLoop();
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  background(92, 118, 196);

  for (let i = 1; i < numRows; i++) {
    for (let j = 1; j < numCols; j++) {
      let x = (width / numCols) * j;
      let y = (height / numRows) * i;
      isoCube(x, y, 20);
    }
  }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function isoCube(cx, cy, size = 50) {
  let a1 = radians(210);
  let a2 = radians(330);
  let v1 = createVector(cx, cy + size);
  let v2 = createVector(cx + cos(a1) * size, cy + sin(a1) * size);
  let v3 = createVector(cx + cos(a2) * size, cy + sin(a2) * size);
  let palette = random(palettes);
  strokeWeight(3);
  noStroke();
  fill(palette[2]);

  // left face
  beginShape();
  vertex(cx, cy);
  vertex(v1.x, v1.y);
  vertex(v2.x, v2.y + size);
  vertex(v2.x, v2.y);
  vertex(cx, cy);
  endShape();

  // right face
  fill(palette[1]);
  beginShape();
  vertex(cx, cy);
  vertex(v1.x, v1.y);
  vertex(v3.x, v3.y + size);
  vertex(v3.x, v3.y);
  vertex(cx, cy);
  endShape();

  // top face
  fill(palette[0]);
  beginShape();
  vertex(cx, cy);
  vertex(v2.x, v2.y);
  vertex(v2.x + cos(a2) * size, v2.y + sin(a2) * size);
  vertex(v3.x, v3.y);
  vertex(cx, cy);
  endShape();

  // line(cx, cy, v1.x, v1.y);
  // line(cx, cy, v2.x, v2.y);
  // line(cx, cy, v3.x, v3.y);
  // line(v2.x, v2.y, v2.x, v2.y + size);
  // line(v1.x, v1.y, v2.x, v2.y + size);
  // line(v3.x, v3.y, v3.x, v3.y + size);
  // line(v1.x, v1.y, v3.x, v3.y + size);
  // line(v2.x, v2.y, v2.x + cos(a2) * size, v2.y + sin(a2) * size);
  // line(v3.x, v3.y, v3.x + cos(a1) * size, v3.y + sin(a1) * size);
}
