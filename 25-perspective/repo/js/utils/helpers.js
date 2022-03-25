function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
    clear();
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
}

// Ref: https://editor.p5js.org/mwburke/sketches/h1ec1s6LG

function getIntersection(point1, point2, point3, point4) {
  const ua =
    ((point4.x - point3.x) * (point1.y - point3.y) -
      (point4.y - point3.y) * (point1.x - point3.x)) /
    ((point4.y - point3.y) * (point2.x - point1.x) -
      (point4.x - point3.x) * (point2.y - point1.y));

  const ub =
    ((point2.x - point1.x) * (point1.y - point3.y) -
      (point2.y - point1.y) * (point1.x - point3.x)) /
    ((point4.y - point3.y) * (point2.x - point1.x) -
      (point4.x - point3.x) * (point2.y - point1.y));

  const x = point1.x + ua * (point2.x - point1.x);
  const y = point1.y + ua * (point2.y - point1.y);

  return { x, y };
}
