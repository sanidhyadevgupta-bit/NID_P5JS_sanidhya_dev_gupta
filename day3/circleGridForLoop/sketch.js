function setup() {
  createCanvas(500, 500);
  background(220);
}

function draw() {
  let size=50;
  for(let i=0;i<width;i=i+size){
    for(let j=0;j<height;j=j+size){
    ellipse(i+size/2,j+size/2,size);
    }
  }

}
