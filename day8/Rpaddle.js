class Rpaddle{
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
        if(keyIsDown(UP_ARROW)){
            this.y=this.y-this.s;
        }
        if(keyIsDown(DOWN_ARROW)){
            this.y=this.y+this.s;
        }
    }
}