function setup() {
  createCanvas(400, 400);
  background(220);
}
function mouseClicked(){
  //get mouse pos ---> mouseX,mouseY
  
  if(mouseX<width/2 && mouseY<height/2){
    fill("yellow");
    ellipse(mouseX,mouseY,50);
  }
  else if(mouseX>width/2 && mouseY<height/2){
  fill("cyan");
  rect(mouseX,mouseY,20,40);
  }
  else if(mouseX<width/2 && mouseY>height/2){
  fill("orange");
  rect(mouseX,mouseY,20,40);
  }
  else{
    fill("red");
    ellipse(mouseX,mouseY,50);
  }
  // if mouseX<width/2== left
  // if mouseX>width/2== right

}

function draw() {
  
}
