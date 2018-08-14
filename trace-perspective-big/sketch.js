const perspective = require('perspective-transform');

let sketch = function(p) {
  let THE_SEED;
  let number_of_particles = 8000;
  let number_of_particle_sets = 6;
  let particle_sets = [];

  let squeeze_y = 0.45;
  let perspective_x = 0.75;

  let pTransform;

  p.setup = function() {
    var cnv = p.createCanvas(4000, 4000);
    cnv.style('width', '1000px');
    cnv.style('height', '1000px');
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.noFill();
    p.background('#e7e7db');
    p.stroke(20, 15);
    p.strokeWeight(1.5);
    p.smooth();

    let pad_x = (p.width - p.width * perspective_x) / 2;
    let pad_y = (p.height - p.height * squeeze_y) / 2;

    var srcCorners = [0, 0, p.width, 0, p.width, p.height, 0, p.height];
    var dstCorners = [
      pad_x,
      pad_y,
      p.width - pad_x,
      pad_y,
      p.width + pad_x,
      p.height - pad_y,
      -pad_x,
      p.height - pad_y
    ];
    pTransform = perspective(srcCorners, dstCorners);

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      for (var i = 0; i < number_of_particles; i++) {
        ps.push(
          new Particle(p.randomGaussian(p.width / 2, 600), p.randomGaussian(p.height / 2, 900), p.random(p.TWO_PI))
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

      let nx = 1.3 * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 1.3 * p.map(this.pos.y, 0, p.height, -1, 1);

      let np = pTransform.transformInverse(nx, ny);

      let n = p.createVector(nx, ny);

      this.altitude =
        p.noise(n.x + 423.2, n.y - 231.1) +
        0.04 * p.noise(n.x * 15 - 113.3, n.y * 8 + 261.1) +
        0.02 * p.noise(n.x * 30 - 54.3, n.y * 30 + 121.1);
      let nval = (this.altitude + 0.065 * (index - number_of_particle_sets / 2)) % 1;

      this.angle += 0.8 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.47 && this.val < 0.53) {
        let np = pTransform.transform(this.pos.x, this.pos.y + 1500 - this.altitude * 2700);
        p.point(np[0], np[1]);
      }
    }
  }
};
new p5(sketch);
