let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});
let numRows = 60;
let numCols = 40;
let pixelNoiseScale = 0.001;
let visited = [];

// let palette = ["#cad2c5", "#84a98c", "#52796f", "#354f52", "#2f3e46"];
let palette = [
  "#99e2b4",
  "#88d4ab",
  "#78c6a3",
  "#67b99a",
  "#56ab91",
  "#469d89",
  "#358f80",
  "#248277",
  "#14746f",
  "#036666",
];

function setup() {
  createCanvas(666, 1000);
  noLoop();
  pixelDensity(1);
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */

  // background(193, 235, 247);
  background(141, 166, 158);
  // background(157, 212, 204);

  // drawGrass();

  // filter(BLUR, 2);

  for (let iters = 0; iters < 10; iters++) {
    // for (let i = 0; i < 200; i++) {
    //   drawLeaf(random(width), random(height));
    // }
    for (let i = 0; i < 1; i++) {
      drawBranch();
    }
    for (let row = 0; row <= numRows; row++) {
      for (let col = 0; col <= numCols; col++) {
        let x = (width / numCols) * col;
        let y = (height / numRows) * row;
        // if (random() < 0.15) drawLeaf(x, y);
        if (
          random() < 0.05 &&
          row % 2 === 0 &&
          col % 2 === 0 &&
          visited.indexOf(`${x},${y}`) < 0
        ) {
          drawLeaf(x, y);
          visited.push(`${x},${y}`);
        }
      }
    }
  }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

function makeSandy() {
  let d = pixelDensity();
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = 4 * d * (y * d * width + x);
      let dark = random() < 0.1;
      let darkCol = color("#2f3e46");
      let pixelCol = get(x, y);

      let h = round(hue(pixelCol));
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

let last;
function drawGrass() {
  let rowSize = height / numRows;
  for (let row = 0; row < numRows; row++) {
    beginShape();
    for (let col = 0; col <= numCols; col++) {
      let x = (width / numCols) * col;
      let y = rowSize * row - (col % 2 === 0 ? 0 : rowSize / 2);
      vertex(x, y);
      // if (col > 0 && col < numCols) {
      // let l = random(10, 40);
      // stroke(random(palette));
      // strokeWeight(4);
      // line(x, y, x, y - 3);
      // if (random() < 0.2) {
      //   noStroke();
      //   fill(random(255), random(255), random(255));
      //   circle(x + 20, y - l - 5, random(10, 20));
      // }
      // for (let branches = 0; branches < random(1, 3); branches++) {
      //   let a = random(PI);
      //   let newY = y - l * random();
      //   line(x, newY, x + cos(a) * 4, newY - sin(a) * 4);
      // }
      // }
    }
    vertex(width, height);
    vertex(0, height);
    noStroke();
    let color = random(palette);
    while (color === last) {
      color = random(palette);
    }
    fill(color);
    endShape(CLOSE);
    last = color;
  }
}

function drawFlower(x, y) {
  let offsetX = random(-4, 4);
  let offsetY = random(-4, 4);
  noStroke();
  // if (random() < 0.3) {
  //   fill(random(255), random(255), random(255));
  //   // fill(random(170, 255));
  //   circle(x + offsetX, y + offsetY, random(20, 25));
  // } else {
  //   fill(random(220, 255));
  //   circle(x + offsetX, y + offsetY, random(5, 10));
  // }
  let from = color(255);
  // let to = color(222, 195, 216);
  let to = color(232, 209, 227);
  fill(lerpColor(from, to, random()));
  circle(x + offsetX, y + offsetY, random(10, 20));
}

function drawBranch(xx, yy) {
  // random side to start from
  // random chance to have flowers
  let flowers = [];
  let size = random(5, 8);
  let len = 500;
  let startPos;
  if (typeof xx !== "undefined" && typeof yy !== "undefined") {
    startPos = { x: xx, y: yy };
  } else {
    startPos = getRandomWallPos();
  }
  let { x, y } = startPos;
  let dir = getDir(x, y);
  let numPoints = len;
  let lastX = x,
    lastY = y;
  for (let i = 0; i < numPoints; i++) {
    x += cos(dir);
    y += sin(dir);
    stroke(74, 63, 50);
    // stroke(40);
    strokeWeight(size * (1 - i / (numPoints + 100)));
    line(lastX, lastY, x, y);
    if (random() < 0.05) {
      dir = dir + random(-0.2, 0.2);
    }
    if (random() < 0.02) flowers.push({ x, y });
    lastX = x;
    lastY = y;
  }

  for (let i = 0; i < flowers.length; i++) {
    let { x, y } = flowers[i];
    drawFlower(x, y);
  }
}

function getDir(x, y) {
  if (x === 0) return 0;
  if (x === width) return PI;
  if (y === 0) return PI / 2;
  if (y === height) return (3 * PI) / 2;
}

function getRandomWallPos(noFloor = false) {
  let r = random(4);
  if (r < 1) {
    return {
      x: random(width),
      y: 0,
    };
  } else if (r < 2) {
    return {
      x: width,
      y: random(height),
    };
  } else if (r < 3 && !noFloor) {
    return {
      x: random(width),
      y: height,
    };
  } else {
    return {
      x: 0,
      y: random(height),
    };
  }
}

function drawNiceLeaf(x, y) {
  // random rotation
  // random size
  let size = random(40, 60);
  let angle = random(PI);
  let x1 = x - cos(angle) * (size / 2);
  let y1 = y - sin(angle) * (size / 2);
  let x2 = x + cos(angle) * (size / 2);
  let y2 = y + sin(angle) * (size / 2);
  let hue = 130;
  let sat = random(40, 90);
  // let sat = 0;
  let light = random(25, 40);
  strokeWeight(1);
  // stroke(random(palette));
  // fill(random(palette));
  stroke(`hsl(${hue}, ${sat}%, ${light}%)`);
  fill(`hsl(${hue}, ${sat}%, ${light + 5}%)`);

  // leaf left
  beginShape();
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  curveVertex(
    x2 - cos(angle + 0.5) * size * 0.45,
    y2 - sin(angle + 0.5) * size * 0.45
  );
  curveVertex(x1 + cos(angle) * size * 0.1, y1 + sin(angle) * size * 0.1);
  curveVertex(x1 + cos(angle) * size * 0.1, y1 + sin(angle) * size * 0.1);
  endShape();

  // leaf right
  beginShape();
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  curveVertex(
    x2 - cos(angle - 0.5) * size * 0.45,
    y2 - sin(angle - 0.5) * size * 0.45
  );
  curveVertex(x1 + cos(angle) * size * 0.1, y1 + sin(angle) * size * 0.1);
  curveVertex(x1 + cos(angle) * size * 0.1, y1 + sin(angle) * size * 0.1);
  endShape();

  // stem
  line(x1, y1, x2, y2);
}
function drawLeaf(x, y) {
  // random rotation
  // random size
  let size = random(40, 60);
  let angle = random(PI);
  let x1 = x - cos(angle) * (size / 2);
  let y1 = y - sin(angle) * (size / 2);
  let x2 = x + cos(angle) * (size / 2);
  let y2 = y + sin(angle) * (size / 2);
  let hue = 130;
  let sat = random(40, 90);
  // let sat = 0;
  let light = random(25, 40);
  // strokeWeight(1);
  // stroke(random(palette));
  // fill(random(palette));
  // stroke(`hsl(${hue}, ${sat}%, ${light}%)`);
  noStroke();
  fill(random(palette));

  // leaf left
  beginShape();
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  curveVertex(
    x2 - cos(angle + 0.5) * size * 0.5,
    y2 - sin(angle + 0.5) * size * 0.5
  );
  curveVertex(x1, y1);
  curveVertex(x1, y1);
  endShape();

  // leaf right
  beginShape();
  curveVertex(x1, y1);
  curveVertex(x1, y1);
  curveVertex(
    x2 - cos(angle - 0.5) * size * 0.5,
    y2 - sin(angle - 0.5) * size * 0.5
  );
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  endShape();

  // stem
  line(x1, y1, x2, y2);
}
