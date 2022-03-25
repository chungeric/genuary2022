import { Galaxy } from "./galaxy";
import { Moon } from "./moon";
import { Planet } from "./planet";
import { ShootingStar } from "./shooting-star";
import { Star } from "./star";
import "./styles.scss";
import { drawCircle, drawGrid } from "./utils/draw";
import { rr } from "./utils/math";

const FPS = 60;
const LOOP = true;

class Canvas {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    this.setSizes();
    this.setup();
    this.update();
    this.addListeners();
  }

  /* Set up properties */
  setup = () => {
    this.frame = 1;
    this.fpsInterval = 1000 / FPS;
    this.then = Date.now();
    this.stars = [];
    for (let i = 0; i < 6000; i++) {
      this.stars.push(new Star(this.ctx));
    }
    this.galaxies = [];
    for (let i = 0; i < 4; i++) {
      this.galaxies.push(new Galaxy(this.ctx));
    }
    this.shootingStar = new ShootingStar(this.ctx);
    this.moon = new Moon(this.ctx);
  };

  /* Draw to canvas here using this.ctx */
  draw = () => {
    this.clear("#000");
    this.drawStars();
    this.drawGalaxies();
    this.moon.draw();
    this.shootingStar.draw();
  };

  clear = (color) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      0,
      0,
      this.ctx.canvas.clientWidth,
      this.ctx.canvas.clientHeight
    );
  };

  drawGalaxies = () => {
    for (let i = 0; i < this.galaxies.length; i++) {
      this.galaxies[i].draw();
    }
  };

  drawStars = () => {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].draw();
    }
  };

  drawMoon = () => {
    this.moon.draw();
  };

  /* Reset */
  reset = () => {
    this.frame = 0;
    clearTimeout(this.timeout);
    cancelAnimationFrame(this.raf);
    this.setup();
    this.update();
  };

  setSizes = () => {
    this.scale = Math.min(2, window.devicePixelRatio);
    this.width = 400;
    this.height = 400;
    // this.width = Math.min(window.innerWidth - 40, window.innerHeight - 40);
    // this.height = Math.min(window.innerWidth - 40, window.innerHeight - 40);
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.canvas.width = Math.floor(this.width * this.scale);
    this.canvas.height = Math.floor(this.height * this.scale);
    this.ctx.scale(this.scale, this.scale);
  };

  /* Resize */
  resize = () => {
    this.reset();
    this.setSizes();
    this.update();
  };

  /* Add event listeners */
  addListeners = () => {
    window.addEventListener("resize", this.resize);
    window.addEventListener("click", this.reset);
  };

  /* Animate */
  update = () => {
    if (LOOP) {
      let now = Date.now();
      let elapsed = now - this.then;
      if (elapsed > this.fpsInterval) {
        this.then = now - (elapsed % this.fpsInterval);
        this.frame++;
        this.draw();
      }
      this.raf = requestAnimationFrame(this.update);
    } else {
      this.draw();
    }
  };
}

new Canvas();
