let sketch = function(p) {
  let width = 1200;
  let height = 1200;
  let offset = -100;

  let flow_cell_size = 8;

  let noise_size = 0.002;
  let noise_radius = 0.001;

  let flow_width = (width + offset * 2) / flow_cell_size;
  let flow_height = (height + offset * 2) / flow_cell_size;

  let noise_grid = [];
  let flow_grid = [];

  let palette;

  let noise_offset_x, noise_offset_y;

  let tick = 0;
  p.setup = function() {
    p.createCanvas(width, height);
    p.smooth();
    p.noLoop();

    p.strokeWeight(1.5);
    p.fill(0);
    p.noStroke();

    palette = [p.color(145, 172, 183), p.color(155, 80, 43), p.color(81, 82, 111), p.color(182, 32, 36)];

    init_flow();
  };
  p.draw = function() {
    p.background(226, 224, 197);
    p.translate(-offset, -offset);
    for (var i = 0; i < palette.length; i++) {
      noise_offset_x = p.random(10);
      noise_offset_y = p.random(10);
      init_flow();
      display_flow(i);
    }
  };

  function init_flow() {
    flow_grid = [];
    for (let i = 0; i < flow_height; i++) {
      let row = [];
      for (let j = 0; j < flow_width; j++) {
        row.push(
          calculate_flow2(
            j * noise_size + p.floor(3 * i / flow_height),
            i * noise_size + 25 * noise_size * p.floor(6 * j / flow_width),
            noise_radius
          )
        );
      }
      flow_grid.push(row);
    }
  }

  function calculate_flow(x, y, r) {
    let high_val = 0;
    let low_val = 1;
    let high_pos = p.createVector(0, 0);
    let low_pos = p.createVector(0, 0);

    for (var i = 0; i < 30; i++) {
      let angle = p.random(p.TAU);
      let pos = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
      let val = p.noise(noise_offset_x + pos.x, noise_offset_y + pos.y);

      if (val > high_val) {
        high_val = val;
        high_pos.x = pos.x;
        high_pos.y = pos.y;
      }
      if (val < low_val) {
        low_val = val;
        low_pos.x = pos.x;
        low_pos.y = pos.y;
      }
    }

    let flow_angle = p.createVector(low_pos.x - high_pos.x, low_pos.y - high_pos.y);
    flow_angle.normalize().mult((high_val - low_val) / noise_radius);
    return { arrow: flow_angle, point: p.noise(x, y) };
  }
  function calculate_flow2(x, y, r) {
    let diff = 0;
    let max_diff = 0;
    let low_pos = p.createVector(0, 0);
    let high_pos = p.createVector(0, 0);

    for (var i = 0; i < 30; i++) {
      let angle = p.random(p.TAU);
      let pos1 = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
      let pos2 = p.createVector(x + p.cos(angle + p.PI) * r, y + p.sin(angle + p.PI) * r);

      let val1 = p.noise(noise_offset_x + pos1.x, noise_offset_y + pos1.y);
      let val2 = p.noise(noise_offset_x + pos2.x, noise_offset_y + pos2.y);

      diff = p.abs(val2 - val1);

      if (diff > max_diff) {
        max_diff = diff;
        if (val1 < val2) {
          low_pos.x = pos1.x;
          low_pos.y = pos1.y;
          high_pos.x = pos2.x;
          high_pos.y = pos2.y;
        } else {
          low_pos.x = pos2.x;
          low_pos.y = pos2.y;
          high_pos.x = pos1.x;
          high_pos.y = pos1.y;
        }
      }
    }

    let flow_angle = p.createVector(low_pos.x - high_pos.x, low_pos.y - high_pos.y);
    flow_angle.normalize().mult(max_diff / noise_radius);
    return { arrow: flow_angle, point: p.noise(x, y) };
  }

  function display_flow(col) {
    for (let i = 0; i < flow_grid.length; i++) {
      for (let j = 0; j < flow_grid[i].length; j++) {
        p.noStroke();
        p.fill(0, 0, 0, 0.5);
        p.stroke(palette[col]);
        p.line(
          j * flow_cell_size,
          i * flow_cell_size,
          j * flow_cell_size + flow_grid[i][j].arrow.x * flow_cell_size * 1.4,
          i * flow_cell_size + flow_grid[i][j].arrow.y * flow_cell_size * 1.4
        );
      }
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('noise_grid', 'jpeg');
    }
  };
};
new p5(sketch);
