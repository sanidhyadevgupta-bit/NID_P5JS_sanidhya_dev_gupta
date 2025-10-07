
function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  
  drawEyes(mouseX,100);
  drawEyes(mouseX,200);
  drawEyes(mouseX,150);
 
}
function drawEyes(x,y){
  strokeWeight(2);
  ellipse(x,y,20);
  ellipse(x,y,10);
  ellipse(x+20,y,20);
  ellipse(x+20,y,10);

  
  

}
y