class Flower {
  constructor(x, y, numPetals = 6) {
    this.x = x;
    this.y = y;

    this.numPetals = numPetals;
    this.currentScale = 0.2;
    this.maxScale = 1.2;
    this.startY = y;
    this.endY = 100;

    this.speed = random(1, 3);

    // random colors
    this.centerColor = color(random(200, 255), random(200, 255), 0);  // yellowish
    this.petalColor = color(random(100, 255), random(50, 200), random(50, 200),50); // vibrant
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.currentScale);

    // draw center
    fill(this.centerColor);
    noStroke();
    ellipse(0, 0, 20);

    // draw petals
    fill(this.petalColor);
    for (let i = 0; i < this.numPetals; i++) {
      ellipse(0, -30, 20, 40);
      rotate(360 / this.numPetals);
    }
    pop();
  }

  move() {
    this.y -= this.speed;

    let progress = map(this.y, this.startY, this.endY, 0.2, this.maxScale);
    this.currentScale = constrain(progress, 0.2, this.maxScale);
  }

  offscreen() {
    return this.y < -50;
  }
}
