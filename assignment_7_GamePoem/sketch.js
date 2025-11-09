// ------------------ Diwali Interactive Experience ------------------
// "Return to Light" by Sanidhya Dev Gupta
// 6 scenes - with alignment, polish, and subtle motion
// -------------------------------------------------------------

let scene = 0;
let taxiLight = 0;
let fireworks = [];
let diyas = [];
let windows = [];
let reflectionParticles = [];
let ceilingAngle = 0;
let inactivity = 0;

// ------------------ Setup ------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Georgia");
  rectMode(CENTER);
  noStroke();
  smooth();

  // windows for arrival
  for (let i = 0; i < 5; i++) {
    windows.push({
      x: width * (i + 1) / 6,
      y: height * 0.55,
      on: false,
    });
  }

  // diyas for festival
  for (let i = 0; i < 7; i++) {
    diyas.push({
      x: width * (i + 1) / 8,
      y: height * 0.75,
      lit: false,
    });
  }
}

// ------------------ Draw ------------------
function draw() {
  background(0);

  switch (scene) {
    case 0: homeScene(); break;
    case 1: departureScene(); break;
    case 2: flightScene(); break;
    case 3: arrivalScene(); break;
    case 4: celebrationScene(); break;
    case 5: reflectionScene(); break;
    case 6: awakeningScene(); break;
  }

  // reflection timeout
  if (scene === 5) {
    inactivity++;
    if (inactivity > 600) { // ~10 seconds
      scene = 6;
      inactivity = 0;
    }
  }
}

// ------------------ Scene 0: Home ------------------
function homeScene() {
  background(15, 10, 40);
  for (let i = 0; i < height; i++) {
    stroke(lerpColor(color(10, 10, 40), color(40, 10, 70), i / height));
    line(0, i, width, i);
  }

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(52);
  text("✨ Return to Light ✨", width / 2, height / 2 - 50);

  textSize(20);
  fill(220);
  text("A poetic Diwali journey", width / 2, height / 2 + 20);
  text("Click anywhere to begin", width / 2, height / 2 + 60);
  text("Press SPACE to skip scenes", width / 2, height / 2 + 100);
}

// ------------------ Scene 1: Departure ------------------
function departureScene() {
  background(15, 15, 40);

  // city skyline
  fill(25, 25, 60);
  for (let i = 0; i < width; i += width / 12) {
    let h = random(120, 200);
    rect(i + width / 24, height * 0.6, width / 15, h);
  }

  // road
  fill(40);
  rect(width / 2, height * 0.8, width, 100);
  fill(255);
  for (let i = 0; i < width; i += 100) rect(i, height * 0.8, 40, 6);

  // taxi
  fill(255, 220, 0);
  rect(width / 2, height * 0.72, 140, 50, 10);
  fill(0);
  ellipse(width / 2 - 40, height * 0.74, 20);
  ellipse(width / 2 + 40, height * 0.74, 20);

  // headlight
  fill(255, 255, 150, taxiLight);
  ellipse(width / 2 + 75, height * 0.72, 80, 30);
  taxiLight = max(0, taxiLight - 15);

  // text
  noStroke();
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("“The city hums beneath tired stars —\nI carry a suitcase full of light.”", width / 2, height * 0.3);
}

// ------------------ Scene 2: Flight ------------------
function flightScene() {
  // sky gradient
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(color(20, 20, 60), color(100, 60, 150), y / height));
    line(0, y, width, y);
  }

  noStroke();
  fill(220);
  ellipse(width / 2, height / 2, 220, 50);
  triangle(width / 2 + 110, height / 2, width / 2 + 170, height / 2 - 20, width / 2 + 170, height / 2 + 20);

  // floating clouds
  fill(255, 220);
  let t = frameCount * 0.01;
  for (let i = 0; i < 5; i++) {
    let x = (width / 5) * i + (sin(t + i) * 40);
    let y = height * 0.3 + sin(t + i) * 20;
    ellipse(x, y, 120, 70);
  }

  // fireworks
  for (let f of fireworks) f.update();
  fireworks = fireworks.filter(f => !f.done);

  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("“Above the clouds, fireworks bloom like forgotten prayers.”", width / 2, height * 0.85);
}

