let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 3,
});

let xDivisions;
let yDivisions = 1;
let xMargin = 0.1;
let yMargin = 0.1;

function setup() {
  createCanvas(800, 80);
  frameRate(3);
  xDivisions = width / height;
  noStroke();
}

function draw() {
  if (capture && frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }

  background(240, 240, 230);
  let xSize = width / xDivisions;
  let ySize = height / yDivisions;
  for (let xDiv = 0; xDiv < xDivisions; xDiv++) {
    for (let yDiv = 0; yDiv < yDivisions; yDiv++) {
      for (let i = 0; i < (xDiv + 1) * 3; i++) {
        let left = xSize * xDiv;
        let right = xSize * (xDiv + 1);
        let top = ySize * yDiv;
        let bottom = ySize * (yDiv + 1);
        let w = right - left;
        let h = bottom - top;
        left += w * xMargin;
        right -= w * xMargin;
        top += h * yMargin;
        bottom -= h * yMargin;
        let x1 = map(random(), 0, 1, left, right);
        let y1 = map(random(), 0, 1, top, bottom);
        let x2 = map(random(), 0, 1, left, right);
        let y2 = map(random(), 0, 1, top, bottom);
        stroke(
          xDiv % 2 === 0 ? random(255) : `hsl(${round(random(360))}, 80%, 50%)`
        );
        dottedLine(x1, y1, x2, y2);
      }
    }
  }

  // save captures
  if (capture) {
    capturer.capture(canvas);
  }
}

function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
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
