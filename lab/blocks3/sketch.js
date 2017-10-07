let sketch = function(p) {
  let xdim = 10;
  let ydim = 8;
  let size = 20;

  let grid;
  let colors;

  p.setup = function() {
    p.createCanvas(1200, 850);
    p.noLoop();
    p.noFill();

    colors = [p.color(231, 94, 96), p.color(249, 190, 82), p.color(89, 180, 180), p.color(197, 149, 197)];
  };

  p.draw = function() {
    p.clear();
    //p.translate(200,200);
    generate_grid(xdim, ydim);

    p.strokeWeight(6);
    p.stroke(89, 180, 180);

    display(0, 0, 9, 9);
    p.translate(360, 0);
    p.scale(-1, 1);
    display(0, 0, 9, 9);
    p.translate(0, 360);
    p.scale(1, -1);
    display(0, 0, 9, 9);
    p.translate(360, 0);
    p.scale(-1, 1);
    display(0, 0, 9, 9);

    p.strokeWeight(2);
    p.stroke(20, 39, 49);
    display(0, 0, 9, 9);
    p.translate(360, 0);
    p.scale(-1, 1);
    display(0, 0, 9, 9);
    p.translate(0, 360);
    p.scale(1, -1);
    display(0, 0, 9, 9);
    p.translate(360, 0);
    p.scale(-1, 1);
    display(0, 0, 9, 9);

    p.translate(400, 0);
    p.scale(-1, 1);
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

  function display(x1, y1, sx, sy) {
    //p.rect(size,size, (sx-1) * size, (sy-1) * size);
    for (var i = 1; i < sy; i++) {
      for (var j = 1; j < sx; j++) {
        if (grid[y1 + i][x1 + j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
        if (grid[y1 + i][x1 + j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
      }
    }
  }

  function flip_coin() {
    return p.random() < 0.8 ? false : true;
  }

  function dist(n, m) {
    return p.max(n - m, m - n);
  }
};

new p5(sketch);
