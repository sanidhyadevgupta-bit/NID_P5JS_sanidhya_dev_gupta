function setup() {
  createCanvas(400, 400);
  background(225);
}

function draw() {

noStroke();
fill(mouseX,mouseY,mouseX);

//* using mousex ,mousey,width and heightfor creating a paint tool that is symetrical  along x and y axis

ellipse(mouseX,mouseY,50);
ellipse(width-mouseX,height-mouseY,50);
ellipse(width-mouseX,mouseY,50);
ellipse(mouseX,height-mouseY,50);
}

