let sketch = function(p) {
  let axiom = 'F';
  let sentence = axiom;
  let gen = 0;

  let rules = [];
  let number_of_gens;
  let extension, extension_chaos;
  let angle, angle_chaos;

  var r_input;
  var g_slider;
  var e_slider, ec_slider;
  var a_slider, ac_slider;

  let r1 = 'FF[+F][--FF][-F+F]';
  let r2 = 'F[++F[-F]]F[-FF[F]]';
  let r3 = 'F[-FF[+F]]F[+F[+F]]';
  let r4 = 'F[-F[-F++F]][+F[--F]]F';

  p.setup = function() {
    var canvas = p.createCanvas(700, 700);
    canvas.parent('sketch');
    setup_controllers();
    generate();
  };

  let turtle = function() {
    var current_extension = extension * p.pow(0.5, gen);
    p.background(216, 226, 232);
    p.stroke(0, 40);
    p.resetMatrix();
    p.translate(p.width / 2, p.height);

    for (var i = 0; i < sentence.length; i++) {
      let x = sentence.charAt(i);
      let ext = current_extension * (1 + p.random(-extension_chaos, extension_chaos));
      let ang = angle * (1 + p.random(-angle_chaos, angle_chaos));
      if (x == 'F') {
        p.line(0, 0, 0, -ext);
        p.translate(0, -ext);
      } else if (x == '+') {
        p.rotate(-ang);
      } else if (x == '-') {
        p.rotate(ang);
      } else if (x == '[') {
        p.push();
      } else if (x == ']') {
        p.pop();
      }
    }
  };

  let generate = function() {
    reset();
    while (gen < number_of_gens) {
      let new_sentence = '';
      for (var i = 0; i < sentence.length; i++) {
        let x = sentence.charAt(i);
        let found = false;
        for (var j = 0; j < rules.length; j++) {
          if (x == rules[j].in) {
            new_sentence += rules[j].out;
            found = true;
            break;
          }
        }
        if (!found) {
          new_sentence += x;
        }
      }
      sentence = new_sentence;
      gen++;
      turtle();
    }
  };

  let reset = function() {
    set_parametres();
    sentence = axiom;
    gen = 0;
  };

  let setup_controllers = function() {
    var generate_button = p.createButton('generate').parent('controller');

    var r_container = p.createDiv('&rho; ').parent('controller');
    var g_container = p.createDiv('&gamma; (1-6)').parent('controller');
    var e_container = p.createDiv('&eta; (100-500)').parent('controller');
    var ec_container = p.createDiv('&Delta;<sub>&eta;</sub> (0-1)').parent('controller');
    var a_container = p.createDiv('&phi; (5-20)').parent('controller');
    var ac_container = p.createDiv('&Delta;<sub>&phi;</sub> (0-1)').parent('controller');

    r_input = p.createInput(r1, 'text').parent(r_container);
    g_slider = p.createInput(5, 'number').parent(g_container);
    e_slider = p.createInput(200, 'number').parent(e_container);
    ec_slider = p.createInput(0.4, 'number').parent(ec_container);
    a_slider = p.createInput(10, 'number').parent(a_container);
    ac_slider = p.createInput(0.5, 'number').parent(ac_container);

    generate_button.mousePressed(generate);

    set_parametres();
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('landslide', 'jpeg');
    }
  };

  let set_parametres = function() {
    rules = [{ in: axiom, out: r_input.value() }];
    number_of_gens = p.constrain(g_slider.value(), 1, 6);
    extension = p.constrain(e_slider.value(), 100, 500);
    extension_chaos = p.constrain(ec_slider.value(), 0, 1);
    angle = p.PI / p.constrain(a_slider.value(), 5, 20);
    angle_chaos = p.constrain(ac_slider.value(), 0, 1);
  };
};

new p5(sketch);
