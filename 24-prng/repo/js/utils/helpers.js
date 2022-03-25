function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
    background(220);
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
