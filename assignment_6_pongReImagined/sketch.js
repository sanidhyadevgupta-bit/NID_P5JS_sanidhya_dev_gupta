let ball;
let leftPaddle, rightPaddle;
let pg; // Offscreen graphics for painting
let hitCount = 0; // Tracks successful paddle hits
const hitTarget = 30; // Hits needed to ACHIEVE
let achievementAlpha = 0; // For smooth fade

// Sounds
let bgScore, hitSound;

function preload() {
  soundFormats('mp3', 'wav');
  bgScore = loadSound('bgScore.mp3');
  hitSound = loadSound('hit.wav');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  pg = createGraphics(window.innerWidth, window.innerHeight);
  pg.background(0);

  leftPaddle = new Paddle(50, height / 2 - 60, 20, 120, "left");
  rightPaddle = new Paddle(width - 70, height / 2 - 60, 20, 120, "right");
  ball = new Ball();

  textAlign(CENTER, CENTER);
  textFont('Arial Black');

  // Loop background music at low volume
  bgScore.loop();
  bgScore.setVolume(0.3);
}

function draw() {
  image(pg, 0, 0);

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
  fill(255, 200); // Reduced alpha
  textSize(width / 6);
  text("SYNERGY", width / 2, height / 2);
  pop();

  // Central dynamic text
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
    textSize(width / 80);
    fill(
      displayText === "ACHIEVED" ? color(0, 255, 0, achievementAlpha)
      : displayText === "LOST" ? color(255, 0, 0, achievementAlpha)
      : color(255, 255, 255, achievementAlpha)
    );
    text(displayText, width / 2, height / 2 + height / 6);
    pop();
  }
}

function windowResized() {
  let oldArt = pg.get();
  resizeCanvas(window.innerWidth, window.innerHeight);
  pg = createGraphics(window.innerWidth, window.innerHeight);
  pg.image(oldArt, 0, 0, window.innerWidth, window.innerHeight);
  leftPaddle.x = 50;
  rightPaddle.x = width - 70;
}

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

    if (this.x > 200 && this.x < width - 200) {
      this.justHit = false;
    }
  }

  display(g) {
    g.noStroke();
    g.fill(this.col);
    g.ellipse(this.x, this.y, this.size);

    push();
    noFill();
    let outlineCol = color(255 - red(this.col), 255 - green(this.col), 255 - blue(this.col));
    stroke(outlineCol);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size + 2);
    pop();
  }

  checkEdges() {
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }

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

      // BOTH paddles grow
      leftPaddle.h = constrain(leftPaddle.h + 10, 50, height * 0.8);
      rightPaddle.h = constrain(rightPaddle.h + 10, 50, height * 0.8);

      // Increase paddle speed by 5% each hit
      leftPaddle.speed *= 1.05;
      rightPaddle.speed *= 1.05;

      // Play hit sound
      hitSound.play();

      this.justHit = true;
      hitCount++;
      this.lost = false;

      // Slightly increase ball speed
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
