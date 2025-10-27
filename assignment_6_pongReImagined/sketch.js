// sketch.js
// SYNERGY Pong with Start Screen (rainbow layered triangle + "press any key to proceed")

let ball;
let leftPaddle, rightPaddle;
let pg; // Offscreen graphics for painting
let hitCount = 0;
const hitTarget = 30;
let achievementAlpha = 0;

let bgScore, hitSound; // sounds
let started = false; // whether we've proceeded past the start screen

function preload() {
  soundFormats('mp3', 'wav');
  bgScore = loadSound('bgScore.mp3'); // make sure file is present
  hitSound = loadSound('hit.wav');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // create offscreen painting buffer (game uses this)
  pg = createGraphics(window.innerWidth, window.innerHeight);
  pg.background(0);

  // paddles and ball (initialized now but game won't run until started)
  leftPaddle = new Paddle(50, height / 2 - 60, 20, 120, "left");
  rightPaddle = new Paddle(width - 70, height / 2 - 60, 20, 120, "right");
  ball = new Ball();

  textAlign(CENTER, CENTER);
  textFont('Arial Black');
}

function draw() {
  background(0);

  if (!started) {
    drawStartScreen();
    return; // skip the game draw until user presses a key
  }

  // once started, ensure music is playing (some browsers require user gesture)
  if (bgScore && !bgScore.isPlaying()) {
    bgScore.loop();
    bgScore.setVolume(0.3);
  }

  // Game: show painting buffer
  image(pg, 0, 0);

  // Update/draw paddles and ball
  leftPaddle.update();
  rightPaddle.update();
  leftPaddle.display();
  rightPaddle.display();

  ball.move();
  ball.display(pg);
  ball.checkEdges();
  ball.checkPaddleCollision(leftPaddle);
  ball.checkPaddleCollision(rightPaddle);

  // Foreground SYNERGY text
  push();
  noStroke();
  fill(255, 200);
  textSize(width / 6);
  text("SYNERGY", width / 2, height / 2);
  pop();

  // Central dynamic text (LOST / Hits / ACHIEVED)
  let displayText = "";
  let targetAlpha = 0;

  if (hitCount === 0 && ball.lost) {
    displayText = "LOST";
    targetAlpha = 200;
  } else if (hitCount > 0 && hitCount < hitTarget) {
    displayText = "Hits: " + hitCount;
    targetAlpha = 200;
  } else if (hitCount >= hitTarget) {
    displayText = "ACHIEVED";
    targetAlpha = 200;
  }

  achievementAlpha = lerp(achievementAlpha, targetAlpha, 0.05);

  if (achievementAlpha > 1) {
    push();
    textSize(width / 40);
    fill(
      displayText === "ACHIEVED" ? color(0, 255, 0, achievementAlpha)
      : displayText === "LOST" ? color(255, 0, 0, achievementAlpha)
      : color(255, 255, 255, achievementAlpha)
    );
    text(displayText, width / 2, height / 2 + height / 6);
    pop();
  }
}

// Draw the start screen: rainbow layered triangle behind SYNERGY headline
function drawStartScreen() {
  // black background
  background(0);

  // parameters
  const cx = width / 2;
  const cy = height / 2 - height * 0.05; // a little up so "press any key" sits below
  const triSize = min(width, height) * 0.55;
  const layers = 18; // number of rainbow layers
  colorMode(HSB, 360, 100, 100, 100);

  // Draw layered rainbow triangle (back to front)
  for (let i = layers - 1; i >= 0; i--) {
    let t = i / (layers - 1); // 0..1
    // hue across rainbow (red -> violet)
    let hue = lerp(0, 280, t); // hue in degrees
    // size shrinks towards front
    let s = triSize * (0.7 + 0.3 * (i / layers));
    // alpha slightly translucent so text shows through
    let alpha = map(i, 0, layers - 1, 30, 90);

    fill(hue, 90, 100, alpha);
    noStroke();

    // equilateral triangle centered at (cx, cy)
    // compute three vertices
    let h = s * (Math.sqrt(3) / 2); // height of equilateral triangle
    let x1 = cx;
    let y1 = cy - (2 / 3) * h; // top vertex
    let x2 = cx - s / 2;
    let y2 = cy + (1 / 3) * h;
    let x3 = cx + s / 2;
    let y3 = cy + (1 / 3) * h;

    triangle(x1, y1, x2, y2, x3, y3);
  }

  colorMode(RGB);

  // Foreground SYNERGY (large)
  push();
  textAlign(CENTER, CENTER);
  textSize(min(width, height) / 6);
  fill(255, 230);
  noStroke();
  text("SYNERGY", cx, cy - (min(width, height) * 0.02));
  pop();

  // "press any key to proceed" below
  push();
  textSize(min(width, height) / 30);
  fill(255, 180);
  text("press any key to proceed", cx, cy + min(width, height) * 0.25);
  pop();

  // small hint: show controls lightly
  push();
  textSize(min(width, height) / 60);
  fill(255, 120);
  text("W / S  — left paddle   |   ↑ / ↓  — right paddle", cx, height - 40);
  pop();
}

