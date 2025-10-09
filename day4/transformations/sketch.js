let x = 0;
let y = 0;
let numPetals = 0;

function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(DEGREES);

}

function drawFlower(x, y, numPetals) {
  push();
  translate(x, y); //translate() is usedn to change the origin of the canvas
  rotate(mouseX);
  
  ellipse(0, 0, 50);
  for (let i = 0; i < numPetals; i++) {
    noStroke();
    fill(240, 0, 0, 40);
    ellipse(100, 0, 100, 50);
    rotate(360 / numPetals);
  }
  pop();

}

function draw() {
  background(20);
  for(i=0;i<width;i+=300){
    for(j=0;j<height;j+=300){
  drawFlower(i,j, 20);
}
  }
}

