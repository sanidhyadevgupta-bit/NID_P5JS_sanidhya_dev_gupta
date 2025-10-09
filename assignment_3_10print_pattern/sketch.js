let cols, rows;
let size = 20;
let fontGraphics;

function setup() {
  frameRate(10);
  createCanvas(innerWidth, innerHeight);
  cols = width / size;
  rows = height / size;
  
  // Create an offscreen graphics buffer to draw text and check pixels
  fontGraphics = createGraphics(width, height);
  fontGraphics.pixelDensity(1);
  fontGraphics.background(0);
  fontGraphics.textSize(200);
  fontGraphics.textAlign(CENTER, CENTER);
  fontGraphics.fill(255);
  fontGraphics.text("SANIDHYA", width / 2, height / 2);
  fontGraphics.loadPixels();
  
  background(0);
  stroke(255);
  strokeWeight(2);
  
}

function draw() {
  background(0);
  
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      let idx = 4 * (int(y) * fontGraphics.width + int(x));
      let brightness = fontGraphics.pixels[idx];
      
      // Check if pixel belongs to the "COOL" text area
      if (brightness > 100) {
        stroke(255, random(150,255), random(150,255));
        if (random(1) < 0.5) {
          line(x, y, x + size, y + size);
        } else {
          line(x + size, y, x, y + size);
        }
      } else {
        // optional background 10PRINT pattern
        stroke(100, 50);
        if (random(1) < 0.5) {
          line(x, y, x + size, y + size);
        } else {
          line(x + size, y, x, y + size);
        }
      }
    }
  }
}