// start the game when user presses any key
function keyPressed() {
  if (!started) {
    started = true;

    // clear the painting buffer so game starts fresh (optional)
    pg = createGraphics(window.innerWidth, window.innerHeight);
    pg.background(0);

    // start background music (user gesture allowed)
    if (bgScore && !bgScore.isPlaying()) {
      bgScore.loop();
      bgScore.setVolume(0.3);
    }
    return;
  }

  // pass keystroke to game controls as usual (handled by keyIsDown in update)
}

// window resize: keep painting by scaling old art into new buffer
function windowResized() {
  // if game not started just resize canvas
  resizeCanvas(window.innerWidth, window.innerHeight);

  if (!started) return;

  // Save and rescale previous painting to new pg
  let oldArt = pg.get();
  pg = createGraphics(window.innerWidth, window.innerHeight);
  pg.image(oldArt, 0, 0, window.innerWidth, window.innerHeight);

  // reposition paddles x positions
  leftPaddle.x = 50;
  rightPaddle.x = width - 70;
}

/* -------------------------
   Game classes (unchanged)
   -------------------------*/

class Ball {
  constructor() {
    this.size = 25;
    this.justHit = false;
    this.lost = true;
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random([-5, 5]);
    this.ySpeed = random([-5, 5]);
    this.col = color(random(255), random(255), random(255));
    this.size = 25;
    this.justHit = false;

    leftPaddle.reset();
    rightPaddle.reset();
    hitCount = 0;
    this.lost = true;
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.x > 200 && this.x < width - 200) this.justHit = false;
  }

  display(g) {
    // Paint on the offscreen buffer
    g.noStroke();
    g.fill(red(this.col), green(this.col), blue(this.col), 200);
    g.ellipse(this.x, this.y, this.size);

    // Draw main visible ball
    push();
    translate(this.x, this.y);

    // Fill color
    fill(this.col);

    // More prominent outline
    let outlineCol = color(
      255 - red(this.col),
      255 - green(this.col),
      255 - blue(this.col)
    );
    stroke(outlineCol);
    strokeWeight(6);
    ellipse(0, 0, this.size);

    pop();
  }

  checkEdges() {
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
    if (this.x < 0 || this.x > width) {
      this.reset();
      this.col = color(random(255), random(255), random(255));
    }
  }

  checkPaddleCollision(paddle) {
    if (this.justHit) return;

    if (
      this.x - this.size / 2 < paddle.x + paddle.w &&
      this.x + this.size / 2 > paddle.x &&
      this.y > paddle.y &&
      this.y < paddle.y + paddle.h
    ) {
      this.xSpeed *= -1;
      this.ySpeed += random(-1, 1);
      this.size = constrain(this.size + 2, 10, 150);

      // Both paddles grow and speed up
      leftPaddle.h = constrain(leftPaddle.h + 10, 50, height * 0.8);
      rightPaddle.h = constrain(rightPaddle.h + 10, 50, height * 0.8);
      leftPaddle.speed *= 1.05;
      rightPaddle.speed *= 1.05;

      if (hitSound && started) hitSound.play();

      this.justHit = true;
      hitCount++;
      this.lost = false;

      // Ball speeds up a bit
      let speedMultiplier = 1.05;
      this.xSpeed *= speedMultiplier;
      this.ySpeed *= speedMultiplier;
    }
  }
}



class Paddle {
  constructor(x, y, w, h, side) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.defaultH = h;
    this.defaultSpeed = 6;
    this.speed = this.defaultSpeed;
    this.side = side;
  }

  update() {
    if (this.side === "left") {
      if (keyIsDown(87)) this.y -= this.speed; // W
      if (keyIsDown(83)) this.y += this.speed; // S
    }
    if (this.side === "right") {
      if (keyIsDown(UP_ARROW)) this.y -= this.speed;
      if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
    }
    this.y = constrain(this.y, 0, height - this.h);
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.w, this.h, 5);
  }

  reset() {
    this.h = this.defaultH;
    this.speed = this.defaultSpeed;
    this.y = height / 2 - this.h / 2;
  }
}
