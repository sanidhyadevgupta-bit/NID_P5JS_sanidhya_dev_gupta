Documentation & Explanation: Human Evolution Visualizer
Project Overview

This p5.js sketch visualizes human evolution through different eras:

Prehistoric

Ancient

Medieval

Industrial

Modern

Users can move the human character left and right.

Crossing the right edge moves to the next era; the left edge goes back.

Begin page shows all eras as thumbnails above the walking path.

Each era has a background image, description, time period, and the human character walking on a ground rectangle.

The human character is animated, with different frames for walking.

Variables and Data Structure
1. eras array

Holds data for each era:

let eras = [
  {
    name: "Prehistoric",
    sprite: [],        // Array of human sprites for animation
    bg: null,          // Background image object
    bgPath: "prehistoric.png", // File path for image
    description: "Early humans, stone tools, hunter-gatherers.",
    period: "2.5 million - 3000 BCE"
  },
  ...
];


sprite: Holds animation frames for the human character.

bg: The era’s background image loaded in preload().

description and period: Text displayed above the human character.

2. State Variables
let state = "begin";  // Can be "begin" or "era"
let currentEra = 0;   // Tracks which era the user is in


state: Determines whether we are on the Begin page or in a specific Era page.

currentEra: Index for the eras array (0 = Prehistoric, 4 = Modern).

3. Human Variables
let humanX, humanY;
let humanSpeed;
let spriteWidth, spriteHeight;
let frameIndex = 0;
let frameCountForAnim = 0;
let eraHumanBaseline;


humanX, humanY: Current position of the human on canvas.

humanSpeed: How fast the human moves per frame.

spriteWidth, spriteHeight: Size of the human sprite when drawn.

frameIndex: Current frame for walking animation.

frameCountForAnim: Counter used to switch frames periodically.

eraHumanBaseline: Y-coordinate representing the ground (so human is aligned with the ground).

p5.js Lifecycle Functions
1. preload()
function preload() {
  for (let e = 0; e < eras.length; e++) {
    eras[e].bg = loadImage(eras[e].bgPath);
    for (let i = 0; i < 2; i++) {
      let g = createGraphics(50, 120); 
      g.background(eras[e].bg ? eras[e].bg.get(0,0) : color(200));
      g.fill(255, 200, 0);
      g.rect(0, 40, 50, 80);       // body
      g.ellipse(25, 25, 50, 50);   // head fully inside canvas
      eras[e].sprite.push(g);
    }
  }
}


Explanation:

Loads background images for each era.

Creates placeholder human sprites for each era.

Taller canvas (120px) ensures the head isn’t cut.

Rect represents the body, ellipse represents the head.

These sprites are stored in eras[e].sprite.

In practice, you can replace these with actual pixel-art sprites for each era.

2. setup()
function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleElements();
  textAlign(CENTER, CENTER);
}


Creates a full-page canvas that scales with the browser window.

Calls scaleElements() to calculate sprite sizes and human speed.

Sets text alignment for titles, descriptions, and boxes.

3. scaleElements()
function scaleElements() {
  spriteHeight = height * 0.15; 
  spriteWidth = spriteHeight * 0.5;
  humanSpeed = width * 0.005;
  eraHumanBaseline = height - height * 0.1;
  humanX = width * 0.05;
  humanY = eraHumanBaseline;
}


Scales the human character relative to canvas height.

humanSpeed scales relative to canvas width.

eraHumanBaseline ensures the human is aligned with ground.

Called whenever the window resizes (windowResized()) or on setup.

Draw Loop
function draw() {
  if (state === "begin") drawBeginScreen();
  else drawEra();
}


Checks the current state (begin or era) and calls the corresponding function.

Begin Page Function
function drawBeginScreen() {
  background(100, 150, 200);

  // Title
  fill(0);
  textSize(height * 0.06);
  text("Human Evolution", width / 2, height * 0.1);
  textSize(height * 0.03);
  text("Use RIGHT arrow to start your journey!", width / 2, height * 0.15);

  // Thumbnails
  ...
  
  // Ground rectangle
  fill(100, 50, 20);
  rect(0, eraHumanBaseline, width, height * 0.1);

  // Human
  let humanSprite = eras[0].sprite[frameIndex];
  let humanRectY = eraHumanBaseline - spriteHeight;
  image(humanSprite, humanX, humanRectY, spriteWidth, spriteHeight);

  // Movement & animation
  ...
}


Explanation:

Displays title and instructions.

Draws era thumbnails above human (centered).

Adds ground rectangle so human stands on a path.

Draws the human bottom-aligned, using the first era sprite.

Moves the human with arrow keys, and transitions to first Era when reaching the right edge.

Animates human by cycling frameIndex every few frames.

Era Page Function
function drawEra() {
  if (eras[currentEra].bg) image(eras[currentEra].bg, 0, 0, width, height);
  else background(150);

  // Ground
  fill(100, 50, 20);
  rect(0, height - height*0.1, width, height*0.1);

  // Era name box
  ...
  
  // Description above human
  ...

  // Human movement
  ...

  // Draw human
  let humanSprite = eras[currentEra].sprite[frameIndex];
  let humanRectY = eraHumanBaseline - spriteHeight;
  image(humanSprite, humanX, humanRectY, spriteWidth, spriteHeight);
}


Explanation:

Displays the era background.

Draws the ground rectangle.

Shows era name in a semi-transparent rectangle.

Shows description and period above the human in a semi-transparent rectangle.

Moves the human left/right; transitions forward or backward between eras.

Human walking is animated using frameIndex.

Animation Function
function animateHuman() {
  frameCountForAnim++;
  if (frameCountForAnim % 10 === 0) {
    frameIndex = (frameIndex + 1) % eras[currentEra].sprite.length;
  }
}


Cycles through human sprite frames to create walking animation.

Changes frame every 10 draw cycles (adjustable).

Window Resize Handler
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleElements();
}


Ensures responsive canvas, scaling sprites, ground, and speed.

Key Features Recap

Responsive full-page canvas.

Begin page with era thumbnails above the human walking path.

Ground rectangle ensures human is always bottom-aligned.

Era pages display:

Era background

Era name in a semi-transparent box

Era description + period above human in a semi-transparent box

Walking animation with multiple frames.

Arrow key navigation:

Right → next era

Left → previous era or Begin page

Seamless transition between pages.