const p5 = require('p5');

const ui = require('./ui');

let sketch = function(p) {
  let n = 10;
  let r = 250;

  let points;
  let current;

  p.setup = function() {
    var canvas = p.createCanvas(800, 800);
    p.fill(0,22,65,6);
    p.noStroke();
    p.frameRate(.5);
    p.blendMode(p.MULTIPLY);

    current = [];
    points = ui.init(p,n,r,points);
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width/2, p.height/2);
    ui.run(p, current, points);
    points = ui.init(p,n,r,points,current);
  }
}

new p5(sketch);
