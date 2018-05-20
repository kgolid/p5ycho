import * as Elems from '../utils/elementsjs/index.js';

let sketch = function(p) {
  let THE_SEED;

  let a_pos = [p.random(300, 500), p.random(300, 500)];
  let a_radius = p.random(20, 50);
  let a_angle = p.random(Math.PI * 2);
  let a_speed = 0.1;

  let ap_radius = p.random(5, 20);
  let ap_angle = p.random(Math.PI * 2);
  let ap_speed = -0.2;

  let b_pos = [400, 400];
  let b_radius = p.random(50, 90);
  let b_angle = p.random(Math.PI * 2);
  let b_speed = 0.007;

  let bp_radius = p.random(5, 20);
  let bp_angle = p.random(Math.PI * 2);
  let bp_speed = 0.2;

  let stick_length = 200;

  let a_pin;
  let b_pin;
  let ap_pin;
  let bp_pin;

  let c_pin, c_pin_old;

  p.setup = function() {
    p.createCanvas(800, 800);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noFill();
    p.stroke(0, 150);
    p.background('#e0e1db');

    a_pin = Elems.point_at_distance_and_angle(a_pos, a_radius, a_angle);
    b_pin = Elems.point_at_distance_and_angle(b_pos, b_radius, b_angle);
    ap_pin = Elems.point_at_distance_and_angle(a_pin, ap_radius, ap_angle);
    bp_pin = Elems.point_at_distance_and_angle(b_pin, bp_radius, bp_angle);

    c_pin = Elems.point_at_distance_towards_direction(ap_pin, stick_length, bp_pin);
    update();
  };

  p.draw = function() {
    for (let i = 0; i < 80; i++) {
      update();
      //display_apparatus();
      display_ink();
    }
  };

  function update() {
    a_angle += a_speed / 30;
    b_angle += b_speed / 30;
    ap_angle += ap_speed / 30;
    bp_angle += bp_speed / 30;

    a_pin = Elems.point_at_distance_and_angle(a_pos, a_radius, a_angle);
    b_pin = Elems.point_at_distance_and_angle(b_pos, b_radius, b_angle);
    ap_pin = Elems.point_at_distance_and_angle(a_pin, ap_radius, ap_angle);
    bp_pin = Elems.point_at_distance_and_angle(b_pin, bp_radius, bp_angle);

    c_pin_old = [c_pin[0], c_pin[1]];
    c_pin = Elems.point_at_distance_towards_direction(ap_pin, stick_length, bp_pin);
  }
  function display_apparatus() {
    p.background();
    p.stroke(255, 0, 0);
    p.ellipse(a_pos[0], a_pos[1], a_radius * 2, a_radius * 2);
    p.ellipse(b_pos[0], b_pos[1], b_radius * 2, b_radius * 2);
    p.stroke(0);
    p.ellipse(ap_pin[0], ap_pin[1], 20);
    p.ellipse(bp_pin[0], bp_pin[1], 20);
    p.ellipse(c_pin[0], c_pin[1], 20);
    p.line(a_pin[0], a_pin[1], c_pin[0], c_pin[1]);
  }

  function display_ink() {
    if (Elems.distance_between_points(c_pin_old, c_pin) < 40) p.line(c_pin_old[0], c_pin_old[1], c_pin[0], c_pin[1]);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
