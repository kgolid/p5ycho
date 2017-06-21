const p5 = require('p5');

module.exports.run = run;
module.exports.init = init;

function init(p, n, r, points) {
  points = [];
  for (let i = 0; i < n; i++) {
    let rads = (i / n) * p.TWO_PI;
    points.push(p.createVector(p.cos(rads) * r, p.sin(rads) * r, p.random()));
  }
  for(let b = 0; b < 7; b++) {
    interpolate(p, points);
  }
  return points;
}

function run (p, current, points) {
  for (var i = 0; i < 80; i++) {
    current = update(p, current, points);
    display(p, current);
  }
}

function update (p, current, points) {
  current = deep_copy(points);
  for(let b = 0; b < 5; b++) {
    for (let i = 0; i < current.length; i++) {
      move_nearby(p, current[i], 150);
    }
  }
  return current;
}

function interpolate (p, points) {
  for (var i = points.length-1; i > 0; i--) {
    points.splice(i,0,generate_midpoint(p,points[i-1],points[i]));
  }
  points.splice(0,0,generate_midpoint(p,points[points.length-1],points[0]));
}

function generate_midpoint (p, p1, p2) {
  let p3 = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, ((p1.z + p2.z) / 2) * .27 * p.random(.3, 2));
  move_nearby(p, p3, 150);
  return p3;
}

let move_nearby = function(p, pnt, sd) {
  pnt.x = p.randomGaussian(pnt.x, pnt.z * sd);
  pnt.y = p.randomGaussian(pnt.y, pnt.z * sd);
}

function display (p, current) {
  //p.clear();
  p.beginShape();
  for (let i = 0; i < current.length; i++) {
    p.vertex(current[i].x, current[i].y);
  }
  p.endShape(p.CLOSE);
}

let deep_copy = function(arr) {
  let narr = [];
  for (var i = 0; i < arr.length; i++) {
    narr.push(arr[i].copy());
  }
  return narr;
}
