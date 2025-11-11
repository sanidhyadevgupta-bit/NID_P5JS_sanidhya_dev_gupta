// ------------------ Diwali Interactive Experience ------------------
// FINAL — Fireworks visible in Diya scene + col fix + strong trails
// --------------------------------------------------------------------

let scene = 0;

let taxiImg, cloudImg, airplaneImg, houseImg;
let planeRatio = 0;

let layout = {};

let skyline = [];
let clouds = [];
let windowsArr = [];
let diyas = [];
let fireworks = [];

let inactivity = 0;

let stars = [];
let fireflies = [];

let fanAngle = 0;
let fanSpeed = 0.03;
let flashAlpha = 0;

// ------------------ Preload ------------------
function preload() {
  taxiImg = loadImage("car.png");
  cloudImg = loadImage("cloud.png");
  airplaneImg = loadImage("airplane.png", () => {
    planeRatio = airplaneImg.height / airplaneImg.width;
  });
  houseImg = loadImage("house.png");
}

// ------------------ Setup ------------------
function setup() {
  pixelDensity(1);

  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("width", windowWidth + "px");
  canvas.style("height", windowHeight + "px");

  canvas.elt.style.pointerEvents = "auto";
  canvas.elt.style.position = "relative";
  canvas.elt.style.zIndex = "9999";

  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Georgia");

  computeLayout();
  initSceneAssets();
}

// ------------------ Draw ------------------
function draw() {
  if (scene !== 2 && scene !== 4) fireworks = [];

  switch (scene) {
    case 0: drawHome(); break;
    case 1: drawDeparture(); break;
    case 2: drawFlight(); break;
    case 3: drawArrival(); break;
    case 4: drawCelebration(); break;
    case 5: drawReflection(); break;
    case 6: drawAwakening(); break;
  }

  if (flashAlpha > 0) {
    fill(255, flashAlpha);
    rect(width / 2, height / 2, width, height);
    flashAlpha -= 15;
  }
}

// ------------------ Scene 0 ------------------
function drawHome() {
  verticalGradient(color(15, 10, 40), color(40, 10, 70));
  titleText("✨ Return to Light ✨", width / 2, height * 0.32);
  bodyText("A poetic Diwali journey", width / 2, height * 0.44);
  bodyText("Click anywhere to begin", width / 2, height * 0.52, 220);
  captionText("Press SPACE to skip scenes", width / 2, height * 0.58, 200);
}

// ------------------ Scene 1 ------------------
function drawDeparture() {
  verticalGradient(color(15, 15, 40), color(10, 10, 30));

  fill(25, 25, 60);
  for (let b of skyline) rect(b.x, b.y, b.w, b.h);

  fill(40);
  rect(width / 2, layout.roadY, width, layout.roadH);

  fill(255, 210);
  for (let x = layout.marginX; x < width - layout.marginX; x += 100)
    rect(x, layout.roadY, 60, 6);

  if (keyIsDown(RIGHT_ARROW)) layout.taxiX += layout.taxiSpeed;

  image(taxiImg, layout.taxiX, layout.taxiY, layout.taxiW, layout.taxiH);

  if (layout.taxiX > width + layout.taxiW) scene = 2;

  bodyText("Use → to drive forward", width / 2, height * 0.18);
  bodyText("“The city hums beneath tired stars —\nI carry a suitcase full of light.”",
    width / 2, height * 0.25);
}

// ------------------ Scene 2 ------------------
function drawFlight() {
  verticalGradient(color(20, 20, 60), color(100, 60, 150));

  for (let c of clouds) {
    c.x -= c.speed;
    c.y += c.drift * 0.4;

    if (c.y < height * 0.1) c.drift = abs(c.drift);
    if (c.y > height * 0.55) c.drift = -abs(c.drift);

    image(cloudImg, c.x, c.y, c.w, c.h);
  }

  clouds = clouds.filter((c) => c.x > -c.w);
  while (clouds.length < 12) {
    clouds.push({
      x: width + random(100, 300),
      y: random(height * 0.15, height * 0.55),
      w: random(width * 0.15, width * 0.25),
      h: random(height * 0.07, height * 0.12),
      speed: random(1, 3),
      drift: random(-0.4, 0.4),
    });
  }

  let planeW = width * 0.4;
  let planeH = planeW * planeRatio;
  image(airplaneImg, width / 2, height / 2, planeW, planeH);

  for (let f of fireworks) f.update();
  fireworks = fireworks.filter((f) => !f.done);

  bodyText("“Above the clouds, fireworks bloom like forgotten prayers.”",
    width / 2, height * 0.85);
}

