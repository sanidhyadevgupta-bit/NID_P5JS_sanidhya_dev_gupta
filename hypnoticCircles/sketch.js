let a = 0;m = 0
function setup() {  createCanvas(400, 400);  angleMode(DEGREES);}

function draw() {  background(0, 65);  stroke(255);  noFill();
translate(width / 2, height / 2); a += 1;
       
for (let g = 0; g < 12; g++) {
for (let i = 0; i < 360; i += 60) {
let nx = 150 * sin(g * 5 + i - a);
let ny = 150 * cos(g * 5 + i - a);
m=75*sin(g*5+frameCount)
circle(nx, ny, m);
}}}