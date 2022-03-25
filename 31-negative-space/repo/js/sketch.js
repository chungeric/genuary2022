let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let t = 0;
let numRows = 5;
let numCols = 5;
//https://www.colourlovers.com/palette/1930/cheer_up_emo_kid
let palette = ["#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58"];
let colours = [];
let cw, ch;
let r = 40;
let numFrames = 63;

function setup() {
  createCanvas(600, 600);
  blendMode(DIFFERENCE);
  noStroke();
  cw = width / numCols;
  ch = height / numRows;
  for (let i = 0; i < numRows * numCols; i++) {
    colours.push(random(palette));
  }
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  clear();
  background(0);
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let x = cw * col;
      let y = ch * row;
      let i = col + row * numCols;
      fill(colours[i]);
      if (i % 2 === 0) {
        circle(map(sin(t), -1, 1, x + cw / 3, x + (cw / 3) * 2), y + ch / 2, r);
        circle(map(sin(t), -1, 1, x + (cw / 3) * 2, x + cw / 3), y + ch / 2, r);
      } else {
        circle(x + cw / 2, map(sin(t), -1, 1, y + ch / 3, y + (ch / 3) * 2), r);
        circle(x + cw / 2, map(sin(t), -1, 1, y + (ch / 3) * 2, y + ch / 3), r);
      }
    }
  }
  t += 0.075;

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
    // if (frameCount >= numFrames) {
    //   noLoop();
    //   capturer.stop();
    //   capturer.save();
    // }
  }
}
