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
