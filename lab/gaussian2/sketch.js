let sketch = function(p) {
  let n = 10;
  let r = 300;

  let points;
  let current;

  p.setup = function() {
    var canvas = p.createCanvas(1400, 900);
    p.fill(0, 22, 65, 6);
    p.noStroke();
    //p.frameRate(2);
    p.colorMode(p.HSB);
    p.blendMode(p.SCREEN);
    p.noLoop();

    current = [];
    points = init(n, r, points);
  };

  p.draw = function() {
    p.background('#0a0a0a');
    for (var i = 0; i < 5; i++) {
      p.push();
      p.translate(p.randomGaussian(p.width / 2, 350), p.randomGaussian(p.height / 2, 250));
      p.fill(p.random(360), 100, 100, 0.012);
      points = init(n, p.random(100, 500), points);
      run(current, points);
      p.pop();
    }
  };

  function init(n, r, points) {
    points = [];
    for (let i = 0; i < n; i++) {
      let rads = i / n * p.TWO_PI;
      let vec = p.createVector(p.cos(rads) * r, p.sin(rads) * r, p.random(1.2));
      move_nearby(vec, 100);
      points.push(vec);
    }
    for (let b = 0; b < 5; b++) {
      interpolate(points);
    }
    return points;
  }

  function run(current, points) {
    for (var i = 0; i < 60; i++) {
      current = update(current, points);
      display(current);
    }
  }

  function update(current, points) {
    current = deep_copy(points);
    for (let b = 0; b < 5; b++) {
      for (let i = 0; i < current.length; i++) {
        move_nearby(current[i], 100);
      }
    }
    return current;
  }

  function interpolate(points) {
    for (var i = points.length - 1; i > 0; i--) {
      points.splice(i, 0, generate_midpoint(points[i - 1], points[i]));
    }
    points.splice(0, 0, generate_midpoint(points[points.length - 1], points[0]));
  }

  function generate_midpoint(p1, p2) {
    let p3 = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2 * 0.7 * p.random(0.3, 1.8));
    move_nearby(p3, 100);
    return p3;
  }

  let move_nearby = function(pnt, sd) {
    pnt.x = p.randomGaussian(pnt.x, pnt.z * sd);
    pnt.y = p.randomGaussian(pnt.y, pnt.z * sd);
  };

  function display(current) {
    //p.clear();
    p.beginShape();
    for (let i = 0; i < current.length; i++) {
      p.vertex(current[i].x, current[i].y);
    }
    p.endShape(p.CLOSE);
  }

  let deep_copy = function(arr) {
    let narr = [];
    for (var i = 0; i < arr.length; i++) {
      narr.push(arr[i].copy());
    }
    return narr;
  };
};

new p5(sketch);
