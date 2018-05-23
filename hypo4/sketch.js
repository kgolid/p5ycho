import * as Elems from '../utils/elementsjs/index.js';

let sketch = function(p) {
  let THE_SEED;

  let a1_pos = [-100, -200];
  let a1_radius = p.random(60, 80);
  let a1_angle = p.random(Math.PI * 2);
  let a1_speed = 0.05;

  let b1_pos = [150, -250];
  let b1_radius = p.random(70, 100);
  let b1_angle = p.random(Math.PI * 2);
  let b1_speed = 0.04383;

  let a1_stick_length = 410;
  let b1_stick_length = 362;
  let a1_pin;
  let b1_pin;
  let t1_pin;

  let c1_pin, c1_pin_old;

  let a2_pos = [1500, 100];
  let a2_radius = p.random(50, 70);
  let a2_angle = p.random(Math.PI * 2);
  let a2_speed = -0.04383;

  let b2_pos = [p.random(1350, 1550), p.random(450, 550)];
  let b2_radius = p.random(60, 80);
  let b2_angle = p.random(Math.PI * 2);
  let b2_speed = -0.05;

  let a2_stick_length = 380;
  let b2_stick_length = 422;
  let a2_pin;
  let b2_pin;
  let t2_pin;

  let c2_pin, c2_pin_old;

  let d_pin, d_pin_old;

  p.setup = function() {
    p.createCanvas(1400, 1000);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noFill();
    p.stroke(0, 0, 255, 20);
    p.background('#e0e1db');
    a1_pin = Elems.point_at_distance_and_angle(a1_pos, a1_radius, a1_angle);
    b1_pin = Elems.point_at_distance_and_angle(b1_pos, b1_radius, b1_angle);

    t1_pin = Elems.intersection_of_two_circles(a1_pin, a1_stick_length, b1_pin, b1_stick_length);
    c1_pin = Elems.point_at_distance_towards_direction(a1_pin, 600, t1_pin);

    a2_pin = Elems.point_at_distance_and_angle(a2_pos, a2_radius, a2_angle);
    b2_pin = Elems.point_at_distance_and_angle(b2_pos, b2_radius, b2_angle);

    t2_pin = Elems.intersection_of_two_circles(b2_pin, b2_stick_length, a2_pin, a2_stick_length);
    c2_pin = Elems.point_at_distance_towards_direction(a2_pin, 580, t2_pin);

    d_pin = Elems.intersection_of_two_circles(c1_pin, 650, c2_pin, 600);
    update();
  };

  p.draw = function() {
    p.scale(1.8);
    p.translate(-50, -560);
    for (let i = 0; i < 100; i++) {
      update();
      //display_apparatus();
      display_ink();
    }
  };

  function update() {
    a1_angle += a1_speed / 10;
    b1_angle += b1_speed / 10;

    a1_pin = Elems.point_at_distance_and_angle(a1_pos, a1_radius, a1_angle);
    b1_pin = Elems.point_at_distance_and_angle(b1_pos, b1_radius, b1_angle);

    t1_pin = Elems.intersection_of_two_circles(a1_pin, a1_stick_length, b1_pin, b1_stick_length);

    c1_pin = Elems.point_at_distance_towards_direction(a1_pin, 600, t1_pin);

    a2_angle += a2_speed / 20;
    b2_angle += b2_speed / 20;
    a2_pin = Elems.point_at_distance_and_angle(a2_pos, a2_radius, a2_angle);
    b2_pin = Elems.point_at_distance_and_angle(b2_pos, b2_radius, b2_angle);

    t2_pin = Elems.intersection_of_two_circles(a2_pin, a2_stick_length, b2_pin, b2_stick_length);

    c2_pin = Elems.point_at_distance_towards_direction(a2_pin, 580, t2_pin);

    d_pin_old = [d_pin[0], d_pin[1]];
    d_pin = Elems.intersection_of_two_circles(c1_pin, 600, c2_pin, 750);
  }
  function display_apparatus() {
    p.clear();
    p.stroke(255, 0, 0);
    p.ellipse(a1_pos[0], a1_pos[1], a1_radius * 2, a1_radius * 2);
    p.ellipse(b1_pos[0], b1_pos[1], b1_radius * 2, b1_radius * 2);
    p.ellipse(c1_pin[0], c1_pin[1], 5, 5);
    p.stroke(0);
    p.line(a1_pin[0], a1_pin[1], c1_pin[0], c1_pin[1]);
    p.line(b1_pin[0], b1_pin[1], t1_pin[0], t1_pin[1]);

    p.stroke(255, 0, 0);
    p.ellipse(a2_pos[0], a2_pos[1], a2_radius * 2, a2_radius * 2);
    p.ellipse(b2_pos[0], b2_pos[1], b2_radius * 2, b2_radius * 2);
    p.ellipse(c2_pin[0], c2_pin[1], 5, 5);
    p.stroke(0);
    p.line(a2_pin[0], a2_pin[1], c2_pin[0], c2_pin[1]);
    p.line(b2_pin[0], b2_pin[1], t2_pin[0], t2_pin[1]);

    p.line(c1_pin[0], c1_pin[1], d_pin[0], d_pin[1]);
    p.line(c2_pin[0], c2_pin[1], d_pin[0], d_pin[1]);
  }

  function display_ink() {
    if (Elems.distance_between_points(d_pin_old, d_pin) < 40) p.line(d_pin_old[0], d_pin_old[1], d_pin[0], d_pin[1]);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
