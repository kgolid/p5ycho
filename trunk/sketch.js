let sketch = function(p) {

  const rings = 50;
  const dim_init = 50;
  const dim_delta = 4;

  const chaos_init = .2;
  const chaos_delta = 0.12;
  const chaos_mag = 20;

  let ox = p.random(10000);
  let oy = p.random(10000);
  let oz = p.random(10000);

  p.setup = function(){
    p.createCanvas(800, 800);
    p.strokeWeight(1);
    p.stroke(0);
    p.smooth();
    p.noFill();
    //p.noLoop();
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, p.height / 2);
    display();
  }

  function display(){
    //ox+=0.04;
    oy-=0.02;
    oz+=0.01;
    for(let i = 0; i < rings; i ++){
      p.beginShape();
      for(let angle = 0; angle < 360; angle++){
        const radian = p.radians(angle);
        const radius =  (chaos_mag * getNoiseWithTime(radian, chaos_delta * i + chaos_init, oz)) + (dim_delta * i + dim_init);
        p.vertex(radius * p.cos(radian), radius * p.sin(radian));
      }
      p.endShape(p.CLOSE);
    }
  }

  function getNoiseWithTime (radian, dim, time){
    const r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim , oy + p.sin(r) * dim, oz + time);
  }
}

new p5(sketch);