// ------------------ Scene 3 ------------------
function drawArrival() {
  verticalGradient(color(20, 15, 40), color(10, 8, 25));

  fill(35);
  rect(width / 2, height * 0.7, width, height * 0.3);

  for (let h of windowsArr) {
    fill(h.on ? color(255, 220, 80) : color(30));
    rect(h.x, h.y, h.win, h.win, 6);
    image(houseImg, h.x, h.y, h.w, h.h);
  }

  bodyText("“Each home remembers — each lamp a story retold in flame.”",
    width / 2, height * 0.25);
  captionText("Click windows to light them", width / 2, height * 0.3);
}

// ------------------ Scene 4 ------------------
function drawCelebration() {
  verticalGradient(color(10, 5, 30), color(20, 10, 50));

  fill(30);
  rect(width / 2, height * 0.82, width, height * 0.36);

  // Fireworks behind diyas
  for (let f of fireworks) f.update();
  fireworks = fireworks.filter((f) => !f.done);

  let now = millis();

  for (let d of diyas) {
    if (d.lit) {
      let t = (now - d.animStart) / 800;
      d.brightness = lerp(d.brightness, 255, constrain(t, 0, 1));
    } else {
      d.brightness = lerp(d.brightness, 0, 0.08);
    }
    drawDiya(d);
  }

  bodyText("“In their faces I find the light I lost in distant cities.”",
    width / 2, height * 0.25);
  captionText("Click diyas to light them & launch fireworks",
    width / 2, height * 0.3);
}

// ------------------ Code-drawn diya ------------------
function drawDiya(d) {
  push();
  fill(145, 90, 40);
  ellipse(d.x, d.y, 110, 48);

  fill(255, 200, 100, d.brightness * 0.40);
  ellipse(d.x, d.y - 10, 180, 100);

  let flick = d.brightness + random(-40, 40);
  flick = constrain(flick, 0, 255);

  fill(255, flick, 80);
  beginShape();
  vertex(d.x, d.y - 40);
  bezierVertex(d.x - 15, d.y - 20, d.x - 5, d.y, d.x, d.y - 10);
  bezierVertex(d.x + 5, d.y, d.x + 15, d.y - 20, d.x, d.y - 40);
  endShape(CLOSE);

  pop();
}

// ------------------ Firework ------------------
class Firework {
  constructor(x, y, col) {
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      let vel = p5.Vector.random2D().mult(random(2, 5));
      this.particles.push({
        pos: createVector(x, y),
        prev: createVector(x, y),
        vel: vel,
        a: 255,
        col: color(col) // ✅ FIXED
      });
    }
    this.done = false;
    this.gravity = 0.04;
    this.friction = 0.985;
  }

  update() {
    let allGone = true;

    for (let p of this.particles) {
      p.prev.set(p.pos);

      p.vel.y += this.gravity;
      p.vel.mult(this.friction);
      p.pos.add(p.vel);

      stroke(red(p.col), green(p.col), blue(p.col), p.a * 0.45);
      strokeWeight(2.5);
      line(p.prev.x, p.prev.y, p.pos.x, p.pos.y);

      noStroke();
      fill(red(p.col), green(p.col), blue(p.col), p.a);
      ellipse(p.pos.x, p.pos.y, 6, 6);
      fill(red(p.col), green(p.col), blue(p.col), p.a * 0.35);
      ellipse(p.pos.x, p.pos.y, 13, 13);

      p.a -= 3.2;
      if (p.a > 0) allGone = false;
    }

    this.done = allGone;
  }
}

// ------------------ Scene 5 ------------------
function drawReflection() {
  inactivity++;
  if (inactivity > 600) scene = 6;

  verticalGradient(color(30, 15, 40), color(0, 0, 10));

  for (let s of stars) {
    fill(255, 180 + 75 * sin(s.twinkle + s.seed));
    ellipse(s.x, s.y, s.r, s.r);
    s.twinkle += 0.02;
  }

  for (let f of fireflies) {
    f.x += random(-1, 1);
    f.y += random(-0.5, 0.5);
    fill(255, 220, 120, 150 + 80 * sin(frameCount * 0.05 + f.seed));
    ellipse(f.x, f.y, 4, 4);
  }

  bodyText("“The night whispers its light back to the stars.”",
    width / 2, height * 0.9);
}

// ------------------ Scene 6 ------------------
function drawAwakening() {
  background(247, 242, 232);

  fanAngle += fanSpeed;
  fanSpeed *= 0.995;

  push();
  translate(width / 2, height / 2 - layout.titleSize * 1.2);
  rotate(fanAngle);
  stroke(120);
  strokeWeight(8);
  for (let i = 0; i < 4; i++) {
    line(0, 0, layout.fanBlade, 0);
    rotate(HALF_PI);
  }
  pop();

  fill(40);
  textSize(layout.titleSize);
  text("“It was a dream”", width / 2, height * 0.78);

  fill(80);
  textSize(layout.captionSize);
  text("(double-click to return)", width / 2, height * 0.83);
}

