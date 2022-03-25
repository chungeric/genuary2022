let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});
let numFrames = 230;

// let done = false;

let numCols = 10;
let items = [];

function setup() {
  createCanvas(800, 800);
  // noLoop();
  background(230);
  strokeWeight(2);

  let w = width / numCols;

  for (let y = 0; y < height; y += w / 2) {
    for (let col = 0; col < numCols; col++) {
      let x = col * w;
      items.push(new VHS(x, y, w, random() > 0.4));
    }
  }

  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height);
    strokeWeight(random(1.2));
    stroke(`rgba(0,0,0,${random(0.2, 0.9)})`);
    line(x, y, x + random(-2, 2), y + random(-2, 2));
  }
}

let id = 0;

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  translate(width * 0.05, height * 0.05);
  // background(230);
  if (id < items.length) {
    scale(0.9);
    strokeWeight(2);
    stroke(0);
    items[id].show();
    id++;
  } else {
    noLoop();
  }
  // for (let i = 0; i < items.length; i++) {
  //   scale(0.9);
  //   items[i].show();
  // }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
    if (frameCount == numFrames) {
      capturer.stop();
      capturer.save();
      noLoop();
    }
  }
}
