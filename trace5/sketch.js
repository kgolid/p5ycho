let sketch = function(p) {
  let THE_SEED;
  let border = 0;
  let number_of_particles = 3000;
  let number_of_particle_sets = 12;
  let particle_sets = [];
  let tick = 0;

  let palette;

  let nzoom = 10;

  p.setup = function() {
    p.createCanvas(1200, 1200);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.noFill();
    //p.background('#e7e7db');
    p.background('#111');
    p.stroke(20, 10);
    p.strokeWeight(0.7);
    p.smooth();

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
      let pal = p.floor(p.random(palette.length));
      for (var i = 0; i < number_of_particles; i++) {
        ps.push(
          new Particle(
            p.randomGaussian(p.width / 2, 150),
            //border + p.random(p.width - 2 * border),
            //border + p.random(p.height - 2 * border),
            p.randomGaussian(p.height / 2, 150),
            p.random(p.TWO_PI),
            pal
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
    constructor(x, y, phi, pal) {
      this.pos = p.createVector(x, y);
      this.angle = phi;
      this.val = 0;
      this.altitude = 0;
      this.palette = pal;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.x, 0, p.width, -1, 1);
      let ny = 2.5 * p.map(this.pos.y, 0, p.height, 4, 0.2) * p.map(this.pos.y, 0, p.height, -1, 1);

      let n = p.createVector(nx, ny);

      this.altitude = p.noise(n.x + 423.2, n.y - 231.1);
      let nval = (this.altitude + 0.027 * (index - number_of_particle_sets / 2)) % 1;

      this.angle += 3 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.488 && this.val < 0.512) {
        p.stroke(palette[this.palette]);
        //if (index === 2) p.stroke(255, 25, 20, 20);
        //else p.stroke(20, 10);
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
