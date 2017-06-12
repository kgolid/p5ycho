var sketch = function (p) {
  const w = p.windowWidth;
  const h = p.windowHeight;
  let t = 0;
  let n = 800;
  let particles = [];

  p.setup = function() {
    p.createCanvas(w, h);
    p.stroke(0, 10);

    for(var i = 0; i < n; i++) {
      particles.push(
        {
          pos: p.createVector(p.random(w), p.random(h)),
          vel: p.createVector(0,0),
          seed: i
        }
      )
    }
  }

  p.draw = function() {
    particles.forEach( function(prtcl) {
      display(prtcl.pos, prtcl.vel);
      update(prtcl.pos, prtcl.vel, prtcl.seed);
    });

    t += 0.002;
  }

  let display = function(pos, vel) {
    //p.line(pos.x, pos.y, (pos.x + vel.x), (pos.y + vel.y));
    //p.fill(0);
    //p.ellipse(pos.x, pos.y, 5);
    p.point(pos.x, pos.y);
  }

  let update = function(pos, vel, seed) {
    pos.x = mod((pos.x + vel.x), w);
    pos.y = mod((pos.y + vel.y), h);

    var r = p5.Vector.fromAngle(p.noise(seed,t) * p.TWO_PI);
    vel.x = r.x;
    vel.y = r.y;

    vel.add(flow(pos)).mult(3);
  }

  let flow = function(pos) {
    let r = p.noise(pos.x / 100, pos.y / 100) * p.TWO_PI;
    return p5.Vector.fromAngle(r).mult(2);
  }

  let mod = function (x, n) {
    return ((x % n) + n ) % n;
  }
}

var x = new p5(sketch)
