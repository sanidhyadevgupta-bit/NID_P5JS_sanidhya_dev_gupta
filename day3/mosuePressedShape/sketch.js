function setup(){
    createCanvas(400,400);
    background(220);
}
function mousePressed(){
  let petalSize= random(50,100); //randomizer for petal size
    drawFlower(mouseX,mouseY,petalSize);
}
function drawFlower(x,y,z){
    fill(random(0,250),0,0); //using randomizer tochange petal color
    noStroke();
    ellipse(x,y+z/2,z);  //bottom
    ellipse(x,y-z/2,z);  //top
    ellipse(x-z/2,y,z);  //left
    ellipse(x+z/2,y,z); //right
    fill("yellow");
    ellipse(x,y,z);  //center
}
function draw(){
    
}