// ------------------ Firework Class ------------------
class Firework {
  constructor(x, y, col) {
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        pos: createVector(x, y),
        vel: p5.Vector.random2D().mult(random(1, 4)),
        col: col,
        alpha: 255
      });
    }
  }
  update() {
    for (let p of this.particles) {
      p.pos.add(p.vel);
      p.vel.mult(0.95);
      p.alpha -= 5;
      noStroke();
      fill(red(p.col), green(p.col), blue(p.col), p.alpha);
      ellipse(p.pos.x, p.pos.y, 4);
    }
    this.done = this.particles.every(p => p.alpha < 0);
  }
}

// ------------------ Scene 3: Arrival ------------------
function arrivalScene() {
  background(20, 15, 40);

  // ground
  fill(30);
  rect(width / 2, height * 0.7, width, height * 0.3);

  // houses
  for (let h of windows) {
    fill(100, 70, 40);
    rect(h.x, h.y, 80, 100);
    fill(h.on ? color(255, 220, 80) : color(40));
    rect(h.x, h.y, 30, 40, 4);
  }

  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("“Each home remembers — each lamp a story retold in flame.”", width / 2, height * 0.25);
  textSize(16);
  fill(200);
  text("Click windows to light them", width / 2, height * 0.3);
}

// ------------------ Scene 4: Celebration ------------------
function celebrationScene() {
  background(10, 5, 30);
  fill(30);
  rect(width / 2, height * 0.8, width, height * 0.4);

  for (let d of diyas) {
    fill(140, 80, 30);
    ellipse(d.x, d.y, 50, 25);
    if (d.lit) {
      fill(255, 200 + 55 * sin(frameCount * 0.2), 50);
      triangle(d.x, d.y - 25, d.x - 10, d.y - 8, d.x + 10, d.y - 8);
      fill(255, 200, 100, 80);
      ellipse(d.x, d.y, 80, 30);
    }
  }

  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("“In their faces I find the light I lost in distant cities.”", width / 2, height * 0.25);
  fill(200);
  textSize(16);
  text("Click diyas to light them", width / 2, height * 0.3);
}

// ------------------ Scene 5: Reflection ------------------
function reflectionScene() {
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(color(30, 15, 40), color(0, 0, 10), y / height));
    line(0, y, width, y);
  }

  noStroke();
  fill(255, 230);
  textAlign(CENTER);
  textSize(26);
  text("“The night whispers its light back to the stars.”", width / 2, height * 0.85);

  for (let p of reflectionParticles) {
    p.update();
    p.display();
  }
  reflectionParticles = reflectionParticles.filter(p => !p.done);
}

class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.alpha = 255;
    this.col = col;
  }
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.95);
    this.alpha -= 3;
    if (this.alpha < 0) this.done = true;
  }
  display() {
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    ellipse(this.pos.x, this.pos.y, 6);
  }
}

// ------------------ Scene 6: Awakening ------------------
function awakeningScene() {
  background(25);
  push();
  translate(width / 2, height / 2 - 100);
  rotate(ceilingAngle);
  stroke(255);
  strokeWeight(5);
  for (let i = 0; i < 4; i++) {
    line(0, 0, 120, 0);
    rotate(HALF_PI);
  }
  pop();
  ceilingAngle += 0.05;

  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("“Was it a dream?”", width / 2, height * 0.75);
}

// ------------------ Interaction ------------------
function mousePressed() {
  inactivity = 0;

  if (scene === 0) scene = 1;
  else if (scene === 1) taxiLight = 255;
  else if (scene === 2) fireworks.push(new Firework(mouseX, mouseY, color(random(200), random(200, 255), random(255))));
  else if (scene === 3) {
    for (let h of windows) if (dist(mouseX, mouseY, h.x, h.y) < 40) h.on = !h.on;
  }
  else if (scene === 4) {
    for (let d of diyas) if (dist(mouseX, mouseY, d.x, d.y) < 30) d.lit = true;
  }
  else if (scene === 5) {
    let c = color(random(150, 255), random(150, 255), random(255));
    for (let i = 0; i < 30; i++) reflectionParticles.push(new Particle(mouseX, mouseY, c));
  }
  else if (scene === 6) scene = 0;
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) {
    scene++;
    if (scene > 6) scene = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
