let sketch = function(p) {
  let rows = 20;
  let radius = 260;
  let min_length = 15;
  let max_length = 85;
  let space = 25;
  let stripes = [];
  let colors;

  p.setup = function() {
    p.createCanvas(850,850);
    p.stroke(255);
    p.strokeWeight(14);
    p.noLoop();

    colors = [
      p.color(142,192,124),
      p.color(250,189,47),
      p.color(251,71,44),
      p.color(211,134,147),
      p.color(49,69,80)
    ];

    for (var i = 0; i < rows; i++) {
      let ypos = ((i + .5)/rows) * (radius * 2) - radius;
      let row_length = 2 * p.sqrt((radius * radius) - (ypos * ypos));
      add_stripe_row(ypos, row_length);
      console.log(stripes);
      
    }
  }

  p.draw = function() {
    p.translate(p.width / 2, p.height / 2);
    for (var s in stripes) {
      var stripe = stripes[s];
      p.stroke(colors[p.floor(p.random(5))]);
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
}

new p5(sketch);
