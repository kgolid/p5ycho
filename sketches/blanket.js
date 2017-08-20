let sketch = function(p) {
let pnts;
let n = 1400;
let terminate;

  p.setup = function() {
    p.createCanvas(1200,900);
    p.stroke(255,6);
    init();
  }

  p.draw = function() {
    if(!terminate) {
      display();
      terminate = step();
    }
  }

  function init() {
    terminate = false;
    pnts = [];
    for (var i = 0; i < n; i++) {
      pnts.push({x:i-100, y:1, px:i-100, py:0});
    }
  }

  function display () {
    for (var i = 0; i < pnts.length; i++) {
      p.line(pnts[i].px, pnts[i].py, pnts[i].x, pnts[i].y);
    }
  }

  function step () {
    if (pnts[0].y > p.height) return true;
    for (var i = 0; i < pnts.length; i++) {
      pnts[i].px = pnts[i].x;
      pnts[i].py = pnts[i].y;
      pnts[i].x += (p.noise(i/250,pnts[i].y/250)) *2 -1;
      pnts[i].y++;
    }
    return false;
  }


}

new p5(sketch);
