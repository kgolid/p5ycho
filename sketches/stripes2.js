let sketch = function(p) {
  let rows = 40;
  let radius = 400;
  let min_length = 10;
  let max_length = 100;
  let space = 19;
  let stripes = [];
  let colors;

  p.setup = function() {
    p.createCanvas(850,850);
    p.stroke(0);
    p.strokeWeight(5);
    p.noLoop();

    colors = [
      p.color(142,192,124),
      p.color(250,189,47),
      p.color(251,71,44),
      p.color(211,134,147),
      p.color(49,69,80)
    ];

    colors2 = [
      p.color(210,198,115),
      p.color(253,75,98),
      p.color(138,209,192),
      p.color(130,130,130)
    ];

    for (var i = 0; i < rows; i++) {
      let ypos = ((i + .5)/rows) * (radius * 2) - radius;
      let row_length = 2 * p.sqrt((radius * radius) - (ypos * ypos));
      add_stripe_row(ypos, row_length);
    }
  }

  p.draw = function() {
    //p.clear();
    p.background("#4f3854");
    p.translate(p.width / 2, p.height / 2);
    p.rotate(p.random(p.PI));
    for (var s in stripes) {
      var stripe = stripes[s];
      p.strokeWeight(14);
      p.stroke(colors2[p.floor(p.random(colors2.length))]);
      p.line(stripe.start, stripe.y, stripe.end, stripe.y);
      p.strokeWeight(6);
      p.stroke(colors2[p.floor(p.random(colors2.length))]);
      p.line(stripe.start, stripe.y, stripe.end, stripe.y);
    }
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