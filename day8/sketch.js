let player1 = 0;
let player2 = 0;
let score1=0;
let score2=0;
let ball = 0;
function setup() {
  createCanvas(innerWidth, innerHeight);
  player2 = new Lpaddle(10, height / 2, width/100, height/10, 10)
  player1 = new Rpaddle(width - width/100-10, height / 2, width/100, height/10, 10);
  ball = new Ball(width/2,height/2,width/50,5,5);
}

function draw() {
  background(225);
  player1.movePaddle();
  player1.showPaddle();
  player2.movePaddle();
  player2.showPaddle();
  ball.moveBall();
  ball.checkCollisonPaddle(player1);
  ball.checkCollisonPaddle(player2);
  ball.checkCollisionWall();
  ball.showBall();
   let point = ball.checkWinner();
  if(point == 1) {
    score1++;
    ball.reset();
    console.log("p1 vs p2 :" + score1 + " " + score2)
  } else if(point ==2 ) {
    score2++;
    ball.reset();
    console.log("p1 vs p2 :" + score1 + " " + score2)
}
}
