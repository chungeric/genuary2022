function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
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

let pixelNoiseScale = 0.002;
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
      let v = 6;
      let l = lightness(pixelCol) + (dark ? random(-9, -15) : random(-10, 4));

      let n = noise(x * pixelNoiseScale, y * pixelNoiseScale);
      let nn = map(n, 0, 1, 0.8, 1);

      let newCol = color(`hsl(${h}, ${s}%, ${constrain(l, 0, 100) * nn}%)`);

      pixels[i] = red(newCol);
      pixels[i + 1] = green(newCol);
      pixels[i + 2] = blue(newCol);
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
}
