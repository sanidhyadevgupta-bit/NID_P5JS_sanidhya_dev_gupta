let cars = [];
let numCars = 20;
function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < numCars; i++) {
    cars[i] = new Car(random(0, width), random(0, height), random(40, 100), random(2, 10));
  }
  //creating a new object using the car class blueprint
}

function draw() {
  background(220);
 for(i=0;i<cars.length;i++){
  cars[i].show();
  cars[i].move();
  cars[i].grow();
  
 }
}
