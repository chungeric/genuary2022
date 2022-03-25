let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let balls = [];
let numBalls = 40;

function setup() {
  createCanvas(800, 80);
  for (let i = 0; i < numBalls; i++) {
    let color = `hsl(${round((i / numBalls) * 360)}, 70%, 50%)`;
    balls.push(new Ball(i * (width / numBalls) + 5, 4, color, null));
    // balls.push(new Ball(i * (width / numBalls), 4, color, 20));
    // balls.push(new Ball(i * (width / numBalls), 4, color, 40));
    // balls.push(new Ball(i * (width / numBalls), 4, color, 60));
    // balls.push(new Ball(i * (width / numBalls), 4, color, 80));
  }
}

function draw() {
  if (capture && frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }

  background("rgba(0,0,0, 0.05)");
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    let r = ball.r;
    let h = ball.jumpHeight;
    let f = ball.jumpFrequency;
    let s = ball.speed;
    let offset = ball.offset;
    ball.x = (ball.x + s) % width;
    ball.y =
      (1 - abs(sin((frameCount + offset) * 0.05 * f))) * (h - r * 2) +
      (r + 0.5) +
      (height - h);
    ball.show();
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
    background(0);
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
}
