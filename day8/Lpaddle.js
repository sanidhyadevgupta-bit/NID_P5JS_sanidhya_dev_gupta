class Lpaddle{
    constructor(x,y,w,h,s){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.s=s;

    }
    showPaddle(){
        fill(0);
        rect(this.x,this.y,this.w,this.h);
    }
    movePaddle(){
        if(keyIsDown(87)){
            this.y=this.y-this.s;
        }
        if(keyIsDown(83)){
            this.y=this.y+this.s;
        }
    }
}