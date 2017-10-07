let sketch = function(p) {

  let rings = 90;
  let dim_init = 0;
  let dim_delta = 20;

  let chaos_init = 0;
  let chaos_delta = .2;
  let chaos_mag = 100;

  let colors = [];

  let ox = p.random(10000);
  let oy = p.random(10000);

  p.setup = function(){
    p.createCanvas(800, 800);
    p.colorMode(p.HSB);
    //p.blendMode(p.OVERLAY);
    p.strokeWeight(58);
    p.smooth();
    p.noFill();
    p.noLoop();

    colors.push(p.random(360));
    colors.push(p.random(360));
    colors.push(p.random(360));

  }

  p.draw = function() {
    p.clear();
    p.translate(-50, -50);
    display();
  }

  function display(){
    for(let i = 0; i < rings; i ++){
      p.stroke(colors[p.floor(p.random(colors.length))],70,85,.9);
      p.beginShape();
      for(let angle = 0; angle < 900; angle++){
        let radius =  (chaos_mag * p.noise(angle /300, chaos_delta * i)) + (dim_delta * i);
        p.vertex(angle, radius);
      }
      p.endShape();
    }
  }

  function getNoise (radian, dim){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim, oy + p.sin(r) * dim);
  }
}

new p5(sketch);
