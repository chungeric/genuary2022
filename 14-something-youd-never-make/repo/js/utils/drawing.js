/* pencil style */

function dottedLine(x1, y1, x2, y2, weight = 2, density = 10) {
  let d = dist(x1, y1, x2, y2);
  let numPoints = d;
  for (let i = 0; i < numPoints; i++) {
    let x = lerp(x1, x2, i / numPoints);
    let y = lerp(y1, y2, i / numPoints);
    dottedCircle(x, y, weight, density);
  }
}

function dottedCircle(x, y, r, density = 40) {
  for (let i = 0; i < density; i++) {
    let rr = r * sqrt(random());
    let theta = random() * TWO_PI;
    let rx = x + rr * cos(theta);
    let ry = y + rr * sin(theta);
    point(rx, ry);
  }
}

function dottedCircleOutline(x, y, r, density = 100) {
  for (let i = 0; i < density; i++) {
    let theta = random() * TWO_PI;
    let rx = x + r * cos(theta);
    let ry = y + r * sin(theta);
    point(rx, ry);
  }
}

/* hand drawn with pen style */

function handDrawnSquare(x, y, size, weight = 1) {
  handDrawnLine(x, y, x + size, y, weight);
  handDrawnLine(x, y, x, y + size, weight);
  handDrawnLine(x, y + size, x + size, y + size, weight);
  handDrawnLine(x + size, y, x + size, y + size, weight);
}

function handDrawnLine(ox1, oy1, ox2, oy2, w) {
  let d = dist(ox1, oy1, ox2, oy2);
  let segments = 4;
  let mv = 1; // movement variance
  let wv = 0; // weight variance
  // originals
  let x1 = ox1;
  let y1 = oy1;
  let x2 = ox2;
  let y2 = oy2;
  // weights
  let minWeight = 1;
  let maxWeight = 3;
  let weight = w || 2;
  for (let i = 0; i < segments; i++) {
    let xVariance = random() > 0.7 ? random() * mv * 2 - mv : 0;
    let yVariance = random() > 0.7 ? random() * mv * 2 - mv : 0;
    // x1 = lerp(ox1, ox2, i/segments);
    x2 = lerp(ox1, ox2, (i + 1) / segments) + xVariance;
    y2 = lerp(oy1, oy2, (i + 1) / segments) + yVariance;
    if (random() > 0.5) {
      weight = constrain(
        weight + map(random(), 0, 1, -wv, wv),
        minWeight,
        maxWeight
      );
    }
    strokeWeight(weight);
    if (i === segments - 1) {
      line(x1, y1, ox2, oy2);
    } else {
      line(x1, y1, x2, y2);
    }
    x1 = x2;
    y1 = y2;
  }
}
