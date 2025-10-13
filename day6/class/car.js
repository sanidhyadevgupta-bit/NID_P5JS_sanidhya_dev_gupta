//Blueprint only 
class Car {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.colour = color(random(0, 220), 0, 0);
    }
    move() {
        if (this.x > 600) {
            this.x = 0;
        }
        this.x = this.x + this.speed;
    }
    show() {
        fill(this.colour);
        rect(this.x, this.y, this.size, 20);
        ellipse(this.x + 20, this.y + 20, 20);
        ellipse(this.x + this.size - 20, this.y + 20, 20);
    }
    grow() {
        if (this.size < 100) {
            this.size = this.size + 1;
        }
    }
  
}