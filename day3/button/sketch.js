function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  rect(200,200,50,50);
}
function mouseClicked(){
  if((mouseX<250 && mouseX>200)&&(mouseY>200 && mouseY<250)){
    console.log("button cliked");
  }
  else{
  console.log("button not cliked");  
  }
}
