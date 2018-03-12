let sketch = function(p) {
  let THE_SEED;
  let xdim = 10;
  let ydim = 8;
  let size = 40;

  let cgrid;
  let cdimx = 2;
  let cdimy = 2;

  let grid;
  let colors;

  p.setup = function() {
    p.createCanvas(2970, 2100);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();
    p.noFill();
    p.background('#eeeee8');

    cgrid = [];
    for (var i = 0; i < cdimy; i++) {
      crow = [];
      for (var j = 0; j < cdimx; j++) {
        crow.push(p.color(p.random(255), p.random(255), p.random(255)));
      }
      cgrid.push(crow);
    }
    console.log(cgrid);
  };

  p.draw = function() {
    p.translate(85, 85);
    generate_grid(xdim, ydim);
    for (var i = 0; i < ydim - 1; i++) {
      p.push();
      for (var j = 0; j < xdim - 1; j++) {
        p.strokeWeight(16);
        p.stroke(get_color(j, i));
        display(p.min(j, 4), p.min(i, 3), 3 + dist(4, j), 3 + dist(3, i));

        p.translate(1, 1);
        p.strokeWeight(6);
        p.stroke('#eeeee5');
        display(p.min(j, 4), p.min(i, 3), 3 + dist(4, j), 3 + dist(3, i));

        p.translate(215 + dist(4, j) * size, 0);
      }
      p.pop();
      p.translate(0, 215 + dist(3, i) * size);
    }
  };

  function generate_grid(xd, yd) {
    grid = new Array(yd + 1);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(xd + 1);
      for (var j = 0; j < grid[i].length; j++) {
        if (i == 0 || j == 0) grid[i][j] = { h: false, v: false };
        else if (i == 1 && j == 1) grid[i][j] = { h: true, v: true };
        else grid[i][j] = generate_cell(grid[i][j - 1].h, grid[i - 1][j].v);
      }
    }
  }

  function generate_cell(west, north) {
    if (!west && !north) return { h: false, v: false };
    if (!west) return { h: flip_coin(), v: true };
    if (!north) return { h: true, v: flip_coin() };
    let h = flip_coin();
    let v = h ? flip_coin() : true;
    return { h: h, v: v };
  }

  function get_color(x, y) {
    let px = x / (xdim - 1) * (cdimx - 1);
    let py = y / (ydim - 1) * (cdimy - 1);

    let px0 = p.floor(px);
    let py0 = p.floor(py);

    let sx = p.map(px, px0, px0 + 1, 0, 1);
    let sy = p.map(py, py0, py0 + 1, 0, 1);

    let cu = p.lerpColor(cgrid[py0][px0], cgrid[py0][px0 + 1], sigmoid(sx));
    let cl = p.lerpColor(cgrid[py0 + 1][px0], cgrid[py0 + 1][px0 + 1], sigmoid(sx));
    return p.lerpColor(cu, cl, sigmoid(sy));
  }

  function sigmoid(x) {
    return 1.1 / (1 + p.exp(-6 * (x - 0.5))) - 0.05;
  }

  function display(x1, y1, sx, sy) {
    p.rect(size, size, (sx - 1) * size, (sy - 1) * size);
    for (var i = 1; i < sy; i++) {
      for (var j = 1; j < sx; j++) {
        if (grid[y1 + i][x1 + j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
        if (grid[y1 + i][x1 + j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
      }
    }
  }

  function flip_coin() {
    return p.random() < 0.6 ? false : true;
  }

  function dist(n, m) {
    return p.max(n - m, m - n);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpg');
  };
};

new p5(sketch);
