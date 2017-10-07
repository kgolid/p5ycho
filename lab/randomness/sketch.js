let sketch = function(p) {
  let psize = 20;
  let tick = 0;

  p.setup = function() {
    p.createCanvas(800,800);
    p.noStroke();
    p.colorMode(p.HSB);
  }

  p.draw = function() {
    tick++
    p.clear();

    for (var i = 0; i < p.width / psize; i++) {
      for (var j = 0; j < p.height / psize; j++) {
        display_noise_circle_time(i, j);
      }
    }
  }

  let display_index = function(x, y) {
    let h = p.map(x, 0, p.width / psize, 0, 360);
    let s = p.map(y, 0, p.height / psize, 0, 100);
    p.fill(h, s, 100);
    p.rect(x * psize, y * psize, psize, psize);
  }
  
  let display_random = function(x, y) {
    p.fill(0, 0, p.random(100));
    p.rect(x * psize, y * psize, psize, psize);
  }
  
  let display_noise = function(x, y) {
    p.fill(0, 0, p.noise(x / 10,y / 10) * 100 );
    p.rect(x * psize, y * psize, psize, psize);
  }
  
  let display_noise_time = function(x, y) {
    p.fill(0, 0, p.noise(x / 10,y / 10, tick / 200) * 100 );
    p.rect(x * psize, y * psize, psize, psize);
  }
  
  let display_noise_circle = function(x, y) {
    p.fill(0);
    let d = p.noise(x / 10, y / 10) * psize;
    p.ellipse(x * psize, y * psize, d);
  }
  
  let display_noise_circle_time = function(x, y) {
    p.fill(0);
    let d = p.noise(x / 10, y / 10, tick / 60) * psize;
    p.ellipse(x * psize, y * psize, d);
  }
}

new p5(sketch);
