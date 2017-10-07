let sketch = function(p) {
let pnts;
let n = 1000;
let terminate;
let color_offset;

  p.setup = function() {
    p.createCanvas(1400,1000);
    p.colorMode(p.HSB);
    init();
  }

  p.draw = function() {
    if(!terminate) {
      display();
      step();
      display();
      terminate = step();
    }
  }

  function init() {
    terminate = false;
    pnts = [];
    color_offset = p.random(360);
    for (var i = 0; i < n; i++) {
      pnts.push({x:i+200, y:1, px:i+200, py:0});
    }
  }

  function display () {
    for (var i = 0; i < pnts.length; i++) {
      p.stroke(((pnts[i].y * .03) + color_offset + (i/n * 120)) % 360,80,100,.07);
      p.line(pnts[i].px, pnts[i].py, pnts[i].x, pnts[i].y);
    }
  }

  function step () {
    if (pnts[0].y > p.height) return true;
    for (var i = 0; i < pnts.length; i++) {
      pnts[i].px = pnts[i].x;
      pnts[i].py = pnts[i].y;
      pnts[i].x += (p.noise(i/200,pnts[i].y/350)) *2 -1;
      pnts[i].y++;
    }
    return false;
  }


}

new p5(sketch);
