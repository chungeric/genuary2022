function toggleCapture() {
  if (capture == false) {
    id = 0;
    frameCount = 0;
    background(230);
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
