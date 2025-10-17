// ---------------- Eras ----------------
let eras = [
  { name: "Prehistoric", bgPath: "prehistoric.png", description: "Early humans relied on stone tools, fire, and hunting-gathering. They lived in small groups and slowly developed language, art, and social structures.", period: "2.5 million - 3000 BCE" },
  { name: "Ancient", bgPath: "ancient.png", description: "The rise of civilizations saw the development of cities, writing systems, organized governments, trade networks, and large empires like Egypt, Mesopotamia, and Rome.", period: "3000 BCE - 500 CE" },
  { name: "Medieval", bgPath: "medieval.png", description: "Societies were feudal, with kings, knights, and castles. Religion played a central role. Agriculture and trade expanded, and towns began forming.", period: "500 CE - 1500 CE" },
  { name: "Industrial", bgPath: "industrial.png", description: "The Industrial Revolution introduced mechanization, factories, steam engines, and mass production. Societies shifted from rural to urban, transforming work and daily life.", period: "1750 CE - 1900 CE" },
  { name: "Modern", bgPath: "modern.png", description: "Advances in technology, medicine, and communication shaped contemporary society. Globalization, cities, and digital innovations define this era.", period: "1900 CE - Present" }
];

let state = "begin"; 
let currentEra = 0;

// ---------------- Human ----------------
let human;
let idleSheet, walkSheet;

// ---------------- Blocks & Portals ----------------
let blocks = [];
let beginPortal = null;
let eraReturnPortal = null;

// Jump mechanics
let gravity = 0.6;
let jumpForce = -16;  
let verticalVelocity = 0;
let isJumping = false;

// Baseline
let eraHumanBaseline;

// ---------------- Preload ----------------
function preload() {
  idleSheet = loadImage("Idle.png");   // 7 frames
  walkSheet = loadImage("Walk.png");   // 10 frames
  for (let e of eras) e.bg = loadImage(e.bgPath);
}

// ---------------- Setup ----------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  eraHumanBaseline = height - height * 0.12;

  human = new Human(width * 0.05, eraHumanBaseline, idleSheet, walkSheet, {idle:7, walk:10});

  // Create blocks
  let blockWidth = width * 0.08;
  let blockHeight = blockWidth;
  let margin = width * 0.03;
  let startX = (width - (5*blockWidth + 4*margin))/2;
  let blockY = eraHumanBaseline - human.height - blockHeight - 40; 

  for (let i=0;i<5;i++){
    blocks.push(new Block(startX + i*(blockWidth+margin), blockY, blockWidth, blockHeight, i));
  }

  textAlign(CENTER, CENTER);
}

// ---------------- Draw Loop ----------------
function draw() {
  if (state === "begin") drawBeginScreen();
  else if (state === "era") drawEraScreen();
}

