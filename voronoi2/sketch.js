let sketch = function(p) {
  let n = 1000;
  let points;
  let hue_offset;
  let tick;

  p.setup = function() {
    let c = p.createCanvas(1000,1000);
    c.style("border-radius:50%");
    p.colorMode(p.HSB);
    p.noStroke();
    init(); 
  }

  p.draw = function() {
    points.forEach(function(pnt) {
      if(tick < pnt.dim) {
        p.fill((160 + tick/ 1.8) % 360, 90, 100 - tick / 1.9);
        p.ellipse(pnt.pos.x, pnt.pos.y, pnt.dim - tick);
      }
    }, this);
    tick++;
  }

  function init () {
    points = [];
    tick = 0;
    hue_offset = p.random(360);

    let centre = p.createVector(p.width/2, p.height/2);
    for (var i = 0; i < n; i++) {
      let pos = p.createVector( p.randomGaussian(p.width/2, p.width/2.5), p.randomGaussian(p.height/2, p.height/3));
      let centre_dist = p5.Vector.dist(centre, pos);
      points.push({
        pos:pos,
        dim: 60 + centre_dist / 2.5
      });
    }
  }
}
new p5(sketch);