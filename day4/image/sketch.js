let size=100
let genImages=[];

function preload(){
  for(i=0;i<4;i++){
    let name="images/s"+i+".png";
    genImages[i]=loadImage(name);
  }
  /*
g0= loadImage("images/g0.png");
g1= loadImage("images/g1.png");
g2= loadImage("images/g2.png");
g3= loadImage("images/g3.png");
*/
}
function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(2);
}

function draw() {
  background(220);
  //nested loop
  for (let i = 0; i < width; i += size) {
    for (let j = 0; j < height; j += size) {
      //selecting choices and using image() to display the array
      let imgNum=genImages.length;
      let choice = floor(random(0, imgNum)); //floor returns a int value thus giving only 4 choices
      image(genImages[choice],i,j,size,size);
      /*if (choice == 0) {
        image(g0,i,j,size,size);
      }
      else if (choice == 1) {
        image(g1,i,j,size,size);
      }
      else if (choice == 2) {
        image(g2,i,j,size,size);
      }
      else {
        image(g3,i,j,size,size);
      }*/

      
    }
  }
}
