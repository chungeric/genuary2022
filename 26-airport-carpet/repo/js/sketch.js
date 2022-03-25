let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let detail = 20;
let weight = 36;
let myBlue, myRed, orange, yellow, grey, darkgrey, darkblue, myGreen;
let iters = 200;

function setup() {
  createCanvas(1200, 1200);
  pixelDensity(1);
  noLoop();
  // frameRate(5);
  myBlue = color(90, 149, 184);
  darkblue = color(82, 94, 163);
  myRed = color(194, 85, 85);
  orange = color(243, 168, 59);
  yellow = color(211, 217, 48);
  grey = color(189);
  myGreen = color(77, 117, 111);
  background(grey);
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  stroke(myBlue);
  strokeWeight(weight);
  for (let i = 0; i < iters; i++) {
    for (let row = 0; row < detail; row++) {
      stroke(myBlue);
      if ((random() < 0.4 && i !== iters - 1) || random() < 0.95) continue;
      if (i !== iters - 1) randomness();
      let y = (height / detail) * row;
      let x = width - (width / detail) * row;
      line(0, y, x, height);
    }
    for (let col = 0; col < detail; col++) {
      stroke(myBlue);
      if ((random() < 0.4 && i !== iters - 1) || random() < 0.95) continue;
      if (i !== iters - 1) randomness();
      let x = (width / detail) * col;
      let y = height - (height / detail) * col;
      line(x, 0, width, y);
    }
    for (let row = 0; row < detail; row++) {
      stroke(myBlue);
      if ((random() < 0.6 && i !== iters - 1) || random() < 0.95) continue;
      if (i !== iters - 1) randomness();
      let y = height - (height / detail) * row;
      let x = width - (width / detail) * row;
      line(0, y, x, 0);
    }
    for (let col = 0; col < detail; col++) {
      stroke(myBlue);
      if ((random() < 0.6 && i !== iters - 1) || random() < 0.95) continue;
      if (i !== iters - 1) randomness();
      let y = (height / detail) * col;
      let x = (width / detail) * col;
      line(x, height, width, y);
    }
  }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function randomness() {
  if (random() < 0.1) stroke(myRed);
  else if (random() < 0.1) stroke(yellow);
  else if (random() < 0.1) stroke(grey);
  else if (random() < 0.1) stroke(myGreen);
  else if (random() < 0.1) stroke(darkblue);
}
