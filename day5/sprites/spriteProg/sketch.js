let spriteImage;
let sRows = 4;
let sCol = 8;
let sprites = [];
let count = 0;
let xPos = 0;
let speed=5;
let yPos = 0;


function preload() {
  spriteImage = loadImage("sprite_sheets/1dSprites.png");
}
function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(24);
  let sWidth = spriteImage.width / sCol;
  let sHeight = spriteImage.height / sRows;
  //loop the sprite img and store it in a array
  for (let i = 0; i < sRows; i++) {
    for (let j = 0; j < sCol; j++) {
      //get each slice of the sprites in the array
      sprites[sprites.length] = spriteImage.get(j * sWidth, i * sHeight, sWidth, sHeight);
      // image.get(x,y,width,hieght) to get a section of the original img

    }
  }
  console.log(sprites);
}
function keyPressed() {
  if (keyIsDown(LEFT_ARROW)) {//left
    xPos-=speed;
  }
  else if (keyIsDown(RIGHT_ARROW)) {//right
    xPos+=speed;
  }
  else if (keyIsDown(UP_ARROW)) {//up
    yPos-=speed;
  }
  else if (keyIsDown(DOWN_ARROW)) {//down
    yPos+=speed;
  }
  if (keyIsPressed) {
    count++;
    image(sprites[count % sprites.length],xPos,yPos);
  }

}
function draw() {
  background(0);
  keyPressed();
}
