let flowers = [];
let numFlower = 20;

function setup() {
  createCanvas(innerWidth, innerHeight);
}

function draw() {
  background(0);

  // spawn flowers randomly across X-axis
  if (flowers.length < numFlower) {
    let x = random(50, width - 50);
    let y = height - 50;

    // fixed number of petals
    let petals = 15;

    flowers.push(new Flower(x, y, petals));
  }

  // move and show
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];
    f.move();
    f.show();

    if (f.offscreen()) flowers.splice(i, 1);
  }
}
