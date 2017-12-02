let sketch = function(p) {
  let tick;

  let cross_dim = 6;
  let grid_size = 30;
  let cell_dim = 22;
  let nheight = 1.6;
  let nzoom = 20;

  p.setup = function() {
    p.createCanvas(1000, 1000);
    p.stroke(255);
    tick = 0;
  };

  p.draw = function() {
    p.background('#f44');
    p.translate(p.width / 2, p.height / 2);
    draw_grid();
    tick += 0.005;
  };

  function draw_grid() {
    for (let j = 0; j < grid_size; j++) {
      for (let i = 0; i < grid_size; i++) {
        p.push();
        p.scale(p.map(p.noise(i / nzoom + tick, j / nzoom), 0, 1, 1 / nheight, nheight));
        draw_cross((i - grid_size / 2) * cell_dim, (j - grid_size / 2) * cell_dim);
        p.pop();
      }
    }
  }

  function draw_cross(x, y) {
    p.push();
    p.translate(x, y);
    p.line(-cross_dim / 2, 0, cross_dim / 2, 0);
    p.line(0, -cross_dim / 2, 0, cross_dim / 2);
    p.pop();
  }
};
new p5(sketch);
