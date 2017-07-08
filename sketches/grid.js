let sketch = function(p) {
  let shapes = [];
  let current_dir = "V";
  let current_step = 1;
  let initial_square;

  p.setup = function() {
    p.createCanvas(900,900);
    p.fill(255,105,60,30);
    //p.noFill();
    p.stroke(40,0,60);
    p.colorMode(p.HSB);
    p.blendMode(p.DARKEST);
    //p.frameRate(1);
    p.smooth();

    initial_square = {
      nw: p.createVector(10,10),
      ne: p.createVector(p.width-10, 10),
      sw: p.createVector(10, p.height-10),
      se: p.createVector(p.width-10, p.height-10)
    }
    shapes.push(initial_square);
  }

  p.draw = function() {
    if(current_step < 15) {
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
    p.strokeWeight(50 / p.sq(current_step) + .5);
    for (var i = 0; i < shapes.length; i++) {
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

    if(p.random(100) < 2) return [];

    if (dir == "H") {
      if (shape.nw.dist(shape.sw) < 7 || shape.ne.dist(shape.se) < 7) return [shape];

      let pwx = p.map(r1, 0, 1, shape.nw.x, shape.sw.x);
      let pwy = p.map(r1, 0, 1, shape.nw.y, shape.sw.y);
      let pw = p.createVector(pwx, pwy);

      let pex = p.map(r2, 0, 1, shape.ne.x, shape.se.x);
      let pey = p.map(r2, 0, 1, shape.ne.y, shape.se.y);
      let pe = p.createVector(pex,pey);

      let sh1 = { nw:shape.nw, ne:shape.ne, sw:pw, se:pe };
      let sh2 = { nw:pw, ne:pe, sw:shape.sw, se:shape.se };

      return [sh1, sh2];
    } else {
      if (shape.nw.dist(shape.ne) < 7 || shape.sw.dist(shape.se) < 7) return [shape];

      let pnx = p.map(r1, 0, 1, shape.nw.x, shape.ne.x);
      let pny = p.map(r1, 0, 1, shape.nw.y, shape.ne.y);
      let pn = p.createVector(pnx, pny);

      let psx = p.map(r2, 0, 1, shape.sw.x, shape.se.x);
      let psy = p.map(r2, 0, 1, shape.sw.y, shape.se.y);
      let ps = p.createVector(psx,psy);

      let sh1 = { nw:shape.nw, ne:pn, sw:shape.sw, se:ps };
      let sh2 = { nw:pn, ne:shape.ne, sw:ps, se:shape.se };

      return [sh1, sh2];
    }
  }

  function toggle (dir) {
    if (dir == "H") return "V";
    else return "H";
  }
}

new p5(sketch);
