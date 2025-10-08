let x, y, size, choice;
function setup() {
  createCanvas(500, 500);
  background(220);
  x = 0;
  y = 0;
  size = 20;
}

function draw() {

  strokeWeight(2);
  stroke(random(0,250),random(0,250),random(0,250))
  //pick a random number
  choice = random(0,2);
  //if choice <0.5 ==/ else ==\
  if (choice < 0.5) {
    line(x + size, y, x, y + size);
    
  }
  else if(choice > 0.5 && choice<1.5){
    
    line(x,y+size,x,y);
    line(x,y,x+size,y);
  }
  else {
    line(x, y, x + size, y + size);
  }
  x = x + size; //move the pattern in x axis 
  if (x > width) {
    y = y + size; //move patter in the y direction
    x = 0;
  }

}
