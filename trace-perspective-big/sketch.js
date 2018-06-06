const perspective = require('perspective-transform');

let sketch = function(p) {
  let THE_SEED;
  let border = 200;
  let number_of_particles = 3000;
  let number_of_particle_sets = 6;
  let particle_sets = [];
  let tick = 0;

  let palette;

  let nzoom = 10;
  let pTransform;

  p.setup = function() {
    p.createCanvas(2000, 2000);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.noFill();
    p.background('#e7e7db');
    p.stroke(20, 10);
    p.strokeWeight(1.2);
    //p.pixelDensity(2);
    p.smooth();

    //var srcCorners = [-1, -1, 1, -1, 1, 1, -1, 1];
    //var dstCorners = [-0.8, -0.5, 0.8, -0.5, 1, 0.5, -1, 0.5];

    var srcCorners = [0, 0, p.width, 0, p.width, p.height, 0, p.height];
    var dstCorners = [450, 500, p.width - 450, 500, p.width + 450, p.height - 500, -450, p.height - 500];
    pTransform = perspective(srcCorners, dstCorners);

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      for (var i = 0; i < number_of_particles; i++) {
        ps.push(
          new Particle(p.randomGaussian(p.width / 2, 220), p.randomGaussian(p.height / 2, 220), p.random(p.TWO_PI))
        );
      }
      particle_sets.push(ps);
    }
  };

  p.draw = function() {
    particle_sets.forEach(function(particles, index) {
      particles.forEach(function(particle) {
        particle.update(index);
        particle.display(index);
      });
    });
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  class Particle {
    constructor(x, y, phi) {
      this.pos = p.createVector(x, y);
      this.angle = phi;
      this.val = 0;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = 1.8 * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 1.8 * p.map(this.pos.y, 0, p.height, -1, 1);

      let np = pTransform.transformInverse(nx, ny);

      let n = p.createVector(nx, ny);

      this.altitude = p.noise(n.x + 423.2, n.y - 231.1) + 0.05 * p.noise(n.x * 15 - 113.3, n.y * 15 + 221.1);
      let nval = (this.altitude + 0.065 * (index - number_of_particle_sets / 2)) % 1;

      this.angle += 1.8 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.47 && this.val < 0.53) {
        //const pnt = pTransform.transform(this.pos.x, this.pos.y);

        let np = pTransform.transform(this.pos.x, this.pos.y + 350 - this.altitude * 700);
        p.point(np[0], np[1]);
      }
    }
  }
};
new p5(sketch);
