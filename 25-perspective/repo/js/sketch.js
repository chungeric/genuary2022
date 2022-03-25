let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});

let constructionLineColor;
let lineColor;
let bgColor;
let numPaperLines = 30;
let noiseScale = 0.05;
let offset;

function setup() {
  createCanvas(600, 600);
  // noLoop();
  // frameRate(30)
  bgColor = color(237, 235, 223);
  constructionLineColor = color(214, 212, 201);
  lineColor = color(63, 64, 55);
  offset = random(20);
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  background(bgColor);
  drawPaperLines();

  let horizonY = height / 2;
  let t = frameCount * noiseScale + offset;
  // let noiseVal = frameCount * noiseScale;
  // let n = noise(noiseVal);

  // horizon line
  strokeWeight(4);
  stroke(lineColor);
  line(0, horizonY, width, horizonY);
  strokeWeight(10);
  stroke(constructionLineColor);

  /* POINTS */
  let hp1 = {
    x: lerp(0, width / 3, pc(t)),
    y: horizonY,
  };
  point(hp1.x, hp1.y);

  // n = noise(noiseVal + 1);
  let hp2 = {
    x: lerp((width / 3) * 2, width, pc(t + 1)),
    y: horizonY,
  };
  point(hp2.x, hp2.y);

  // center points
  // n = noise(noiseVal + 2);
  let cpx = lerp(width / 3 + 20, (width / 3) * 2 - 20, pc(t + 2));

  // n = noise(noiseVal + 3);
  let cp1 = {
    x: cpx,
    y: lerp(horizonY + 100, height - 140, pc(t + 3)),
  };
  point(cp1.x, cp1.y);

  // n = noise(noiseVal + 4);
  let cp2 = {
    x: cpx,
    y: lerp(horizonY + 10, horizonY + 50, pc(t + 4)),
  };
  point(cp2.x, cp2.y);

  // right points
  // n = noise(noiseVal + 5);
  let rLen = lerp(0.3, 0.4, pc(t + 5));
  let rp1 = {
    x: lerp(cp1.x, hp2.x, rLen),
    y: lerp(cp1.y, hp2.y, rLen),
  };
  point(rp1.x, rp1.y);

  let rp2 = {
    x: lerp(cp2.x, hp2.x, rLen),
    y: lerp(cp2.y, hp2.y, rLen),
  };
  point(rp2.x, rp2.y);

  // left points
  // n = noise(noiseVal + 6);
  let lLen = lerp(0.3, 0.4, pc(t + 6));
  let lp1 = {
    x: lerp(cp1.x, hp1.x, lLen),
    y: lerp(cp1.y, hp1.y, lLen),
  };
  point(lp1.x, lp1.y);
  let lp2 = {
    x: lerp(cp2.x, hp1.x, lLen),
    y: lerp(cp2.y, hp1.y, lLen),
  };
  point(lp2.x, lp2.y);

  // back point
  let bp1 = getIntersection(lp2, hp2, rp2, hp1);
  point(bp1.x, bp1.y);

  /* CONSTRUCTION LINES */
  strokeWeight(2);
  line(cp1.x, cp1.y, hp1.x, hp1.y);
  line(cp1.x, cp1.y, hp2.x, hp2.y);

  line(cp2.x, cp2.y, hp1.x, hp1.y);
  line(cp2.x, cp2.y, hp2.x, hp2.y);

  // line(rp1.x, rp1.y, hp1.x, hp1.y);
  line(rp1.x, rp1.y, hp2.x, hp2.y);

  line(rp2.x, rp2.y, hp1.x, hp1.y);
  line(rp2.x, rp2.y, hp2.x, hp2.y);

  line(lp2.x, lp2.y, hp2.x, hp2.y);

  /* CUBE LINES */
  stroke(63, 64, 55);
  strokeWeight(4);
  line(cp1.x, cp1.y, cp2.x, cp2.y);
  line(rp1.x, rp1.y, rp2.x, rp2.y);
  line(lp1.x, lp1.y, lp2.x, lp2.y);
  line(cp1.x, cp1.y, lp1.x, lp1.y);
  line(cp1.x, cp1.y, rp1.x, rp1.y);
  line(cp2.x, cp2.y, lp2.x, lp2.y);
  line(cp2.x, cp2.y, rp2.x, rp2.y);
  line(lp2.x, lp2.y, bp1.x, bp1.y);
  line(rp2.x, rp2.y, bp1.x, bp1.y);

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function drawPaperLines() {
  for (let i = 1; i < numPaperLines; i++) {
    let y = height * (i / numPaperLines);
    stroke(constructionLineColor);
    strokeWeight(0.6);
    line(0, y, width, y);
  }
}

function pc(t) {
  return sin(t) * 0.5 + 0.5;
}
