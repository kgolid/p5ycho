let sketch = function(p) {
  let THE_SEED;
  let border = 0;
  let number_of_particles = 4000;
  let number_of_particle_sets = 8;
  let particle_sets = [];
  let tick = 0;

  let palette;

  let nzoom = 10;

  p.setup = function() {
    p.createCanvas(1400, 900);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.noFill();
    p.background('#e7e7db');
    p.stroke(20, 10);
    p.strokeWeight(0.7);
    p.smooth();

    palette = [p.color(80, 55, 83, 20), p.color(21, 142, 121, 20)];

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      for (var i = 0; i < number_of_particles; i++) {
        ps.push(
          new Particle(
            p.randomGaussian(p.width / 2, 160),
            //border + p.random(p.width - 2 * border),
            //border + p.random(p.height - 2 * border),
            p.randomGaussian(3 * p.height / 5, 160),
            p.random(p.TWO_PI)
          )
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
      this.altitude = 0;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = p.map(this.pos.y, 0, p.height + 100, 4, 0.5) * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 2 * p.map(this.pos.y, 0, p.height + 100, 4, 1) * p.map(this.pos.y, 0, p.height, -1, 1);

      let n = p.createVector(nx, ny);

      this.altitude = p.noise(n.x + 423.2, n.y - 231.1);
      let nval = (this.altitude + 0.045 * (index - number_of_particle_sets / 2)) % 1;

      this.angle += 3 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.482 && this.val < 0.518) {
        //p.stroke(palette[index % palette.length]);
        //if (index === 2) p.stroke(255, 25, 20, 20);
        //else p.stroke(20, 10);
        p.push();
        p.translate(this.pos.x, this.pos.y + 10 - this.altitude * 40 * p.map(this.pos.y, 0, p.height + 100, 1, 4));
        p.rotate(this.angle);
        p.point(0, 0);
        p.pop();
      }
    }
  }
};
new p5(sketch);
