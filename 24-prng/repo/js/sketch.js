let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});
let dotsPerFrame = 100;
let started = false;

function setup() {
  createCanvas(600, 600);
  background(220);
}

let t = 1;

function draw() {
  if (!started) return;
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  for (let i = 0; i < dotsPerFrame; i++) {
    let x = myRandom(t) * (width / 2);
    let y = myRandom(t + 0.1) * height;

    strokeWeight(8);
    stroke("red");
    point(x, y);

    x = random(width / 2, width);
    y = random(height);

    strokeWeight(8);
    stroke(0);
    point(x, y);

    t += 0.2;
  }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function myRandom(t) {
  let a = Math.abs(Math.sin(t * 20) * 502);
  let b = Math.abs(Math.cos(t) * 26);
  let c = Math.abs(Math.cos(t * 6) * 51);
  let d = Math.abs(Math.sin(t * 111) * 30);
  return (((a + b + c + d) / 4) % 1) / 1;
}

function start() {
  started = true;
}
