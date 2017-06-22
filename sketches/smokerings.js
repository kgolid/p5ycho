let sketch = function(p) {
    let ox = p.random(10000);
    let oy = p.random(10000);
    let oz = p.random(10000);

  p.setup = function(){
    p.createCanvas(800, 800);
    p.strokeWeight(2);
    p.stroke(0,30);
    p.smooth();
    p.noFill();
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, p.height / 2);
    display()
  }

  function display(){
    ox+=0.01;
    oy+=0.01;
    oz+=0.007;

    for(let i = 0; i < 50; i++){
      p.beginShape();
      for(let angle = 0; angle < 360; angle+=3){
        let radian = p.radians(angle);
        let radius = 250 + p.map(getNoise(radian, 0.35, 0.02 * i), 0, 1, -150, 150);
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

  function getNoise (radian, dim, time){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim , oy + p.sin(r) * dim, oz + time);
  }
}

new p5(sketch);
