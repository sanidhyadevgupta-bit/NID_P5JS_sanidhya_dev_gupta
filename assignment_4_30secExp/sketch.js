let eras = [
  { 
    name: "Prehistoric", 
    sprite: [], 
    bg: null, 
    bgPath: "prehistoric.png",
    description: "Early humans, stone tools, hunter-gatherers.",
    period: "2.5 million - 3000 BCE"
  },
  { 
    name: "Ancient", 
    sprite: [], 
    bg: null, 
    bgPath: "ancient.png",
    description: "Rise of civilizations, writing, empires.",
    period: "3000 BCE - 500 CE"
  },
  { 
    name: "Medieval", 
    sprite: [], 
    bg: null, 
    bgPath: "medieval.png",
    description: "Feudal societies, castles, knights.",
    period: "500 CE - 1500 CE"
  },
  { 
    name: "Industrial", 
    sprite: [], 
    bg: null, 
    bgPath: "industrial.png",
    description: "Industrial revolution, machines, factories.",
    period: "1750 CE - 1900 CE"
  },
  { 
    name: "Modern", 
    sprite: [], 
    bg: null, 
    bgPath: "modern.png",
    description: "Technology, cities, modern society.",
    period: "1900 CE - Present"
  }
];

let state = "begin"; // "begin" or "era"
let currentEra = 0;

let humanX, humanY;
let humanSpeed;

let spriteWidth, spriteHeight;
let frameIndex = 0;
let frameCountForAnim = 0;

let eraHumanBaseline; // y-coordinate for human on era pages (and Begin page)

function preload() {
  for (let e = 0; e < eras.length; e++) {
    eras[e].bg = loadImage(eras[e].bgPath);
    for (let i = 0; i < 2; i++) {
      let g = createGraphics(50, 120); // taller canvas so head is not cut
      g.background(eras[e].bg ? eras[e].bg.get(0,0) : color(200));
      g.fill(255, 200, 0);
      g.rect(0, 40, 50, 80);       // body
      g.ellipse(25, 25, 50, 50);   // head fully inside canvas
      eras[e].sprite.push(g);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleElements();
  textAlign(CENTER, CENTER);
}

function draw() {
  if (state === "begin") drawBeginScreen();
  else drawEra();
}

// ---------------- Scaling Function ----------------
function scaleElements() {
  spriteHeight = height * 0.15; 
  spriteWidth = spriteHeight * 0.5;
  humanSpeed = width * 0.005;

  // Era page baseline (ground)
  eraHumanBaseline = height - height * 0.1;

  humanX = width * 0.05;
  humanY = eraHumanBaseline;
}

// ---------------- Begin Screen ----------------
function drawBeginScreen() {
  background(100, 150, 200);

  // Title
  fill(0);
  textSize(height * 0.06);
  text("Human Evolution", width / 2, height * 0.1);
  textSize(height * 0.03);
  text("Use RIGHT arrow to start your journey!", width / 2, height * 0.15);

  // Thumbnails (centered above human)
  let thumbWidth = width * 0.12;
  let thumbHeight = thumbWidth;
  let margin = width * 0.02;
  let totalWidth = eras.length * thumbWidth + (eras.length - 1) * margin;
  let startX = (width - totalWidth) / 2;
  let thumbnailsBottom = height * 0.5;

  for (let i = 0; i < eras.length; i++) {
    let thumbX = startX + i * (thumbWidth + margin);
    let thumbY = thumbnailsBottom - thumbHeight;
    if (eras[i].bg) image(eras[i].bg, thumbX, thumbY, thumbWidth, thumbHeight);
    fill(255);
    textSize(height * 0.025);
    text(eras[i].name, thumbX + thumbWidth / 2, thumbnailsBottom + 20);
   
  }

  // Ground rectangle (same as Era pages)
  fill(100, 50, 20);
  rect(0, eraHumanBaseline, width, height * 0.1);

  // Human at bottom (same as Era page)
  let humanSprite = eras[0].sprite[frameIndex]; // first era sprite
  let humanRectY = eraHumanBaseline - spriteHeight;
  image(humanSprite, humanX, humanRectY, spriteWidth, spriteHeight);

  // Movement
  if (keyIsDown(RIGHT_ARROW)) {
    humanX += humanSpeed;
    if (humanX >= width - spriteWidth) {
      state = "era";
      currentEra = 0;
      humanX = 0;
      humanY = eraHumanBaseline;
    }
  }
  if (keyIsDown(LEFT_ARROW)) {
    humanX -= humanSpeed;
    if (humanX < 0) humanX = 0;
  }

  

  // Animate human
  frameCountForAnim++;
  if (frameCountForAnim % 10 === 0) {
    frameIndex = (frameIndex + 1) % eras[0].sprite.length;
  }
}

// ---------------- Era Screen ----------------
function drawEra() {
  if (eras[currentEra].bg) image(eras[currentEra].bg, 0, 0, width, height);
  else background(150);

  // Ground
  fill(100, 50, 20);
  rect(0, height - height*0.1, width, height*0.1);

  // Era name box
  push();
  textSize(height * 0.05);
  textAlign(CENTER, CENTER);
  let eraText = eras[currentEra].name;
  let paddingX = width * 0.01;
  let paddingY = height * 0.01;
  let boxW = textWidth(eraText) + paddingX * 2;
  let boxH = height * 0.05 + paddingY * 2;
  fill(0, 150);
  rectMode(CENTER);
  rect(width / 2, height * 0.05, boxW, boxH, 10);
  fill(255);
  text(eraText, width / 2, height * 0.05);
  pop();

  // Era description above human
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(height * 0.025);
  let desc = eras[currentEra].description;
  let period = eras[currentEra].period;
  let fullText = desc + "\n" + period;
  let longestLine = max(textWidth(desc), textWidth(period));
  let descBoxW = longestLine + paddingX * 2;
  let descBoxH = height * 0.05 + paddingY * 2;
  let descBoxX = humanX + spriteWidth / 2;
  let descBoxY = eraHumanBaseline - spriteHeight - descBoxH / 2 - 10;
  fill(0, 150);
  rect(descBoxX, descBoxY, descBoxW, descBoxH, 8);
  fill(255);
  text(fullText, descBoxX, descBoxY);
  pop();

  // Human movement
  let moving = false;
  if (keyIsDown(RIGHT_ARROW)) {
    humanX += humanSpeed;
    moving = true;
    if (humanX + spriteWidth > width) {
      if (currentEra < eras.length - 1) {
        currentEra++;
        humanX = 0;
      } else {
        state = "begin";
        humanX = width * 0.05;
        humanY = eraHumanBaseline;
      }
    }
  }
  if (keyIsDown(LEFT_ARROW)) {
    humanX -= humanSpeed;
    moving = true;
    if (humanX < 0) {
      if (currentEra > 0) {
        currentEra--;
        humanX = width - spriteWidth;
      } else {
        state = "begin";
        humanX = width * 0.05;
        humanY = eraHumanBaseline;
      }
    }
  }

  if (moving) animateHuman();
  else frameIndex = 0;

  // Draw human
  let humanSprite = eras[currentEra].sprite[frameIndex];
  let humanRectY = eraHumanBaseline - spriteHeight; // bottom-aligned
  image(humanSprite, humanX, humanRectY, spriteWidth, spriteHeight);
}

function animateHuman() {
  frameCountForAnim++;
  if (frameCountForAnim % 10 === 0) {
    frameIndex = (frameIndex + 1) % eras[currentEra].sprite.length;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleElements();
}
