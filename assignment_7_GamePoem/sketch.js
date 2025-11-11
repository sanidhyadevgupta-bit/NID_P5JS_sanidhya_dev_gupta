// ------------------ Diwali Interactive Experience ------------------
// Return to Light — FULL VERSION with diya light animation
// Scenes: 0 Home, 1 Departure, 2 Flight, 3 Arrival, 4 Celebration, 5 Reflection, 6 Awakening
// -------------------------------------------------------------------

let scene = 0;

// Layout
let layout = {};
let skyline = [];
let clouds = [];
let windowsArr = [];
let diyas = [];
let fireworks = [];

// Taxi
let taxiLight = 0;

// Reflection
let stars = [];
let fireflies = [];
let windParticles = [];
let parallax = { x: 0, targetX: 0 };
let inactivity = 0;

// Awakening
let fanAngle = 0;
let fanSpeed = 0.03;
let fanShake = 0;
let dust = [];
let flashAlpha = 0;

// ------------------ Setup ------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  noStroke();
  computeLayout();
  initSceneAssets();
}

// ------------------ Main Draw ------------------
function draw() {
  background(0);

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
  for (const b of skyline) rect(b.x, b.y, b.w, b.h);

  fill(40);
  rect(width / 2, layout.roadY, width, layout.roadH);

  fill(255, 210);
  for (let x = layout.marginX; x < width - layout.marginX; x += 100) {
    rect(x, layout.roadY, 60, 6);
  }

  layout.taxiSpeed += layout.taxiAccel;
  layout.taxiX += layout.taxiSpeed;

  const tx = layout.taxiX;
  const ty = layout.taxiY;

  fill(255, 220, 0);
  rect(tx, ty, layout.taxiW, layout.taxiH, 10);

  fill(0);
  ellipse(tx - layout.taxiW * 0.25, ty + layout.taxiH * 0.2, layout.wheelD);
  ellipse(tx + layout.taxiW * 0.25, ty + layout.taxiH * 0.2, layout.wheelD);

  if (taxiLight > 0) {
    fill(255, 255, 160, taxiLight);
    ellipse(tx + layout.taxiW * 0.4, ty, layout.taxiW * 0.7, layout.taxiH * 0.6);
    taxiLight -= 10;
  }

  if (layout.taxiX > width + layout.taxiW) scene = 2;

  bodyText("“The city hums beneath tired stars —\nI carry a suitcase full of light.”", width / 2, height * 0.25);
}

// ------------------ Scene 2 ------------------
function drawFlight() {
  verticalGradient(color(20, 20, 60), color(100, 60, 150));

  fill(255, 220);
  const t = frameCount * 0.01;

  for (const c of clouds) {
    const x = (c.baseX + sin(t + c.phase) * c.amp) % width;
    const y = c.baseY + sin(t * 0.6 + c.phase) * 12;
    ellipse(x, y, c.w, c.h);
  }

  fill(230);
  ellipse(width / 2, height / 2, layout.planeW, layout.planeH);

  for (let f of fireworks) f.update();
  fireworks = fireworks.filter(f => !f.done);

  bodyText("“Above the clouds, fireworks bloom like forgotten prayers.”", width / 2, height * 0.85);
}

class Firework {
  constructor(x, y, col) {
    this.ps = [];
    for (let i = 0; i < 60; i++) {
      this.ps.push({
        pos: createVector(x, y),
        vel: p5.Vector.random2D().mult(random(1, 4)),
        col,
        a: 255,
      });
    }
    this.done = false;
  }
  update() {
    for (let p of this.ps) {
      p.pos.add(p.vel);
      p.vel.mult(0.95);
      p.a -= 4;
      fill(red(p.col), green(p.col), blue(p.col), p.a);
      ellipse(p.pos.x, p.pos.y, 4);
    }
    this.done = this.ps.every(p => p.a < 0);
  }
}

// ------------------ Scene 3 ------------------
function drawArrival() {
  verticalGradient(color(20, 15, 40), color(10, 8, 25));

  fill(35);
  rect(width / 2, height * 0.7, width, height * 0.3);

  for (const h of windowsArr) {
    fill(110, 75, 45);
    rect(h.x, h.y - h.h / 2, h.w, h.h);

    fill(90, 55, 35);
    triangle(h.x - h.w / 2, h.y - h.h,
      h.x, h.y - h.h - h.roofH,
      h.x + h.w / 2, h.y - h.h);

    fill(h.on ? color(255, 220, 80) : color(30));
    rect(h.x, h.y - h.h / 2, h.win, h.win, 4);
  }

  bodyText("“Each home remembers — each lamp a story retold in flame.”", width / 2, height * 0.25);
  captionText("Click windows to light them", width / 2, height * 0.3);
}

// ------------------ Scene 4 (Celebration) with Animation ------------------
function drawCelebration() {
  verticalGradient(color(10, 5, 30), color(20, 10, 50));

  fill(30);
  rect(width / 2, height * 0.82, width, height * 0.36);

  const now = millis();

  for (let i = 0; i < diyas.length; i++) {
    let d = diyas[i];

    if (d.animStart > 0) {
      let t = (now - d.animStart) / 800;  // 0 to 1 over 0.8s

      t = constrain(t, 0, 1);

      d.brightness = lerp(0, 255, easeOutQuad(t));

      for (let s of d.spark) {
        s.y -= s.vy;
        s.vy *= 0.97;
        fill(255, 200 + sin(frameCount * 0.2) * 50, 100, s.a);
        ellipse(s.x, s.y, 4, 4);
        s.a -= 4;
      }
      d.spark = d.spark.filter(s => s.a > 0);
    }

    drawDiyaAnimated(d.x, d.y, d.brightness);
  }

  bodyText("“In their faces I find the light I lost in distant cities.”", width / 2, height * 0.25);
  captionText("Click anywhere to light all diyas", width / 2, height * 0.3);
}

