function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class Vec2 {



  constructor(x = 0, y = 0) {_defineProperty(this, "x", 0);_defineProperty(this, "y", 0);
    this.x = x;
    this.y = y;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  subtract(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  normalize() {
    return this.magnitude === 0 ? this : this.divide(this.magnitude);
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  multiply(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  static multiplyVector(vec, scalar) {
    const result = vec.clone();
    result.multiply(scalar);
    return result;
  }

  static substractVectors(vecA, vecB) {
    return new Vec2(vecA.x - vecB.x, vecA.y - vecB.y);
  }

  static randomFloat() {
    return new Vec2(Math.random(), Math.random());
  }}


const stats = new Stats();
const gui = new dat.GUI({ name: "Params" });
gui.closed = true;
const params = {
  blur: 0,
  trail: true,
  trailLifeSpan: 0.2,
  color: { h: 360, s: 1, v: 0.5 },
  colorVariation: 20,
  minLifeSpan: 50,
  maxLifeSpan: 100,
  shape: "Circle",
  blendMode: 'normal',
  background: { r: 15, g: 15, b: 15 },
  spread: 30,
  randomness: 30,
  particleAddCount: 10,
  size: 7 };

const simplex = new SimplexNoise();
const screen = document.getElementById("c");
const canvas = document.createElement("canvas");
const screenCtx = screen.getContext("2d");
const ctx = canvas.getContext("2d");
const time = {
  start: performance.now(),
  elapsed: null };

const size = {
  width: window.innerWidth,
  height: window.innerHeight };

let isPressed = false;
let interacted = false;
const mousePosition = new Vec2(window.innerWidth / 2, window.innerHeight / 2);
let mouseVelocity = new Vec2();

class Particle {
  constructor(pos, vel = Vec2.randomFloat()) {
    this.age = 0;
    this.angle = 0;
    this.lifeSpan = randomInt(params.minLifeSpan, params.maxLifeSpan);
    this.isDead = false;
    this.position = pos;
    const velOffset = Vec2.randomFloat().multiply(randomFloat(1, 3));
    this.velocity = vel.multiply(0.25).add(velOffset);
    this.decay = randomFloat(0.95, 0.99);
    this.color = randomInt(params.color.h - params.colorVariation, params.color.h + params.colorVariation);
    this.radius = params.size;
  }

  update() {
    this.age++;
    const noise = simplex.noise3D(this.position.x * 0.005, this.position.y * 0.005, time.elapsed / 1000 * 0.001);
    const angle = noise * params.randomness;
    const agePer = 1 - this.age / this.lifeSpan;
    if (this.age > this.lifeSpan) this.isDead = true;
    const noiseVector = new Vec2(Math.cos(angle), Math.sin(angle)).multiply(0.15).multiply(1 - agePer);
    this.velocity.add(noiseVector);
    this.position.add(this.velocity);
    this.velocity.multiply(this.decay);
    this.radius = params.size * agePer;
    this.angle = noise * 30 * 0.25;
    if (this.radius < 0) this.radius = 0;
  }

  draw() {
    const agePer = 1 - this.age / this.lifeSpan;
    ctx.fillStyle = `hsl(${this.color}, ${params.color.s * 100}%, ${100 - map(agePer, 0, 1,
    0, 80)}%)`;
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    const d = this.radius;
    switch (params.shape) {
      case "Triangle":
        ctx.moveTo(0, -d / 2);
        ctx.lineTo(d / 2, d / 2);
        ctx.lineTo(-d / 2, d / 2);
        break;
      case "Square":
        ctx.rect(-d, -d, d, d);
        break;
      default:
        ctx.arc(0, 0, d, 0, 6);}

    ctx.fill();
    ctx.restore();
  }}


class ParticleController {constructor() {_defineProperty(this, "particles",
    []);}

  addParticles(amount, position) {
    for (let i = 0; i < amount; i++) {
      const randVec = Vec2.randomFloat().multiply(params.spread).add(position);
      this.particles.push(new Particle(randVec, mouseVelocity.clone()));
    }
  }

  update() {
    this.particles = this.particles.filter(value => {
      return !value.isDead;
    });
    for (let particle of this.particles) {
      particle.update();
    }
  }

  draw() {
    for (let particle of this.particles) {
      particle.draw();
    }
  }}



function init() {
  document.body.appendChild(stats.domElement);
  window.requestAnimationFrame(render);
  let controller = new ParticleController();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("touchstart", touchStart);
  window.addEventListener("touchmove", touchMove);
  window.addEventListener("touchend", touchEnd);
  createControls();
  resize();

  function createControls() {
    gui.add(params, 'blur', 0, 20, 1);
    gui.add(params, 'trail');
    gui.add(params, 'trailLifeSpan', 0.2, 0.9, 0.1);
    gui.add(params, 'size', 1, 30);
    gui.add(params, 'particleAddCount', 1, 40);
    gui.add(params, 'spread', 1, 50);
    gui.add(params, 'randomness', 5, 200);
    gui.add(params, 'colorVariation', 0, 100);
    gui.add(params, 'shape', ['Circle', 'Square', 'Triangle']);
    gui.add(params, 'minLifeSpan', 0, 200);
    gui.add(params, 'maxLifeSpan', 0, 200);
    gui.add(params, 'blendMode', ["normal", "lighter", "darken", "lighten", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "color", "luminosity", "screen", "multiply"]);
    gui.addColor(params, 'color');
    gui.addColor(params, 'background');
  }

  function render(now) {
    stats.begin();
    time.elapsed = now - time.start;
    screenCtx.fillStyle = `rgba(${params.background.r}, ${params.background.g}, ${params.background.b}, ${params.trail ? params.trailLifeSpan : 1})`;
    screenCtx.fillRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    drawToScreen();
    stats.end();
    window.requestAnimationFrame(render);
  }

  function update() {
    const center = new Vec2(window.innerWidth / 2, window.innerHeight / 2);
    if (!interacted) controller.addParticles(params.particleAddCount, Vec2.substractVectors(center, new Vec2(20, 20)));
    if (isPressed) controller.addParticles(params.particleAddCount, Vec2.substractVectors(mousePosition, new Vec2(20, 20)));
    controller.update();
  }

  function draw() {
    ctx.clearRect(0, 0, size.width, size.height);
    controller.draw();
  }

  function drawToScreen() {

    screenCtx.save();
    screenCtx.filter = `blur(${params.blur}px) brightness(115%)`;
    screenCtx.globalCompositeOperation = params.blendMode;
    screenCtx.drawImage(canvas, 0, 0);
    screenCtx.restore();
    /*screenCtx.save();
                         screenCtx.filter = 'blur(30px)';
                         screenCtx.globalCompositeOperation = "lighter";
                         screenCtx.drawImage(canvas, 0, 0);
                         screenCtx.restore();*/
  }

  function resize() {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    screen.width = canvas.width = size.width;
    screen.height = canvas.height = size.height;
  }

  function touchStart() {
    if (!interacted) {
      hideUI();
    }
    isPressed = true;
  }

  function hideUI() {
    interacted = true;
    TweenMax.to("#instructions", 0.65, { autoAlpha: 0, ease: Sine.easeOut });
  }

  function touchMove(event) {
    mouseVelocity = Vec2.substractVectors(mousePosition, new Vec2(event.touches[0].clientX, event.touches[0].clientY)).multiply(0.25);
    mousePosition.set(event.touches[0].clientX, event.touches[0].clientY);
  }

  function touchEnd() {
    isPressed = false;
  }

  function mouseMove(event) {
    mouseVelocity = Vec2.substractVectors(mousePosition, new Vec2(event.x, event.y)).multiply(0.25);
    mousePosition.set(event.x, event.y);
  }

  function mouseDown() {
    if (!interacted) {
      hideUI();
    }
    isPressed = true;
  }

  function mouseUp() {
    isPressed = false;
  }
}

init();

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function interpolate(value, min, max) {
  return min + (max - min) * value;
}

function map(value, min1, max1, min2, max2) {
  return interpolate(normalize(value, min1, max1), min2, max2);
}