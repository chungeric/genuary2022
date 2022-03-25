import * as THREE from "../three/three.module.js";
import { OrbitControls } from "../three/OrbitControls.js";
import { vertexShader, fragmentShader } from "./shaders/main.js";

let capture = false;
let numFrames = 240;
let frameCount = 0;
export const capturer = new CCapture({
  format: "gif",
  workersPath: "ccapture/",
  verbose: true,
  framerate: 30,
});
let t = 0;
let startTime;
let lastSwapTime;
let timeSinceLastSwap = 0;
let swap = false;

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.imageTexture = new THREE.TextureLoader().load("./assets/calcifer.jpg");
    // this.width = window.innerWidth;
    // this.height = window.innerHeight;
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      // antialias: true,
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.width, this.height);
    // this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setPixelRatio(1);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.z = 4;

    this.scene = new THREE.Scene();

    // Orbit controls
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    // this.addLighting();
    // this.addSettings();

    // Resize event
    // this.resize();
    // window.addEventListener("resize", this.resize.bind(this), {
    //   passive: true,
    // });

    // Render
    this.render();
  }

  /* Add Lighting */

  addSettings() {
    this.gui = new dat.GUI();
    this.settings = { progress: 0 };
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  /* Add Lighting */

  addLighting() {
    // ambient light
    this.light1 = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light1);

    // point light
    this.light2 = new THREE.PointLight(0xffffff, 1, 100);
    this.light2.position.set(2, 2, 2);
    this.scene.add(this.light2);
  }

  /* Add Objects */

  addObjects() {
    this.geometry1 = new THREE.PlaneBufferGeometry(2, 2, 200, 200);
    let numVertices = this.geometry1.attributes.position.count;
    const randomPositions = [];
    for (let i = 0; i < numVertices; i++) {
      const x = THREE.MathUtils.randFloatSpread(2);
      const y = THREE.MathUtils.randFloatSpread(2);
      const z = THREE.MathUtils.randFloatSpread(2);
      randomPositions.push(x, y, z);
    }
    this.geometry1.setAttribute(
      "randomPosition",
      new THREE.Float32BufferAttribute(randomPositions, 3)
    );
    this.geometry1.setAttribute(
      "ogPosition",
      new THREE.Float32BufferAttribute(
        this.geometry1.attributes.position.array,
        3
      )
    );
    // this.material1 = new THREE.PointsMaterial({ color: 0x888888 });
    this.uniforms1 = {
      uTime: { value: 0.0 },
      uProgress: { value: 0.0 },
      uTexture: { value: this.imageTexture },
    };
    this.material1 = new THREE.ShaderMaterial({
      uniforms: this.uniforms1,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      side: THREE.DoubleSide,
      // blending: THREE.AdditiveBlending,
      // wireframe: true,
    });
    this.points = new THREE.Points(this.geometry1, this.material1);
    this.scene.add(this.points);
  }

  /* Resize */

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  /* Render loop */

  render() {
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(() => {
      if (capture && this.uniforms1.uTime.value === 0.0) {
        capturer.start();
      }
      if (frameCount === 0) {
        startTime = new Date().getTime();
        lastSwapTime = new Date().getTime();
      }
      const elapsedTime = (new Date().getTime() - startTime) / 1000;
      timeSinceLastSwap = (new Date().getTime() - lastSwapTime) / 1000;
      // console.log(elapsedTime);
      // this.mesh1.rotation.y += 0.005;
      let position = this.points.geometry.attributes.position;
      let ogPosition = this.points.geometry.attributes.ogPosition;
      let randomPosition = this.points.geometry.attributes.randomPosition;
      // let timeScale = 0.05;
      // let b = 11;
      // let tt = t * timeScale;

      // every 4 seconds swap
      if (timeSinceLastSwap >= 3.5) {
        if (!swap) {
          swap = true;
        } else {
          swap = false;
        }
        lastSwapTime = new Date().getTime();
        timeSinceLastSwap = 0;
      }

      for (let i = 0; i < position.array.length / 3; i++) {
        let x = i * 3;
        let y = i * 3 + 1;
        let z = i * 3 + 2;

        position.array[x] = lerp(
          position.array[x],
          swap ? randomPosition.array[x] : ogPosition.array[x],
          swap ? 0.09 : 0.2
        );
        position.array[y] = lerp(
          position.array[y],
          swap ? randomPosition.array[y] : ogPosition.array[y],
          swap ? 0.09 : 0.2
        );
        position.array[z] = lerp(
          position.array[z],
          swap ? randomPosition.array[z] : ogPosition.array[z],
          swap ? 0.09 : 0.2
        );
      }
      this.points.geometry.attributes.position.needsUpdate = true;

      t++;
      frameCount++;
      this.points.rotation.y = Math.PI * 2 * (elapsedTime / 8);
      this.uniforms1.uTime.value = t;
      // this.uniforms1.uProgress.value = this.settings.progress;
      this.render();

      if (capture) {
        capturer.capture(this.canvas);
        if (frameCount >= numFrames) {
          capture = false;
          capturer.stop();
          capturer.save();
        }
      }
    });
  }
}

let app = new App();

let captureButton = document.querySelector("#toggle-capture");
let reloadButton = document.querySelector("#reload");

captureButton.addEventListener("click", toggleCapture);
reloadButton.addEventListener("click", cancelCapture);

function toggleCapture() {
  if (capture == false) {
    frameCount = 0;
    capture = true;
    app.uniforms1.uTime.value = 0.0;
    document.getElementById("toggle-capture").value = "Stop Capturing Frames";
  } else {
    capturer.stop();
    capturer.save();
  }
}

function cancelCapture() {
  location.reload();
}
