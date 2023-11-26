let capture = false;
let capturer = new CCapture({
  format: "gif",
  workersPath: "js/",
  verbose: true,
  framerate: 60,
});
let cnv;

function setup() {
  // cnv = createCanvas(1000, 1000);
  cnv = createCanvas(500, 500);
  noLoop();
}

function draw() {
  if (capture && frameCount === 1) {
    capturer.start();
  }

  /* start drawing stuff */
  pixelDensity(1);
  let d = pixelDensity();
  let noiseScale = 0.001;

  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = 4 * d * (y * d * width + x);
      let n = noise(x * noiseScale, y * noiseScale); // 0 -> 1
      let nn = map(n, 0, 1, 0.5, 1);
      let hue = round(map(random(), 0, 1, 29, 36));
      let sat = map(random(), 0, 1, 41, 84);
      let minLightness = random() < 0.1 ? 10 : 52;
      let maxLightness = 81;
      let lightness = map(random(), 0, 1, minLightness, maxLightness);
      // let color1 = color(247, 205, 166);
      // let color2 = color(183, 143, 84);
      // let col = lerpColor(color1, color2, random());
      // // colorMode(HSB, 100);
      // // let col = color(hue(lerpCol), saturation(lerpCol), brightness(lerpCol));
      // // colorMode(HSL, 360);
      // // let h = hue(lerpCol);
      // // colorMode(RGB, 255);
      // // colorMode(HSB, 100);
      let col = color(`hsl(${hue}, ${sat}%, ${lightness * nn}%)`);
      // // colorMode(HSL, 255);
      pixels[i] = red(col);
      pixels[i + 1] = green(col);
      pixels[i + 2] = blue(col);
      pixels[i + 3] = 255;
    }
  }

  // for (let i = 0; i < numPixels; i += 4) {
  //   let hue = round(map(random(), 0, 1, 54, 63));
  //   let sat = map(random(), 0, 1, 40, 70);
  //   let minLightness = random() < 0.2 ? 10 : 50;
  //   let maxLightness = 94;
  //   let lightness = map(random(), 0, 1, minLightness, maxLightness);
  //   let col = color(`hsl(${hue}, ${sat}%, ${lightness}%)`);
  //   pixels[i] = red(col);
  //   pixels[i + 1] = green(col);
  //   pixels[i + 2] = blue(col);
  //   pixels[i + 3] = 255;
  // }

  updatePixels();

  // background(0);
  // for (let i = 0; i < 250000; i++) {
  //   let hue = round(map(random(),0,1,60,65));
  //   let sat = map(random(),0,1,30,70);
  //   let minLightness = random() < 0.1 ? 10 : 40;
  //   let maxLightness = 94;
  //   let lightness = map(random(),0,1,minLightness,maxLightness);
  //   strokeWeight(map(random(), 0, 1, 1, 2.5));
  //   stroke(`hsl(${hue}, ${sat}%, ${lightness}%)`);
  //   point(random(width), random(height));
  // }

  /* finish drawing stuff */

  if (capture) {
    capturer.capture(canvas);
  }
}

// function mousePressed() {
//   save("sketch.png");
// }
