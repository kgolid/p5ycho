let sketch = function(p) {
  let THE_SEED;

  let patches = [];
  let patch_width = 100;
  let patch_height = 100;

  let quilt = [];
  let quilt_width = 5;
  let quilt_height = 5;

  let colors = [];

  p.setup = function() {
    p.createCanvas(800, 800);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();

    p.strokeWeight(10 / patch_height);
    p.background('#d6d9d2');

    colors = [
      p.color(29, 132, 82),
      p.color(101, 82, 59),
      p.color(140, 52, 52),
      p.color(181, 101, 55),
      p.color(109, 46, 82),
      p.color(58, 68, 118)
    ];

    patches = [
      new Patch([new Shape(square, 0, 0, 0)], [new Shape(square, 0.5, 0.5, 0)]),
      new Patch([new Shape(half, 0, 0, 0)], [new Shape(half, 0, 0, 2)]),
      new Patch([new Shape(corner, 0, 0, 0), new Shape(corner, 0, 0, 2)], [new Shape(diagonal, 0, 0, 0)]),
      new Patch([new Shape(house, 0, 0, 0)], [new Shape(house, 0, 0, 2)]),
      new Patch([new Shape(triangle, 0, 0, 0)], [new Shape(arrow, 0, 0, 0)]),
      new Patch(
        [new Shape(triangle, 0, 0, 0), new Shape(triangle, 0, 0.5, 0)],
        [new Shape(corner, 0, 0.5, 2), new Shape(corner, 0.5, 0, 3)]
      ),
      new Patch(
        [new Shape(quarter, 0, 0, 0), new Shape(quarter, 0, 0, 2)],
        [new Shape(quarter, 0, 0, 1), new Shape(quarter, 0, 0, 3)]
      ),
      new Patch(
        [new Shape(quarter, 0, 0, 0), new Shape(quarter, 0, 0.5, 3)],
        [new Shape(quarter, 0, 0, 3), new Shape(quarter, 0.5, 0, 0)]
      ),
      new Patch([new Shape(semi, 0, 0, 0)], [new Shape(semi, 0, 0, 2)]),
      new Patch([new Shape(small_square, 0, 0, 0)], [new Shape(ell, 0, 0, 2)])
    ];

    p.translate(150, 150);
    p.scale(patch_width, patch_height);
    for (var i = 0; i < quilt_height; i++) {
      p.push();
      for (var j = 0; j < quilt_width; j++) {
        getr(patches).display(getrs(colors, 2), p.floor(p.random(4)));
        p.translate(1, 0);
      }
      p.pop();
      p.translate(0, 1);
    }
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  function getr(list) {
    return list[p.floor(p.random(list.length))];
  }

  function getrs(list, n) {
    return p.shuffle(list).slice(n);
  }

  // ---- CLASSES ----

  class Patch {
    constructor(shapes1, shapes2) {
      this.shapes1 = shapes1;
      this.shapes2 = shapes2;
    }

    display(cols, rotation) {
      p.push();
      p.fill('#d6d9d2');
      p.translate(0.5, 0.5);
      p.rotate(rotation * p.PI / 2);
      p.translate(-0.5, -0.5);
      p.rect(0, 0, 1, 1);
      this.shapes1.forEach(function(shape) {
        shape.display(cols[0]);
      });
      this.shapes2.forEach(function(shape) {
        shape.display(cols[1]);
      });
      p.pop();
    }
  }

  class Shape {
    constructor(path, transx, transy, rotation) {
      this.path = path;
      this.transx = transx;
      this.transy = transy;
      this.rotation = rotation;
    }

    display(col) {
      p.push();
      p.translate(0.5, 0.5);
      p.rotate(this.rotation * p.PI / 2);
      p.translate(-0.5, -0.5);
      p.translate(this.transx, this.transy);
      p.fill(col);
      this.path();
      p.pop();
    }
  }

  function square() {
    p.rect(0, 0, 0.5, 0.5);
  }

  function half() {
    p.rect(0, 0, 1, 0.5);
  }

  function small_square() {
    p.rect(0, 0, 1 / 3, 1 / 3);
  }

  function ell() {
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(1, 0);
    p.vertex(1, 1 / 3);
    p.vertex(1 / 3, 1 / 3);
    p.vertex(1 / 3, 1);
    p.vertex(0, 1);
    p.endShape(p.CLOSE);
  }

  function corner() {
    p.strokeJoin(p.ROUND);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0.5, 0);
    p.vertex(0, 0.5);
    p.endShape(p.CLOSE);
    p.strokeJoin(p.MILTER);
  }

  function diagonal() {
    p.strokeJoin(p.ROUND);
    p.beginShape();
    p.vertex(0, 0.5);
    p.vertex(0.5, 0);
    p.vertex(1, 0);
    p.vertex(0, 1);
    p.endShape(p.CLOSE);
    p.strokeJoin(p.MILTER);
  }

  function triangle() {
    p.strokeJoin(p.ROUND);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(1, 0);
    p.vertex(0.5, 0.5);
    p.endShape(p.CLOSE);
    p.strokeJoin(p.MILTER);
  }

  function house() {
    p.strokeJoin(p.ROUND);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0.5, 0);
    p.vertex(0.5, 1);
    p.vertex(0, 0.5);
    p.endShape(p.CLOSE);
    p.strokeJoin(p.MILTER);
  }

  function arrow() {
    p.strokeJoin(p.ROUND);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0.5, 0.5);
    p.vertex(1, 0);
    p.vertex(1, 0.5);
    p.vertex(0.5, 1);
    p.vertex(0, 0.5);
    p.endShape(p.CLOSE);
    p.strokeJoin(p.MILTER);
  }

  function slash() {
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0.5, 0.5);
    p.vertex(0.5, 1);
    p.vertex(0, 0.5);
    p.endShape(p.CLOSE);
  }

  function semi() {
    p.arc(0.5, 0, 1, 1, 0, p.PI, p.CHORD);
  }

  function quarter() {
    p.arc(0, 0, 1, 1, 0, p.PI / 2, p.PIE);
  }
};
new p5(sketch);
