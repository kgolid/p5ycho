let sketch = function(p) {
  let initial_size = 5;
  let initial_deviation = 350;
  let deviation = 100;
  let number_of_interpolations = 8;

  let points;
  let current;

  let filename = 'landslide';
  let auto_download = false;

  let use_custom_seed = false;
  let custom_seed = 77714660;

  let use_custom_palette = false;
  let current_palette = 'dusk';

  let THE_SEED;

  let palettes = {
    hieronymus: [141, 20, 350, 208, 31, 96],
    sunset: [265, 6, 325, 38, 255, 107],
    fiery: [14, 234, 27, 356, 248, 53],
    blue_mountain: [60, 241, 189, 246, 216, 185],
    purple_green: [44, 1, 166, 286, 165, 80],
    orange_purple: [335, 54, 198, 312, 91, 261],
    lavarock: [200, 32, 359, 27, 208, 187],
    dusk: [206, 61, 51, 224, 26, 40],
    rainbow: [260, 83, 17, 68, 227, 297]
  };

  p.setup = function() {
    p.createCanvas(2000, 1200);
    p.noStroke();
    p.colorMode(p.HSB);
    p.blendMode(p.MULTIPLY);
    if (use_custom_seed) p.noLoop();
  };

  p.draw = function() {
    if (auto_download) saveToFile();

    THE_SEED = use_custom_seed ? custom_seed : p.floor(p.random(99999999));
    p.randomSeed(THE_SEED);

    display();
  };

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

  function update() {
    let c = deep_copy(points);
    for (let b = 0; b < 8; b++) {
      for (let i = 0; i < c.length; i++) {
        move_nearby(c[i], deviation);
      }
    }
    return c;
  }

  function display() {
    p.clear();
    p.background('#fff');
    for (var h = 0; h < 6; h++) {
      init(h * 250 - 100);
      let hue = use_custom_palette ? palettes[current_palette][h] : p.random(360);
      //console.log(hue);
      p.fill(hue, 100, 95, 0.012);
      for (var i = 0; i < 45; i++) {
        current = update();
        display_row();
      }
    }
  }

  function display_row() {
    p.beginShape();
    p.vertex(0, current[0].y);
    for (let i = 0; i < current.length; i++) {
      p.vertex(current[i].x, current[i].y);
    }
    p.vertex(p.width, current[current.length - 1].y);
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

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      // P key
      saveToFile();
    } else if (p.keyCode === 65) {
      // A key
      auto_download = !auto_download;
    } else if (p.keyCode === 67) {
      // C key
      use_custom_palette = !use_custom_palette;
    }
  };

  let saveToFile = function() {
    if (use_custom_palette) p.saveCanvas(filename + '_' + current_palette + '_' + THE_SEED, 'jpeg');
    else p.saveCanvas(filename + '_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