function drawDiyaAnimated(x, y, bright) {
  fill(145, 85, 35);
  ellipse(x, y, 50, 22);

  let flick = bright + random(-20, 20);
  flick = constrain(flick, 0, 255);

  fill(255, flick, 60);
  triangle(x, y - 24, x - 10, y - 8, x + 10, y - 8);

  fill(255, 200, 100, bright * 0.3);
  ellipse(x, y, 90, 34);
}

function easeOutQuad(t) {
  return t * (2 - t);
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

  bodyText("“The night whispers its light back to the stars.”", width / 2, height * 0.9);
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
  noStroke();
  fill(80);
  ellipse(0, 0, layout.fanHub);
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

  else if (scene === 1) taxiLight = 255;

  else if (scene === 2)
    fireworks.push(new Firework(mouseX, mouseY, color(random(200), random(200, 255), random(255))));

  else if (scene === 3)
    for (let h of windowsArr)
      if (isInside(mouseX, mouseY, h.x, h.y - h.h / 2, h.w, h.h))
        h.on = !h.on;

  else if (scene === 4) {
    let now = millis();
    for (let i = 0; i < diyas.length; i++) {
      let d = diyas[i];
      d.animStart = now + i * 120;  // wave delay
      d.brightness = 0;
      d.spark = [];
      for (let s = 0; s < 8; s++) {
        d.spark.push({
          x: d.x + random(-5, 5),
          y: d.y - random(10, 20),
          vy: random(1, 2),
          a: 255
        });
      }
    }
  }

  else if (scene === 6)
    fanSpeed += 0.12;
}

function mouseDragged() {
  if (scene === 6) fanSpeed += movedX * 0.0006;
}

function doubleClicked() {
  if (scene === 6) {
    flashAlpha = 255;
    scene = 0;
  }
}

function keyPressed() {
  scene = (scene + 1) % 7;
}

// ------------------ Helpers ------------------
function computeLayout() {
  layout.marginX = max(40, width * 0.06);
  layout.marginY = max(40, height * 0.06);

  layout.titleSize = constrain(width / 18, 28, 64);
  layout.bodySize = constrain(width / 40, 16, 34);
  layout.captionSize = constrain(width / 55, 12, 22);

  layout.roadH = height * 0.12;
  layout.roadY = height * 0.82;
  layout.skylineBase = height * 0.62;

  layout.taxiW = min(180, width * 0.2);
  layout.taxiH = layout.taxiW * 0.35;
  layout.taxiX = -layout.taxiW * 2;
  layout.taxiY = layout.skylineBase + (layout.roadY - layout.skylineBase) * 0.35;
  layout.taxiSpeed = width * 0.0022;
  layout.taxiAccel = width * 0.000005;
  layout.wheelD = layout.taxiH * 0.45;

  layout.planeW = min(width * 0.25, 320);
  layout.planeH = layout.planeW * 0.22;

  layout.fanBlade = min(width, height) * 0.18;
  layout.fanHub = layout.fanBlade * 0.22;
}

function initSceneAssets() {
  skyline = [];
  for (let i = 0; i < 12; i++) {
    const w = width / 25;
    const x = map(i, 0, 11, layout.marginX, width - layout.marginX);
    const h = random(height * 0.14, height * 0.22);
    skyline.push({ x, y: layout.skylineBase - h / 2, w, h });
  }

  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      baseX: random(width),
      baseY: height * (0.28 + 0.1 * (i % 3)),
      w: width * 0.15,
      h: height * 0.08,
      phase: i,
      amp: 40
    });
  }

  windowsArr = [];
  for (let i = 0; i < 5; i++) {
    const x = map(i, 0, 4, layout.marginX, width - layout.marginX);
    const w = width * 0.12;
    const h = w * 1.2;
    windowsArr.push({ x, y: height * 0.62, w, h, roofH: h * 0.25, win: w * 0.35, on: false });
  }

  diyas = [];
  for (let i = 0; i < 7; i++) {
    const x = map(i, 0, 6, layout.marginX, width - layout.marginX);
    diyas.push({
      x,
      y: height * 0.75,
      lit: false,
      brightness: 0,
      animStart: 0,
      spark: []
    });
  }

  stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.5),
      r: random(1, 2),
      twinkle: random(TWO_PI),
      seed: random(1000)
    });
  }

  fireflies = [];
  for (let i = 0; i < 24; i++) {
    fireflies.push({
      x: random(width),
      y: random(height * 0.6, height * 0.9),
      seed: random(1000)
    });
  }

  dust = [];
  for (let i = 0; i < 100; i++) {
    dust.push({
      x: random(width),
      y: random(height),
      vy: random(0.2, 0.5),
      seed: random(1000)
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

function drawDiyaAnimated(x, y, bright) {
  fill(145, 85, 35);
  ellipse(x, y, 50, 22);

  let flick = bright + random(-20, 20);
  flick = constrain(flick, 0, 255);

  fill(255, flick, 60);
  triangle(x, y - 24, x - 10, y - 8, x + 10, y - 8);

  fill(255, 200, 100, bright * 0.3);
  ellipse(x, y, 90, 34);
}

function isInside(px, py, cx, cy, w, h) {
  return px >= cx - w / 2 && px <= cx + w / 2 &&
         py >= cy - h / 2 && py <= cy + h / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeLayout();
  initSceneAssets();
}
