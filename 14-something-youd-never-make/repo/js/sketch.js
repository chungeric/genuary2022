let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let margin = 0;
let xDivisions = 10;
let yDivisions = 10;

function setup() {
  createCanvas(500, 500);
  noLoop();
  // noStroke();
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */
  background(255);
  for (let i = 0; i < 60; i++) {
    let yellow = color(242, 255, 0);
    let green = color(16, 255, 0);
    // let red = color(255, 0, 0);
    // let green = color(13, 201, 0);
    fill(lerpColor(yellow, green, random()));
    square(random(width - 100), random(height - 100), random(100));
  }

  // background(0);
  // let xSize = width / xDivisions;
  // let ySize = height / yDivisions;
  // for (let row = 0; row < yDivisions; row++) {
  //   for (let col = 0; col < xDivisions; col++) {
  //     let x = xSize * col;
  //     let y = ySize * row;
  //     let yellow = color(231, 235, 35);
  //     let green = color(162, 255, 41);
  //     fill(lerpColor(yellow, green, random()));
  //     // noStroke();
  //     square(x + margin/2, y + margin/2, xSize - margin);
  //     // stroke(0);
  //     // handDrawnSquare(x + margin/2, y + margin/2, xSize - margin);
  //   }
  // }
  // for (let i = 0; i < 20; i++) {
  //   let yellow = color(231, 235, 35);
  //   let green = color(162, 255, 41);
  //   fill(lerpColor(yellow, green, random()));
  //   square(random(width - 100), random(height - 100), 100);
  // }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}
