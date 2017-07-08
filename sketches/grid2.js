let sketch = function(p) {
  let shapes = [];
  let current_dir = "V";
  let current_step = 1;
  let initial_square;
  let initial_color;

  p.setup = function() {
    p.createCanvas(900,900);
    //p.fill(255,105,60,30);
    p.noStroke();
    //p.stroke(40,0,60);
    p.blendMode(p.SOFT_LIGHT);
    //p.frameRate(1);
    p.smooth();

    let r = p.random(255);
    let g = p.random(255);
    let b = p.random(255);
    initial_color = p.color(r,g,b);

    initial_square = {
      nw: p.createVector(10,10),
      ne: p.createVector(p.width-10, 10),
      sw: p.createVector(10, p.height-10),
      se: p.createVector(p.width-10, p.height-10),
      c: initial_color
    }
    shapes.push(initial_square);
  }

  p.draw = function() {
    if(current_step < 16) {
      //p.clear();
      split_all();
      display();
    }
  }

  function split_all() {
    let new_shapes = [];
    for (var j = 0; j < shapes.length; j++) {
      new_shapes = new_shapes.concat(split(shapes[j], current_dir));
    }
    shapes = new_shapes;
    current_dir = toggle(current_dir);
    current_step++;
  }

  function display () {
    //p.strokeWeight(50 / p.sq(current_step) + .5);
    for (var i = 0; i < shapes.length; i++) {
      p.fill(shapes[i].c);
      p.beginShape();
      p.vertex(shapes[i].nw.x, shapes[i].nw.y);
      p.vertex(shapes[i].ne.x, shapes[i].ne.y);
      p.vertex(shapes[i].se.x, shapes[i].se.y);
      p.vertex(shapes[i].sw.x, shapes[i].sw.y);
      p.vertex(shapes[i].nw.x, shapes[i].nw.y);
      p.vertex(shapes[i].ne.x, shapes[i].ne.y);
      p.endShape(p.CLOSE);
    }
  }

  function split (shape, dir) {
    let r1 = p.constrain(p.randomGaussian(.5, .07),0,1);
    let r2 = p.constrain(p.randomGaussian(.5, .07),0,1);

    //if(p.random(100) < 10) return [];

    if (dir == "H") {
      if (shape.nw.dist(shape.sw) < 5 || shape.ne.dist(shape.se) < 5) return [shape];

      let pwx = p.map(r1, 0, 1, shape.nw.x, shape.sw.x);
      let pwy = p.map(r1, 0, 1, shape.nw.y, shape.sw.y);
      let pw = p.createVector(pwx, pwy);

      let pex = p.map(r2, 0, 1, shape.ne.x, shape.se.x);
      let pey = p.map(r2, 0, 1, shape.ne.y, shape.se.y);
      let pe = p.createVector(pex, pey);

      let sh1 = { nw:shape.nw, ne:shape.ne, sw:pw, se:pe, c:similar_col(shape.c) };
      let sh2 = { nw:pw, ne:pe, sw:shape.sw, se:shape.se, c:similar_col(shape.c) };

      return [sh1, sh2];
    } else {
      if (shape.nw.dist(shape.ne) < 5 || shape.sw.dist(shape.se) < 5) return [shape];

      let pnx = p.map(r1, 0, 1, shape.nw.x, shape.ne.x);
      let pny = p.map(r1, 0, 1, shape.nw.y, shape.ne.y);
      let pn = p.createVector(pnx, pny);

      let psx = p.map(r2, 0, 1, shape.sw.x, shape.se.x);
      let psy = p.map(r2, 0, 1, shape.sw.y, shape.se.y);
      let ps = p.createVector(psx, psy);

      let sh1 = { nw:shape.nw, ne:pn, sw:shape.sw, se:ps, c:similar_col(shape.c) };
      let sh2 = { nw:pn, ne:shape.ne, sw:ps, se:shape.se, c:similar_col(shape.c) };

      return [sh1, sh2];
    }
  }

  function toggle (dir) {
    if (dir == "H") return "V";
    else return "H";
  }

  function similar_col (c) {
    let r = p.red(c);
    let g = p.green(c);
    let b = p.blue(c);

    let r1 = p.constrain(p.randomGaussian(r,15),0,255);
    let g1 = p.constrain(p.randomGaussian(g,15),0,255);
    let b1 = p.constrain(p.randomGaussian(b,15),0,255);

    return p.color(r1,g1,b1,80);
  }
}

new p5(sketch);
