let sketch = function(p) {
  let THE_SEED;
  let number_of_particles = 3500;
  let number_of_particle_sets = 12;
  let particle_sets = [];
  let tick = 0;

  let palette;

  p.setup = function() {
    p.createCanvas(1200, 1200);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.background('#111');

    palette = [
      p.color(254, 242, 145, 20),
      p.color(253, 198, 103, 20),
      p.color(182, 245, 200, 20),
      p.color(84, 146, 76, 20),
      p.color(221, 124, 81, 20),
      p.color(253, 158, 149, 20),
      p.color(112, 184, 214, 20)
    ];

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      let col = palette[p.floor(p.random(palette.length))];
      for (var i = 0; i < number_of_particles; i++) {
        ps.push(
          new Particle(p.randomGaussian(p.width / 2, 150), p.randomGaussian(p.height / 2, 150), p.random(p.TAU), col)
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
    constructor(x, y, phi, col) {
      this.pos = p.createVector(x, y);
      this.altitude = 0;
      this.val = 0;
      this.angle = phi;
      this.col = col;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = 1.1 * p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 3.1 * p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.y, 0, p.height, -1, 1);

      this.altitude = p.noise(nx + 423.2, ny - 231.1);
      this.val = (this.altitude + 0.035 * (index - number_of_particle_sets / 2)) % 1;
      this.angle += 3 * p.map(this.val, 0, 1, -1, 1);
    }

    display(index) {
      if (this.val > 0.485 && this.val < 0.515) {
        p.stroke(this.col);
        p.push();
        p.translate(this.pos.x, this.pos.y + 50 - this.altitude * 100 * p.map(this.pos.y, 0, p.height, 0.2, 4));
        p.rotate(this.angle);
        p.point(0, 0);
        p.pop();
      }
    }
  }
};
new p5(sketch);
