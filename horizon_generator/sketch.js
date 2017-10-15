let sketch = function(p) {
  let initial_size = 5;
  let initial_deviation = 350;
  let deviation = 100;
  let number_of_interpolations = 8;
  let number_of_layers = 6;
  let shapes_per_layer = 45;

  let points;
  let current;

  let filename = 'landslide';

  let use_custom_color_seed = false;
  let custom_color_seed = 94938984;

  let use_custom_shape_seed = false;
  let custom_shape_seed = 94938984;

  let use_saved_palette = false;
  let current_palette = [];
  let random_palette = [];

  let hue_inputs = [];
  let shape_input = 0;
  let use_this_palette_checkbox, use_this_shape_checkbox;

  let COLOR_SEED;
  let SHAPE_SEED;

  p.setup = function() {
    var canvas = p.createCanvas(2000, 1200);
    canvas.parent('sketch');
    p.colorMode(p.HSB);
    p.blendMode(p.MULTIPLY);
    p.noStroke();
    p.noLoop();

    setup_controllers();
  };

  p.draw = function() {
    set_parametres();
    set_seeds();
    p.randomSeed(COLOR_SEED);
    set_colors();
    p.randomSeed(SHAPE_SEED);
    display();
  };

  function set_seeds() {
    // Using Math.random over P5.random to avoid the P5 seed.
    COLOR_SEED = use_custom_color_seed ? custom_color_seed : p.floor(Math.random() * 100000000);
    SHAPE_SEED = use_custom_shape_seed ? custom_shape_seed : p.floor(Math.random() * 100000000);
  }

  function set_colors() {
    random_palette = [];
    for (var i = 0; i < number_of_layers; i++) {
      random_palette.push(p.random(360));
    }
  }

  function display() {
    p.clear();
    p.background('#fff');
    for (var h = 0; h < number_of_layers; h++) {
      init(h * 250 - 100);
      let hue = use_saved_palette ? current_palette[h] : random_palette[h];
      current_palette[h] = hue;
      p.fill(hue, 100, 95, 0.012);
      for (var i = 0; i < shapes_per_layer; i++) {
        let shape = get_variant();
        display_shape(shape);
      }
    }
  }

  function init(ypos) {
    points = [];
    for (var i = 0; i < initial_size; i++) {
      let vec = p.createVector(i / (initial_size - 1) * p.width, ypos, p.random(-1, 1));
      move_nearby(vec, initial_deviation);
      points.push(vec);
    }
    for (let b = 0; b < number_of_interpolations; b++) {
      interpolate(points, initial_deviation);
    }
  }

  function get_variant() {
    let c = deep_copy(points);
    for (let b = 0; b < 8; b++) {
      c.forEach(function(pnt) {
        move_nearby(pnt, deviation);
      }, this);
    }
    return c;
  }

  function display_shape(shape) {
    p.beginShape();
    p.vertex(0, shape[0].y);

    shape.forEach(function(pnt) {
      p.vertex(pnt.x, pnt.y);
    });

    p.vertex(p.width, shape[shape.length - 1].y);
    p.vertex(p.width, p.height);
    p.vertex(0, p.height);
    p.endShape(p.CLOSE);
  }

  function interpolate(points, sd) {
    for (var i = points.length - 1; i > 0; i--) {
      points.splice(i, 0, generate_midpoint(points[i - 1], points[i], sd));
    }
  }

  function generate_midpoint(p1, p2, sd) {
    let p3 = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2 * 0.45 * p.random(0.1, 3));
    move_nearby(p3, sd);
    return p3;
  }

  let move_nearby = function(pnt, sd) {
    pnt.x = p.randomGaussian(pnt.x, pnt.z * sd);
    pnt.y = p.randomGaussian(pnt.y, pnt.z * sd);
  };

  let deep_copy = function(arr) {
    let narr = [];
    for (var i = 0; i < arr.length; i++) {
      narr.push(arr[i].copy());
    }
    return narr;
  };

  let saveToFile = function() {
    p.saveCanvas(filename + '_c' + COLOR_SEED + '_s' + SHAPE_SEED, 'jpeg');
  };

  // ---- UI ----

  let setup_controllers = function() {
    let palette_container = p.createDiv('').parent('controller');
    let get_palette_button = p.createButton('Get palette from image').parent(palette_container);
    for (var i = 0; i < number_of_layers; i++) {
      hue_inputs.push(p.createInput(0, 'number').parent(palette_container));
    }
    use_this_palette_checkbox = p.createCheckbox('Use this palette', false).parent(palette_container);

    let shape_container = p.createDiv('').parent('controller');
    let get_shape_button = p.createButton('Get shape from image').parent(shape_container);
    shape_input = p.createInput(0, 'number').parent(shape_container);
    use_this_shape_checkbox = p.createCheckbox('Use this shape', false).parent(shape_container);

    let action_container = p.createDiv('').parent('controller');
    let generate_button = p.createButton('Generate (A)').parent(action_container);
    let download_button = p.createButton('Download (S)').parent(action_container);

    get_palette_button.mousePressed(update_hue_inputs);
    get_shape_button.mousePressed(update_shape_input);
    generate_button.mousePressed(p.draw);
    download_button.mousePressed(saveToFile);
  };

  let update_hue_inputs = function() {
    hue_inputs.forEach(function(hue_input, i) {
      hue_input.value(p.floor(current_palette[i]));
    }, this);
  };

  let update_shape_input = function() {
    shape_input.value(SHAPE_SEED);
  };

  let set_parametres = function() {
    for (var i = 0; i < number_of_layers; i++) {
      current_palette[i] = p.constrain(hue_inputs[i].value(), 0, 360);
    }
    custom_shape_seed = shape_input.value();

    use_custom_shape_seed = use_this_shape_checkbox.checked();
    use_saved_palette = use_this_palette_checkbox.checked();
  };

  p.keyPressed = function() {
    if (p.keyCode === 83) {
      // S key
      saveToFile();
    } else if (p.keyCode === 65) {
      // A key
      p.draw();
    }
  };
};
new p5(sketch);
