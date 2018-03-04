let sketch = function(p) {
  let THE_SEED;

  let cdimx = 2;
  let cdimy = 3;
  let cgrid;

  let dimx = 200;
  let dimy = 200;

  let pad = 150;

  let tick = 1;

  p.setup = function() {
    p.createCanvas(1000, 1000);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noStroke();
    p.noLoop();
    //p.frameRate(1);

    cgrid = [];
    for (var i = 0; i < cdimy; i++) {
      crow = [];
      for (var j = 0; j < cdimx; j++) {
        crow.push(p.color(p.random(255), p.random(255), p.random(255), p.random(255)));
      }
      cgrid.push(crow);
    }
  };

  p.draw = function() {
    p.background('#222');
    for (var y = 0; y < dimy; y++) {
      for (var x = 0; x < dimx; x++) {
        let px = x / dimx * (cdimx - 1);
        let py = y / dimy * (cdimy - 1);

        let px0 = p.floor(px);
        let py0 = p.floor(py);

        let sx = p.map(px, px0, px0 + 1, 0, 1);
        let sy = p.map(py, py0, py0 + 1, 0, 1);

        let cu = p.lerpColor(cgrid[py0][px0], cgrid[py0][px0 + 1], sigmoid(sx));
        let cl = p.lerpColor(cgrid[py0 + 1][px0], cgrid[py0 + 1][px0 + 1], sigmoid(sx));
        let c = p.lerpColor(cu, cl, sigmoid(sy));
        p.fill(c);
        let w = (p.width - pad * 2) / dimx;
        let h = (p.height - pad * 2) / dimy;
        p.rect(pad + w * x, pad + h * y, w, h);
      }
    }
    tick++;
  };

  function sigmoid(x) {
    //return p.sqrt(2) * x / p.sqrt(1 + x * x);

    return 1.1 / (1 + p.exp(-6 * (x - 0.5))) - 0.05;
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
