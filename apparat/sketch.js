let sketch = function(p) {
  let THE_SEED;
  let xdim = 40;
  let ydim = 40;
  let size = 16;

  let radius = 11;

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
    p.fill('#eeeee8');
    p.stroke('#00eee8');
    p.strokeWeight(4);
    p.background('#eeeee8');
  };

  p.draw = function() {
    p.translate(250, 120);
    for (let i = 0; i < 3; i++) {
      p.push();
      for (let j = 0; j < 4; j++) {
        generate_grid(xdim + 20, ydim + 20);
        p.strokeWeight(10);
        display();
        p.strokeWeight(4);
        display();
        p.translate(600, 0);
      }
      p.pop();
      p.translate(0, 600);
    }
  };

  function generate_grid(xd, yd) {
    grid = new Array(yd + 1);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(xd + 1);
      for (var j = 0; j < grid[i].length; j++) {
        if (i == 0 || j == 0) grid[i][j] = { h: false, v: false, in: false };
        else
          //else if (i == 1 && j == 1) grid[i][j] = { h: true, v: true };
          grid[i][j] = generate_cell(j, i, grid[i][j - 1].h, grid[i - 1][j].v, grid[i][j - 1].in, grid[i - 1][j].in);
      }
    }
  }

  function generate_cell(x, y, west, north, in_west, in_north) {
    if (!west && !north) {
      if (in_west || in_north) return { h: false, v: false, in: true };
      return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: false, v: false, in: false };
    }

    if (!west) {
      if (in_west || (!flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius))
        return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: false, v: true, in: in_north };
      return { h: true, v: false, in: false };
    }

    if (!north) {
      if (in_north || (!flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius))
        return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: true, v: false, in: in_west };
      return { h: false, v: true, in: false };
    }

    if (!in_west && !in_north) return { h: false, v: false, in: false };

    let h = flip_fair_coin();
    let v = h ? flip_temporary_coin(x, y) : true;

    let inside = false;
    if (in_west && in_north) inside = !h || !v || flip_temporary_coin(x, y);

    if (v && !in_west) inside = true;
    if (h && !in_north) inside = true;

    return { h: h, v: v, in: inside };
  }

  function display() {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        p.noStroke();
        if (grid[i][j].in) p.rect(j * size, i * size, size, size);
        p.stroke(0);
        if (grid[i][j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
        if (grid[i][j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
      }
    }
  }

  function flip_coin() {
    return p.random() > 0.9;
  }

  function flip_temporary_coin(x, y) {
    return flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius;
  }

  function flip_fair_coin() {
    return p.random() > 0.5;
  }

  function dist(n, m) {
    return p.max(n - m, m - n);
  }

  function get_diagonal(p1x, p1y, p2x, p2y) {
    return p.sqrt(p.pow(dist(p1x, p2x), 2) + p.pow(dist(p1y, p2y), 2));
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'png');
  };
};

new p5(sketch);
