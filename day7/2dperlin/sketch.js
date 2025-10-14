function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  for(let i=0;i<width;i+=5){
    for(let j=0;j<height;j+=5){
    let outputNoise= noise((i+frameCount)*0.01,(j)*0.01);
    fill(outputNoise*225);
    noStroke();
    rect(i,j,5,5);
    }
  } 
}
