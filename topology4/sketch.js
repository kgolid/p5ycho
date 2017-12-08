let sketch = function(p) {
  let width = 1200;
  let height = 1200;
  let offset = 100;

  let flow_cell_size = 10;

  let noise_size = 0.001;
  let noise_radius = 0.01;

  let flow_width = (width + offset * 2) / flow_cell_size;
  let flow_height = (height + offset * 2) / flow_cell_size;

  let noise_grid = [];
  let flow_grid = [];

  let number_of_particles = 3000;
  let particles = [];

  let tick = 0;
  p.setup = function() {
    let c = p.createCanvas(width, height);
    p.background(255);
    p.smooth();
    p.noStroke();
    //p.blendMode(p.OVERLAY);

    init_particles();
    init_flow();

    p.fill(20);
    p.ellipse(p.width / 2, p.height / 2, width - 200);
    p.strokeWeight(2);
    p.stroke(255, 5);
  };
  p.draw = function() {
    p.translate(-offset, -offset);
    //display_flow();
    update_particles();
    display_particles();
    tick += 0.002;
  };

  function init_particles() {
    for (var i = 0; i < number_of_particles; i++) {
      let r = p.random(p.width + 2 * offset);
      let q = p.random(p.height + 2 * offset);
      particles.push({
        prev: p.createVector(r, q),
        pos: p.createVector(r, q),
        vel: p.createVector(0, 0),
        acc: p.createVector(0, 0),
        col: p.random(255),
        seed: i
      });
    }
  }

  function update_particles() {
    for (var i = 0; i < number_of_particles; i++) {
      let prt = particles[i];
      let flow = get_flow(prt.pos.x, prt.pos.y);

      prt.prev.x = prt.pos.x;
      prt.prev.y = prt.pos.y;

      prt.pos.x = mod(prt.pos.x + prt.vel.x, p.width + 2 * offset);
      prt.pos.y = mod(prt.pos.y + prt.vel.y, p.height + 2 * offset);

      prt.vel
        .add(prt.acc)
        .normalize()
        .mult(2.2);

      //prt.acc = p5.Vector.fromAngle(p.noise(prt.seed * 10, tick) * p.TAU).mult(0.01);
      prt.acc = p.createVector(0, 0);
      prt.acc.add(flow).mult(1);
    }
  }

  function init_flow() {
    for (let i = 0; i < flow_height; i++) {
      let row = [];
      for (let j = 0; j < flow_width; j++) {
        row.push(calculate_flow(j * noise_size, i * noise_size, noise_radius));
      }
      flow_grid.push(row);
    }
  }

  function calculate_flow(x, y, r) {
    //console.log(x,y);
    let high_val = 0;
    let low_val = 1;
    let high_pos = p.createVector(0, 0);
    let low_pos = p.createVector(0, 0);

    for (var i = 0; i < 80; i++) {
      //let angle = i / 100 * p.TAU;
      let angle = p.random(p.TAU);
      let pos = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
      let val = p.noise(pos.x, pos.y);

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

    return flow_angle;
  }

  function get_flow(xpos, ypos) {
    xpos = p.constrain(xpos, 0, p.width + offset * 2);
    ypos = p.constrain(ypos, 0, p.height + offset * 2);
    return flow_grid[p.floor(ypos / flow_cell_size)][p.floor(xpos / flow_cell_size)];
  }

  function display_particles() {
    for (let i = 0; i < particles.length; i++) {
      //p.stroke(particles[i].col);
      //p.point(particles[i].pos.x, particles[i].pos.y);
      if (p5.Vector.dist(particles[i].prev, particles[i].pos) < 10)
        p.line(particles[i].prev.x, particles[i].prev.y, particles[i].pos.x, particles[i].pos.y);
    }
  }

  function display_flow() {
    for (let i = 0; i < flow_grid.length; i++) {
      for (let j = 0; j < flow_grid[i].length; j++) {
        p.strokeWeight(1);
        p.stroke(255, 0, 0);
        p.noFill();
        p.ellipse(j * flow_cell_size, i * flow_cell_size, 7, 7);
        p.line(
          j * flow_cell_size,
          i * flow_cell_size,
          j * flow_cell_size + flow_grid[i][j].x * 50,
          i * flow_cell_size + flow_grid[i][j].y * 50
        );
      }
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('landslide', 'jpeg');
    }
  };

  function mod(x, n) {
    return (x % n + n) % n;
  }
};
new p5(sketch);
