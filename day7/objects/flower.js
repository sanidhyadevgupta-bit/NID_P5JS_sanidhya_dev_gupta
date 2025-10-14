
class Flower{
    constructor(x,y,xSpeed,ySpeed){
        this.x=x;
        this.y=y;
        this.xSpeed=xSpeed;
        this.ySpeed=ySpeed;
        this.selected=false;
    }

    drawFlower(){
        noStroke();
        //fill("red");
        //ellipse(this.x,this.y,50,20);
        //ellipse(this.x,this.y,20,50);
        if(this.selected==true){
         fill("red");
        }
        else{
            fill("yellow");
        }
        ellipse(this.x,this.y,this.size=50);

    }
    move(){
        this.x=this.x+this.xSpeed;
        this.y=this.y+this.ySpeed;
        if(this.x<0 || this.x>width ){
            this.xSpeed=-this.xSpeed;
        }
        
        
        if(this.y<0 || this.y>height ){
            this.ySpeed=-this.ySpeed;
        }
    }
    checkPos(mX,mY){
        let distance=dist(mX,mY,this.x,this.y);
        if(distance<this.size/2){
            this.selected=true;
        }
        else{
             this.selected=false;
        }

    }
    checkColision(otherflower){
        let distance=dist(this.x,this.y,otherflower.x,otherflower.y);
        if(distance<(this.size/2+otherflower.size/2)){
        this.xSpeed=-this.xSpeed;
        this.ySpeed=-this.ySpeed;
        }

    }
}