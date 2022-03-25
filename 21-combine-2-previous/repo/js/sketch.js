let textureNoiseScale = 0.02;
let waveNoiseScale = 0.002;
let pixelNoiseScale = 0.001;
let numWaves = 15;
let id = 0;
let count = 0;
// let palette = ["#072227", "#35858B", "#4FBDBA", "#AEFEFF"];
let palette = [
  "#03045E", // 3, 4, 94
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
  createCanvas(1000, 1000);
  noStroke();
  noLoop();
  rectMode(CENTER);
  // colorMode(HSB, 360, 100, 100);
  pixelDensity(1);
  waveColor = random(palette);
}

function draw() {
  background(random(palette));
  for (let i = 1; i < numWaves; i++) {
    waveShape(0, (height / numWaves) * i, width, (height / numWaves) * i);
    id = i;
  }
}

function makeSandy() {
  let d = pixelDensity();
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = 4 * d * (y * d * width + x);
      let dark = random() < 0.1;
      let darkCol = color(palette[0]);
      let pixelCol = get(x, y);

      let h = round(lerp(29, 36, random()));
      let s = saturation(pixelCol);
      let v = 5;
      let l = lightness(pixelCol) + (dark ? random(-5, -15) : random(-v, v));

      let n = noise(x * pixelNoiseScale, y * pixelNoiseScale);
      let nn = map(n, 0, 1, 0.5, 1);

      let newCol = color(`hsl(${h}, ${s}%, ${constrain(l, 0, 100) * nn}%)`);

      pixels[i] = red(newCol);
      pixels[i + 1] = green(newCol);
      pixels[i + 2] = blue(newCol);
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
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
    let v = height / 33;
    let newY = map(n, 0, 1, y - v, y + v);
    vertex(x, newY);
    let w = 50;
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
