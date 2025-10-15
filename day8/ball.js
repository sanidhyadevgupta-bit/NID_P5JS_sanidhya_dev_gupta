
class Ball {
    constructor(x, y,size, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size=size;

    }

    showBall() {
        noStroke();
        fill(0);
        ellipse(this.x, this.y, this.size );

    }
    moveBall() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
        if (this.x < 0 || this.x > width) {
            this.xSpeed = -this.xSpeed;
        }


        
    }
    checkCollisonPaddle(paddle){
          if(this.x<paddle.x+paddle.w &&
      this.x > paddle.x &&
      this.y<paddle.y + paddle.h &&
      this.y > paddle.y
    ) {
      console.log("BAM!!");
      this.xSpeed = -this.xSpeed;
    }
  }
  checkCollisionWall() {
    if(this.y <this.size/2 || this.y>height-this.size/2) {
      this.ySpeed = -this.ySpeed;
    }
  } 
  checkWinner() {
    if(this.x<0) {
      return 2;
    } else if(this.x>width) {
      return 1;
    } else {
      return 0;
    }
  }
  reset() {
    this.x = width/2;
    this.y = height/2;
  }

    }

 
