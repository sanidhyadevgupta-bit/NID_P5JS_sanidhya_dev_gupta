function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0,0,0,50);
  let noiseValue=noise(0.1*frameCount+1000);
  let noiseMapped=map(noiseValue,0,1,10,100);
  ellipse(mouseX,mouseY,noiseMapped);
  
}
