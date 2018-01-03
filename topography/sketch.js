let sketch = function(p) {
  let rings = 36;
  let dim_init = 0;
  let dim_delta = 0;

  let chaos_init = 0.1;
  let chaos_delta = 0.05;
  let chaos_mag = 200;

  let ox = p.random(10000);
  let oy = p.random(10000);
  let oz = p.random(10000);

  let arr = [];
  let spacing = -10;
  let magnitude = 80;
  let noise_delta = 17;
  let noise_radius = 0.3;

  let cols = ['#fa4', '#fb3', '#ec4', '#dd5', '#ada', '#9bc'];

  let cols2 = ['#fa4', '#fb4', '#fc5', '#dd5', '#ada', '#8bc'];

  p.setup = function() {
    let c = p.createCanvas(800, 800);
    c.style('border:4px solid #000');
    c.parent('sketch');
    p.strokeWeight(1);
    p.stroke(0, 0, 0);
    p.smooth();
    p.noLoop();

    for (let i = 0; i < 360; i++) {
      arr.push(dim_init);
    }
  };

  p.draw = function() {
    p.push();
    p.translate(p.randomGaussian(p.width / 2, 250), p.randomGaussian(p.height / 2, 250));
    display();
    p.pop();
    display_crosses();
    display_grid();
  };

  function display() {
    for (let i = 0; i < rings; i++) {
      if (i % 6 == 0) p.strokeWeight(2);
      else p.strokeWeight(1);

      p.fill(cols[p.floor(i / rings * cols.length)]);
      //p.fill(cols[p.floor(p.random(cols.length))]);

      var new_arr = [];

      p.beginShape();
      for (const ang in arr) {
        let rad = p.radians(ang);
        let new_radius = spacing + arr[ang] + getNoise(rad, i * noise_delta) * magnitude;

        p.vertex(new_radius * p.cos(rad), new_radius * p.sin(rad));
        new_arr[ang] = new_radius;
      }
      p.beginContour();
      for (const ang in arr) {
        let rad = p.radians(359 - ang);
        p.vertex(arr[359 - ang] * p.cos(rad), arr[359 - ang] * p.sin(rad));
      }
      p.endContour();

      p.endShape(p.CLOSE);

      arr = new_arr;
    }
  }

  function display_crosses() {
    for (var i = 0; i < 100; i++) {
      p.push();
      p.translate(p.random(20, p.width - 20), p.random(20, p.height - 20));

      p.line(-5, 0, 5, 0);
      p.line(0, -5, 0, 5);
      p.pop();
    }
  }

  function display_grid() {
    p.stroke(0, 80);
    p.strokeWeight(1);
    let grid_space = 160;
    for (var i = grid_space; i < p.height; i += grid_space) {
      p.line(0, i, p.width, i);
    }
    for (var j = grid_space; j < p.width; j += grid_space) {
      p.line(j, 0, j, p.height);
    }
  }

  function getNoise(radian, dim) {
    let r = radian % p.TAU;
    if (r < 0.0) {
      r += p.TAU;
    }
    return p.noise(ox + p.cos(r) * (noise_radius + dim / 200), oy + p.sin(r) * (noise_radius + dim / 200), dim);
  }

  function getNoiseWithTime(radian, dim, time) {
    let r = radian % p.TWO_PI;
    if (r < 0.0) {
      r += p.TWO_PI;
    }
    return p.noise(ox + p.cos(r) * dim, oy + p.sin(r) * dim, oz + time);
  }
};

new p5(sketch);
