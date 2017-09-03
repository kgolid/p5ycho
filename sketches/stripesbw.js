let sketch = function(p) {
  let rows = 40 * 2;
  let radius = 400 * 1.2;
  let min_length = 10;
  let max_length = 80;
  let space = 10;
  let stripes = [];
  let colors;
  let tick = 0;

  p.setup = function() {
    p.createCanvas(1000,1000);
    p.stroke(0);
    p.noFill();
    //p.frameRate(10);

    for (var i = 0; i < rows; i++) {
      let ypos = ((i + .5)/rows) * (radius * 2) - radius;
      let row_length = 2 * p.sqrt((radius * radius) - (ypos * ypos));
      add_stripe_row(ypos, row_length);
    }
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(- p.PI / 12);
    for (var s in stripes) {
      var stripe = stripes[s];
      p.strokeWeight(12);
      p.stroke(22,23,22);
      // if(p.noise(5000 + stripe.start/200 + tick / 20, 5000 + stripe.y/200, tick/400) > .45)
      //   p.line(stripe.start, stripe.y, stripe.end, stripe.y);
      // if(p.noise(5000 + stripe.start/200 + tick / 20, 5000 + stripe.y/200, tick/400) > .4) {
      //   //p.stroke(245,200,40);
      //   p.stroke(22,23,22,40);
      //   p.line(stripe.start, stripe.y, stripe.end, stripe.y);
      // }

        p.strokeWeight(p.max(0, p.noise(5000+ stripe.start/100, 5000 - tick/160  + stripe.y/100, tick/200) * 20 - 6));
        p.line(stripe.start, stripe.y, stripe.end, stripe.y);
      
    }
    tick++;
  }

  function add_stripe_row (ypos, row_length) {
    //let length = p.max(0, p.randomGaussian(mean_length, deviation));
    let length = p.random(min_length,max_length);
    let start = -.5 * row_length;
    let end = start + length;
    while (end < row_length / 2 - space - min_length) {
      stripes.push({y:ypos, start:start, end:end});
      //length = p.max(0,p.randomGaussian(mean_length, deviation));
      length = p.random(min_length,max_length);
      start = end + space;
      end = start + length;
    }
    stripes.push({y:ypos, start:start, end:row_length / 2});
  }

  p.keyPressed = function () {
    console.log(p.keyCode);
    if (p.keyCode === 80) {
      p.saveCanvas();
    }
  }
}

new p5(sketch);