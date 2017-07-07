let sketch = function(p) {
  let grid_size = 5;
  let rings = 80;
  let dim_init = 15;

  let chaos_init = 0.05;
  let chaos_delta = 0.01;
  let chaos_mag = 80;

  let ox,oy,oz;

  p.setup = function(){
    p.createCanvas(800, 800);
    p.strokeWeight(1);
    p.colorMode(p.HSB);
    p.blendMode(p.ADD);
    p.stroke(250,10,20,0.5);
    p.noFill();
    p.smooth();
    p.noLoop();
  }

  p.draw = function() {
    p.clear();
    p.translate(-p.width/(grid_size * 2), -p.height/(grid_size * 2));
    for (var i = 0; i < grid_size; i++) {
      p.translate(0, p.height / grid_size, 0);
      p.push()
      for (var j = 0; j < grid_size; j++) {
        p.translate(p.width / grid_size, 0);
        display();
      }
      p.pop();
    }
  }

  function display(){
    ox = p.random(10000);
    oy = p.random(10000);
    oz = p.random(10000);
    for(let i = 0; i < rings; i+=2){
      p.beginShape();
        for(let angle = 0; angle < 360; angle++){
          let radian = p.radians(angle);
          let radius =  (chaos_mag * getNoiseWithTime(radian, (chaos_delta * i) + chaos_init, oz)) + dim_init;
          p.vertex(radius * p.cos(radian), radius * p.sin(radian));
        }
      p.endShape(p.CLOSE);
    }
  }

  function getNoise (radian, dim){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim, oy + p.sin(r) * dim);
  }

  function getNoiseWithTime (radian, dim, time){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim , oy + p.sin(r) * dim, oz + time);
  }
}

new p5(sketch);
