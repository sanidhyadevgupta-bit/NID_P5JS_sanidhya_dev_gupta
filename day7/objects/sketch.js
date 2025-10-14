let myflower = [];
let tempflower;
function setup() {
  createCanvas(400, 400);
}
function mousePressed() {
  tempflower = new Flower(mouseX, mouseY, random(-2, 2), random(-2, 2));
  myflower.push(tempflower);
}

function draw() {
  background(220);
  for (let i = 0; i < myflower.length; i++) {
    //check if the mouse is on flower
    myflower[i].checkPos(mouseX, mouseY);
    //check colision
    for (let j = 0; j < myflower.length; j++) {
      if (i != j) {
        myflower[i].checkColision(myflower[j]);
      }
    }
    //this moves and draw the flowers
    myflower[i].move();
    myflower[i].drawFlower();

  }

}
