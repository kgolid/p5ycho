import * as Elems from '../utils/elementsjs/index.js';

let sketch = function(p) {
  let THE_SEED;

  let sq = [[320, 320], [480, 320], [480, 480], [320, 480], [320, 320]];
  let sq_init = Math.random();
  let sq_speed = 0.079;
  let sq_pos = sq_init;

  let tr = [[400, 320], [450, 480], [350, 480], [400, 320]];
  let tr_init = Math.random();
  let tr_speed = 0.079;
  let tr_pos = tr_init;

  let b_pos = [p.random(350, 450), p.random(350, 540)];
  let b_radius = p.random(50, 90);
  let b_angle = p.random(Math.PI * 2);
  let b_speed = -0.102;

  let stick_length = 200;

  let a_pin;
  let b_pin;

  let sq_pin;
  let tr_pin;

  let c_pin, c_pin_old;

  p.setup = function() {
    p.createCanvas(800, 800);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noFill();
    p.stroke(0, 150);
    p.background('#e0e1db');

    b_pin = Elems.point_at_distance_and_angle(b_pos, b_radius, b_angle);
    sq_pin = Elems.on_path(sq, sq_pos);
    tr_pin = Elems.on_path(tr, tr_pos);

    c_pin = Elems.point_at_distance_towards_direction(sq_pin, stick_length, b_pin);
    update();
  };

  p.draw = function() {
    for (let i = 0; i < 50; i++) {
      update();
      //display_apparatus();
      display_ink();
    }
  };

  function update() {
    b_angle += b_speed * p.TWO_PI / 30;
    sq_pos += sq_speed / 30;
    tr_pos += tr_speed / 30;

    b_pin = Elems.point_at_distance_and_angle(b_pos, b_radius, b_angle);
    sq_pin = Elems.on_path(sq, sq_pos);
    tr_pin = Elems.on_path(tr, tr_pos);

    c_pin_old = [c_pin[0], c_pin[1]];
    c_pin = Elems.point_at_distance_towards_direction(tr_pin, stick_length, b_pin);
  }
  function display_apparatus() {
    p.background('#e0e1db');
    p.stroke(255, 0, 0);
    //p.ellipse(b_pos[0], b_pos[1], b_radius * 2, b_radius * 2);
    display_shape(tr);
    display_shape(sq);
    p.stroke(0);
    p.ellipse(c_pin[0], c_pin[1], 20);
    p.line(sq_pin[0], sq_pin[1], c_pin[0], c_pin[1]);
  }

  function display_shape(points) {
    for (let i = 1; i < points.length; i++) {
      p.stroke(255, 0, 0);
      p.line(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
    }
  }

  function display_ink() {
    if (Elems.distance_between_points(c_pin_old, c_pin) < 40) p.line(c_pin_old[0], c_pin_old[1], c_pin[0], c_pin[1]);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