// ---------------- Begin Screen ----------------
function drawBeginScreen() {
  background(100, 150, 200);

  fill(0);
  textSize(height * 0.06);
  text("Human Evolution", width / 2, height * 0.1);
  textSize(height * 0.03);
  text("Use LEFT/RIGHT arrows to move, SPACE to jump!", width / 2, height * 0.15);

  // Ground
  fill(100, 50, 20);
  rect(0, eraHumanBaseline, width, height * 0.12);

  // Display thumbnails above blocks
  for (let i = 0; i < blocks.length; i++) {
    let thumbX = blocks[i].x;
    let thumbY = blocks[i].y - blocks[i].h - 20;
    if (eras[i].bg) imageMode(CORNER), image(eras[i].bg, thumbX, thumbY, blocks[i].w, blocks[i].h);
    fill(255);
    textSize(16);
    textAlign(CENTER, BOTTOM);
    text(eras[i].name, thumbX + blocks[i].w/2, thumbY - 5);
  }

  // Human movement
  if (keyIsDown(RIGHT_ARROW)) human.move(1);
  else if (keyIsDown(LEFT_ARROW)) human.move(-1);
  else human.move(0);

  human.x = constrain(human.x, human.width/2, width - human.width/2);

  // Jumping
  if (isJumping) {
    verticalVelocity += gravity;
    human.y += verticalVelocity;
    if (human.y >= eraHumanBaseline) {
      human.y = eraHumanBaseline;
      isJumping = false;
      verticalVelocity = 0;
    }
  }

  // Check if any portal is open
  let anyPortalOpen = blocks.some(b => b.hit);

  // Block collision - toggle portal
  for (let b of blocks){
    if ((!anyPortalOpen || b.hit) && b.togglePortal(human)){
      beginPortal = b.hit ? new Portal(
          width - 150,                 
          eraHumanBaseline - 50,
          80, 80,
          "green",
          "To " + eras[b.eraIndex].name + " Era"
      ) : null;

      // Lock other blocks while portal is open
      for (let other of blocks){
        if (other !== b) other.hit = false;
      }
      break;
    }
  }

  // Draw blocks and portal
  for (let b of blocks) b.show();
  if (beginPortal) beginPortal.show();

  human.update();
  human.show();

  // Transition to era
  if (beginPortal && checkPortalCollision(human, beginPortal)) {
    currentEra = blocks.find(b => b.hit).eraIndex;
    state = "era";
    human.x = human.width; 
    human.y = eraHumanBaseline;
    beginPortal = null;
    eraReturnPortal = new Portal(width - 150, eraHumanBaseline - 50, 80, 80, "red", "Back to Beginning");
  }
}

// ---------------- Era Screen ----------------
function drawEraScreen() {
  if (eras[currentEra].bg) {
    imageMode(CORNER);
    image(eras[currentEra].bg, 0, 0, width, height);
  } else background(150);

  fill(100, 50, 20);
  rect(0, eraHumanBaseline, width, height * 0.12);

  // Era name and info
  fill(255);
  textSize(height * 0.05);
  textAlign(CENTER, CENTER);
  text(eras[currentEra].name, width / 2, height * 0.05);

  let padding = 20;
  let boxWidth = width * 0.6;
  let boxHeight = height * 0.15;
  let boxX = width / 2;
  let boxY = height * 0.12 + boxHeight / 2;

  push();
  rectMode(CENTER);
  fill(0, 150);
  rect(boxX, boxY, boxWidth, boxHeight, 10);
  fill(255);
  textSize(height * 0.025);
  textAlign(CENTER, CENTER);
  textLeading(28);
  text(eras[currentEra].description + "\n" + eras[currentEra].period, boxX, boxY, boxWidth - padding, boxHeight - padding);
  pop();

  // Movement
  if (keyIsDown(RIGHT_ARROW)) human.move(1);
  else if (keyIsDown(LEFT_ARROW)) human.move(-1);
  else human.move(0);

  human.x = constrain(human.x, human.width/2, width - human.width/2);

  human.update();
  human.show();

  // Return portal
  if (eraReturnPortal) eraReturnPortal.show();

  // Check return
  if (eraReturnPortal && checkPortalCollision(human, eraReturnPortal)) {
    state = "begin";
    human.x = width * 0.05;
    human.y = eraHumanBaseline;
    for (let b of blocks) b.hit = false;
    beginPortal = null;
    eraReturnPortal = null;
  }
}

// ---------------- Portal Collision ----------------
function checkPortalCollision(human, portal) {
  if (!portal) return false;

  let hb = human.getBounds();
  let px = portal.baseX + portal.w/2;
  let py = portal.baseY;
  let rx = portal.w / 2;
  let ry = portal.h / 2;

  let closestX = constrain(px, hb.x1, hb.x2);
  let closestY = constrain(py, hb.y1, hb.y2);

  let dx = px - closestX;
  let dy = py - closestY;

  return (dx*dx)/(rx*rx) + (dy*dy)/(ry*ry) <= 1;
}

