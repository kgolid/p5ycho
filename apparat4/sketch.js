import BlockBuilder from './logic.js';

let sketch = function(p) {
  let THE_SEED;
  let size = 10;

  let xdim = 61;
  let ydim = 61;

  let radius = 18;
  let wh_ratio = 0.8;
  let symmetric = true;

  let chance_start = 0.9;
  let chance_extend = 0.8;
  let chance_vertical = 0.5;

  let padding_outside = 150;
  let nx = 3;
  let ny = 3;
  let padding_between_x, padding_between_y;

  let colors;

  let grid;
  let builder;

  p.setup = function() {
    p.createCanvas(2100, 2100);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();
    p.background('#eeeee5');

    colors = [
      p.color('#6c843e'),
      p.color('#dc383a'),
      p.color('#687d99'),
      p.color('#705f84'),
      p.color('#fc9a1a'),
      p.color('#aa3a33'),
      p.color('#9c4257')
    ];

    builder = new BlockBuilder(
      xdim,
      ydim,
      radius,
      chance_start,
      chance_extend,
      chance_vertical,
      colors,
      symmetric,
      wh_ratio
    );

    padding_between_x = (p.width - padding_outside * 2 - nx * xdim * size) / (nx - 1);
    padding_between_y = (p.height - padding_outside * 2 - ny * ydim * size) / (ny - 1);
  };

  p.draw = function() {
    p.translate(padding_outside, padding_outside);
    for (let i = 0; i < ny; i++) {
      p.push();
      for (let j = 0; j < nx; j++) {
        grid = builder.generate();
        p.strokeWeight(6);
        display();
        p.strokeWeight(2);
        display();
        p.translate(xdim * size + padding_between_x, 0);
      }
      p.pop();
      p.translate(0, ydim * size + padding_between_y);
    }
  };

  function display() {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        p.noStroke();
        if (grid[i][j].in && grid[i][j].col != null) {
          p.fill(grid[i][j].col);
          p.rect(j * size, i * size, size, size);
        }
        p.stroke('#1c2021');
        if (grid[i][j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
        if (grid[i][j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
      }
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'png');
  };
};

new p5(sketch);
