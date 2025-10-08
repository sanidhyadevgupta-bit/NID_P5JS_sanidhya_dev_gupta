function setup(){
    createCanvas(400,400);
    background(220);
}
function mousePressed(){
    drawFlower(mouseX,mouseY,100);
}
function drawFlower(x,y,z){
    fill("red");
    noStroke();
    ellipse(x,y+50,z);  //bottom
    ellipse(x,y-50,z);  //top
    ellipse(x-50,y,z);  //left
    ellipse(x+50,y,z); //right
    fill("yellow");
    ellipse(x,y,z);  //center
}
function draw(){
    
}