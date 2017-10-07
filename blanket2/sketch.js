let sketch = function(p) {
let pnts;
let n = 1000;
let terminate;

  p.setup = function() {
    p.createCanvas(1000,1000);
    p.stroke(255,6);
    p.strokeWeight(1);
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
      pnts.push({x:i, y:-700, px: i, py:-700});
    }
  }

  function display () {
    p.translate(p.width/2, p.height/2);
    for (var i = 0; i < pnts.length; i++) {
      let r = p.TWO_PI * (pnts[i].x / p.width);
      let pr = p.TWO_PI * (pnts[i].px / p.width);
      let x = p.cos(r) * (pnts[i].y);
      let y = p.sin(r) * (pnts[i].y);
      let px = p.cos(pr) * (pnts[i].py);
      let py = p.sin(pr) * (pnts[i].py);
      p.line(x,y,px,py);
    }
  }

  function step () {
    if(pnts[0].y > 0) return true;
    for (var i = 0; i < pnts.length; i++) {
      pnts[i].px = pnts[i].x;
      pnts[i].py = pnts[i].y;

      let r = p.TWO_PI * (pnts[i].x / p.width);
      let x = p.cos(r) * (50 + pnts[i].y);
      let y = p.sin(r) * (50 + pnts[i].y);
      pnts[i].x += (p.noise(10000+x/500, 10000+y/500)) *2 - 1;
      pnts[i].y++;
    }
    return false;
  }


}

new p5(sketch);