// ---------------- Key pressed ----------------
function keyPressed(){
  if (keyCode === 32 && !isJumping){ 
    verticalVelocity = jumpForce;
    isJumping = true;
  }
}

// ---------------- Human Class ----------------
class Human {
  constructor(x, y, idleSheet, walkSheet, frameCounts) {
    this.x = x;
    this.y = y;
    this.idleSheet = idleSheet;
    this.walkSheet = walkSheet;
    this.frameCounts = frameCounts;

    this.frameIndex = 0;
    this.frameCounter = 0;
    this.currentAnim = "idle";
    this.facing = 1;

    let singleFrameWidth = idleSheet.width / frameCounts.idle;
    let singleFrameHeight = idleSheet.height;
    let desiredHeight = height * 0.25;
    this.height = desiredHeight;
    this.width = desiredHeight * (singleFrameWidth / singleFrameHeight);
  }

  move(dir){
    if (dir !== 0){
      this.currentAnim = "walk";
      this.facing = dir;
      this.x += dir*10;
    } else this.currentAnim = "idle";
  }

  update(){
    this.frameCounter++;
    if (this.frameCounter % 5 === 0){
      this.frameCounter = 0;
      this.frameIndex++;
      let count = this.currentAnim==="idle"?this.frameCounts.idle:this.frameCounts.walk;
      if (this.frameIndex >= count) this.frameIndex = 0;
    }
  }

  show(){
    let sheet = this.currentAnim==="idle"?this.idleSheet:this.walkSheet;
    let frameCount = this.currentAnim==="idle"?this.frameCounts.idle:this.frameCounts.walk;
    let frameW = sheet.width / frameCount;
    let sx = this.frameIndex * frameW;

    push();
    translate(this.x, this.y - this.height/2);
    scale(this.facing,1);
    imageMode(CENTER);
    image(sheet, 0, 0, this.width, this.height, sx, 0, frameW, sheet.height);
    pop();
  }

  getBounds(){
    return { x1:this.x-this.width/2, y1:this.y-this.height, x2:this.x+this.width/2, y2:this.y };
  }
}

// ---------------- Block Class ----------------

class Block {
  constructor(x, y, w, h, eraIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hit = false;
    this.readyToToggle = true;
    this.eraIndex = eraIndex;
  }

  show() {
    fill(this.hit ? "grey" : "yellow");
    rect(this.x, this.y, this.w, this.h);
  }

  togglePortal(human) {
    let hb = human.getBounds();
    let humanCenterX = (hb.x1 + hb.x2) / 2;

    // Human must be under the block (centered)
    let horizontallyAligned = humanCenterX > this.x + this.w * 0.2 &&
                              humanCenterX < this.x + this.w * 0.8;

    // Human's head must touch the bottom of the block WHILE moving upward
    let hittingFromBelow =
      isJumping && verticalVelocity < 0 && // must be jumping UP
      hb.y1 <= this.y + this.h && hb.y1 >= this.y + this.h - 20; // within tight vertical range

    if (horizontallyAligned && hittingFromBelow && this.readyToToggle) {
      this.hit = !this.hit;
      this.readyToToggle = false;
      return true;
    }

    // Reset toggle when human moves away from the block or stops colliding
    if (hb.y1 > this.y + this.h || !horizontallyAligned) {
      this.readyToToggle = true;
    }

    return false;
  }
}



// ---------------- Portal Class ----------------
class Portal {
  constructor(x, y, w, h, col, labelText = null){
    this.baseX = x;
    this.baseY = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.labelText = labelText;
  }

  show(){
    fill(this.col);
    noStroke();
    ellipse(this.baseX + this.w/2, this.baseY, this.w, this.h);

    if (this.labelText){
      fill(255);
      textSize(18);
      textAlign(CENTER, BOTTOM);
      text(this.labelText, this.baseX + this.w/2, this.baseY - this.h/2 - 5);
    }
  }
}

// ---------------- Window Resize ----------------
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  eraHumanBaseline = height - height*0.12;
}