// ------------------ Input ------------------
function mousePressed() {
  inactivity = 0;

  if (scene === 0) scene = 1;

  else if (scene === 2) {
    fireworks.push(new Firework(mouseX, mouseY,
      color(random(200), random(200, 255), random(255))));
  }

  else if (scene === 3) {
    for (let h of windowsArr)
      if (isInside(mouseX, mouseY, h.x, h.y, h.w, h.h))
        h.on = !h.on;
  }

  else if (scene === 4) {
    for (let d of diyas) {
      if (
        mouseX > d.x - 100 &&
        mouseX < d.x + 100 &&
        mouseY > d.y - 100 &&
        mouseY < d.y + 100
      ) {
        d.lit = !d.lit;
        d.animStart = millis();

        fireworks.push(new Firework(mouseX, mouseY,
          color(random(180, 255), random(180, 255), random(180, 255))));

        let bursts = floor(random(3, 6));
        for (let i = 0; i < bursts; i++) {
          fireworks.push(
            new Firework(
              random(width),
              random(height * 0.12, height * 0.45),
              color(random(150, 255), random(150, 255), random(150, 255))
            )
          );
        }
        break;
      }
    }
  }

  else if (scene === 6) fanSpeed += 0.12;
}

function doubleClicked() {
  if (scene === 6) {
    flashAlpha = 255;
    scene = 0;
  }
}

function keyPressed() {
  if (key === " ") scene = (scene + 1) % 7;
}

// ------------------ Helpers ------------------
function computeLayout() {
  layout.marginX = max(40, width * 0.06);

  layout.titleSize = constrain(width / 18, 28, 64);
  layout.bodySize = constrain(width / 40, 16, 34);
  layout.captionSize = constrain(width / 55, 12, 22);

  layout.roadH = height * 0.12;
  layout.roadY = height * 0.82;
  layout.skylineBase = height * 0.62;

  layout.taxiW = min(260, width * 0.32);
  layout.taxiH = layout.taxiW * 0.55;
  layout.taxiX = -layout.taxiW * 2;
  layout.taxiY = layout.skylineBase + (layout.roadY - layout.skylineBase) * 0.35;
  layout.taxiSpeed = width * 0.008;

  layout.fanBlade = min(width, height) * 0.18;
}

function initSceneAssets() {
  skyline = [];
  for (let i = 0; i < 12; i++) {
    let w = width / 25;
    let x = map(i, 0, 11, layout.marginX, width - layout.marginX);
    let h = random(height * 0.14, height * 0.22);
    skyline.push({ x, y: layout.skylineBase - h / 2, w, h });
  }

  clouds = [];
  for (let i = 0; i < 12; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.15, height * 0.55),
      w: random(width * 0.15, width * 0.25),
      h: random(height * 0.07, height * 0.12),
      speed: random(1, 3),
      drift: random(-0.4, 0.4),
    });
  }

  windowsArr = [];
  for (let i = 0; i < 5; i++) {
    let x = map(i, 0, 4, layout.marginX, width - layout.marginX);
    let w = width * 0.18;
    let h = w * 0.9;
    windowsArr.push({ x, y: height * 0.65, w, h, win: w * 0.25, on: false });
  }

  diyas = [];
  for (let i = 0; i < 7; i++) {
    diyas.push({
      x: map(i, 0, 6, layout.marginX, width - layout.marginX),
      y: height * 0.82 - 40,
      brightness: 0,
      animStart: 0,
      lit: false,
    });
  }

  stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.5),
      r: random(1, 2),
      twinkle: random(TWO_PI),
      seed: random(1000),
    });
  }

  fireflies = [];
  for (let i = 0; i < 24; i++) {
    fireflies.push({
      x: random(width),
      y: random(height * 0.6, height * 0.9),
      seed: random(1000),
    });
  }
}

function verticalGradient(c1, c2) {
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(c1, c2, y / height));
    line(0, y, width, y);
  }
  noStroke();
}

function titleText(t, x, y) {
  fill(255);
  textSize(layout.titleSize);
  text(t, x, y);
}
function bodyText(t, x, y, a = 255) {
  fill(255, a);
  textSize(layout.bodySize);
  text(t, x, y);
}
function captionText(t, x, y, a = 200) {
  fill(255, a);
  textSize(layout.captionSize);
  text(t, x, y);
}

function isInside(px, py, cx, cy, w, h) {
  return px >= cx - w / 2 && px <= cx + w / 2 && py >= cy - h / 2 && py <= cy + h / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeLayout();
  initSceneAssets();
}
