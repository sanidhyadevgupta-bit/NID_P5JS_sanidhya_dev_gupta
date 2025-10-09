let size = 200;
let colour=[];
colour=["#30095cff","#ce90d6de","#A020F0","#e058d5ff"];
function setup() {
  createCanvas(innerWidth, innerHeight);
  rectMode(CENTER);
  angleMode(DEGREES);


}

function draw() {
  background(20);
  //create a grid of squares
  for (let i = 0; i < width; i = i + size) {
    for (let j = 0; j < height; j = j + size) {
      let random1=floor(random(0,colour.length));
      fill(colour[random1]);
      push();
      translate(i, j);
      rotate(frameCount * 10);
      rect(0, 0, size / 2 * sin(frameCount), size / 2 * sin(frameCount));
      pop();
    }

  }
}
