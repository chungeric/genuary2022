let fps = 20;
let numFrames = 17;
let capture = false; // default is to not capture frames, can be changed with button in browser
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: fps,
});
let fontSize = 32; // 32
let xStep = 25; // 25
let yStep = fontSize;
let t = 0;
let numRows;
let numCols;
let columns = [];
let chars = ["9", "+", "1", "0", "=", "2", "1"];
let offsets = [
  2, 1, 9, 3, 2, 9, 12, 16, 5, 8, 14, 14, 5, 11, 10, 6, 12, 6, 4, 1, 13,
];
let bgColor;
let textColor;
let font;

function preload() {
  font = loadFont("jetbrains.ttf");
}

function setup() {
  createCanvas(500, 500);
  frameRate(fps);
  textSize(fontSize);
  textFont(font);
  textAlign(CENTER); // needed for nice alignment
  numRows = round(height / yStep);
  numCols = round(width / xStep);
  bgColor = color(219, 237, 19);
  textColor = color(43);
  for (let i = 0; i <= numCols; i++) {
    columns.push({
      // offset: offsets[i], // needs to be an int for perfect looping
      offset: round(random(500)),
      // speed: map(random(), 0, 1, 0.5, 4),
      // m: map(random(), 0, 1, 1, 1), // potential wait time
    });
  }
}

function draw() {
  if (capture && frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }

  background(bgColor);

  let id = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col <= numCols; col++) {
      let x = col * xStep;
      let y = (row + 1) * yStep - 10; // 15 is a manual offset/adjustment
      // let m = columns[col].m;
      let fillColor = lerpColor(
        textColor,
        bgColor,
        constrain(
          (abs(row - t - columns[col].offset) % numRows) / numRows,
          0,
          1
        )
      );
      fill(fillColor);
      text(chars[(id + row) % chars.length], x, y);

      /* Some cool animations by tweaking offsets */
      // columns[col].offset = col * (t * 0.05);
      columns[col].offset = col * t;
      // columns[col].offset = col * sin(t*0.1);
      // columns[col].offset =
      // columns[col].offset = -

      id++;
    }
  }

  t += 1;

  // save captures
  if (capture) {
    capturer.capture(canvas);
    if (frameCount == numFrames) {
      capturer.stop();
      capturer.save();
      noLoop();
    }
  }
}

function buttonPress() {
  if (capture == false) {
    capture = true;
    document.getElementById("myButton").value =
      "Saving Frames... Press Again to Cancel";
    frameCount = 0;
  } else {
    location.reload(); //refresh the page (starts animation over, stops saving frames)
  }
}
