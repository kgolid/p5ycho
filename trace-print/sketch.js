let sketch = function(p) {
  let THE_SEED;
  let border = 600;
  let number_of_particles = 12000;
  let number_of_particle_sets = 6;
  let particle_sets = [];

  let tick = 0;
  let print_time = 4000; // Number of frames until printing result.

  let palette;

  let ndimx = 4200;
  let ndimy = 5900;

  p.setup = function() {
    p.createCanvas(4200, 5940);
    //p.background('#eeeee5');
    p.background('#fff');
    THE_SEED = p.floor(p.random(65536));
    //THE_SEED = 48778;
    p.randomSeed(THE_SEED);
    p.noiseSeed(THE_SEED);
    console.log(THE_SEED);
    //p.pixelDensity(3);

    p.noFill();
    p.stroke(0, 18);
    p.strokeWeight(1);
    //p.smooth();

    palette = [p.color(80, 55, 83, 20), p.color(21, 142, 121, 20)];

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      for (var i = 0; i < number_of_particles; i++) {
        let ry1 = border + p.random(p.height - 2 * border);
        let ry2 = border + p.random(p.height - 2 * border);
        let ry3 = border + p.random(p.height - 2 * border);
        let b1 = p.map(ry1, 0, p.height, 1.5, 0.6) * border;
        let b2 = p.map(ry2, 0, p.height, 1.5, 0.6) * border;
        let b3 = p.map(ry3, 0, p.height, 1.5, 0.6) * border;
        let rx1 = b1 + p.random(p.width - 2 * b1);
        let rx2 = b2 + p.random(p.width - 2 * b2);
        let rx3 = b3 + p.random(p.width - 2 * b3);
        ps.push(
          new Particle(
            //p.randomGaussian(p.width / 2, p.width / 5),
            //border + p.random(p.width - 2 * border),
            //border + p.random(p.height - 2 * border),
            //p.randomGaussian(p.height / 2, p.height / 4),
            (rx1 + rx2 + rx3) / 3,
            (ry1 + ry2 + ry3) / 3,
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
    tick++;

    if (tick % 200 == 0) console.log(tick, ' / ', print_time);

    if (tick == print_time) {
      display_watermark(THE_SEED);
      p.saveCanvas('traceprint_' + THE_SEED, 'jpg');
    }
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpg');
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

      let nx = p.map(this.pos.y, 0, ndimy, 4.6, 0.2) * p.map(this.pos.x, 0, ndimx, -2, 2);
      let ny = 1.5 * p.pow(p.map(this.pos.y, 0, ndimy, 4.6, 0.2), 2.1);
      //console.log(nx, ny);

      let n = p.createVector(nx * 0.6, ny * 0.6);

      this.altitude = p.noise(n.x + 15.232, n.y + 12.654);
      let nval = this.altitude + 0.06 * (-1 + index - number_of_particle_sets / 2);

      this.angle += 1.2 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.474 && this.val < 0.526) {
        //p.stroke(palette[index % palette.length]);
        //if (index === 2) p.stroke(255, 25, 20, 20);
        //else p.stroke(20, 10);
        p.push();
        p.translate(this.pos.x, this.pos.y + 180 - 120 * this.altitude * p.map(this.pos.y, 0, ndimy, 0.3, 4.6));
        //p.rotate(this.angle);
        p.point(0, 0);
        p.pop();
      }
    }
  }

  function display_watermark(num) {
    let dim = 40;
    p.push();
    p.noFill();
    p.stroke(255, 90, 80);
    p.strokeWeight(10);
    p.translate(p.width - 300, p.height - 300);
    for (var i = 15; i >= 0; i--) {
      let powi = p.pow(2, i);
      if (num >= powi) {
        num -= powi;
        p.fill(255, 90, 80);
      }
      p.rect(((15 - i) % 4) * dim, p.floor((15 - i) / 4) * dim, dim, dim);
      p.noFill();
    }
    p.rect(-20, -20, dim * 4 + 40, dim * 4 + 40);
    p.pop();
  }
};
new p5(sketch);
