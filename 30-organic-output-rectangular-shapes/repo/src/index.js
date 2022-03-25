import * as THREE from "../three/three.module.js";
import { OrbitControls } from "../three/OrbitControls.js";
import { vertexShader, fragmentShader } from "./shaders/main.js";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.1";
const simplex = new SimplexNoise();

export const map = (n, start1, stop1, start2, stop2) => {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const SIZE = 20;
let t = 0;
let frameCount = 0;
let numFrames = 76;
let capture = false;
let startTime;
export const capturer = new CCapture({
  format: "gif",
  workersPath: "ccapture/",
  verbose: true,
  framerate: 60,
});

class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({
      // antialias: true,
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.z = 35;

    this.scene = new THREE.Scene();

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    this.addLighting();
    // this.addSettings();

    // Resize event
    this.resize();
    window.addEventListener("resize", this.resize.bind(this), {
      passive: true,
    });

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
    this.light1 = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light1);

    // point light
    this.light2 = new THREE.PointLight(0xffffff, 1, 0);
    this.light2.position.set(50, 200, 200);
    this.scene.add(this.light2);

    this.light3 = new THREE.PointLight(0xffffff, 1, 0);
    this.light3.position.set(-100, 200, 100);
    this.scene.add(this.light3);

    this.light4 = new THREE.PointLight(0xffffff, 1, 0);
    this.light4.position.set(0, -200, 100);
    this.scene.add(this.light4);
  }

  /* Add Objects */

  addObjects() {
    this.geometry1 = new THREE.PlaneBufferGeometry(0.9, 0.9);
    this.material1 = new THREE.MeshPhysicalMaterial({
      color: 0x858585,
      side: THREE.DoubleSide,
      roughness: 0.1,
      reflectivity: 0.3,
      metalness: 0.4,
      emissive: "#000000",
    });
    // this.material1 = new THREE.MeshNormalMaterial();
    this.panels = [];
    for (let x = -SIZE; x <= SIZE; x++) {
      for (let y = -SIZE; y <= SIZE; y++) {
        let m = new THREE.Object3D();
        let p = new THREE.Mesh(this.geometry1, this.material1);
        m.add(p);
        m.children[0].position.set(0, -0.5, 0);
        m.position.set(x, y, 0);
        this.scene.add(m);
        this.panels.push(m);
      }
    }
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
      if (capture && frameCount === 0) {
        capturer.start();
      }
      if (frameCount === 0) {
        startTime = new Date().getTime();
      }
      const elapsedTime = (new Date().getTime() - startTime) / 1000;
      // console.log(elapsedTime * 60);
      this.panels.forEach((panel) => {
        let x = panel.position.x;
        let y = panel.position.y;
        let timeScale = 0.1;
        let noiseScale = 1.8;
        let n = simplex.noise2D(x * noiseScale, y * noiseScale);
        // // console.log(n1);
        // let n2 = simplex.noise2D(
        //   x * noiseScale - t * timeScale,
        //   y * noiseScale
        // );
        // console.log(n1);
        panel.rotation.set(
          map(
            Math.sin(x * 0.1 + elapsedTime * 5) * n * noiseScale,
            -1,
            1,
            -(Math.PI / 4),
            Math.PI / 4
          ),
          0,
          0
        );
      });
      // t++;
      frameCount++;
      this.render();

      if (capture) {
        if (frameCount <= numFrames) {
          capturer.capture(this.canvas);
        } else {
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
    // app.uniforms1.uTime.value = 0.0;
    document.getElementById("toggle-capture").value = "Stop Capturing Frames";
  } else {
    capturer.stop();
    capturer.save();
  }
}

function cancelCapture() {
  location.reload();
}
