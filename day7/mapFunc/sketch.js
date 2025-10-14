let progress=0;  
function setup() {
  createCanvas(innerWidth,innerHeight);
}

function draw() {
  background(progress);//map(value,inputStart,inputend,outputStart,outputEnd)
  progress=map(mouseX,0,innerWidth,255,0);



}
