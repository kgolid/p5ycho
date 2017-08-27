let sketch = function(p) {
  let number_of_lines = 20;
  let lines = [];
  let tick = 0;
  let radius = 50;
  p.setup = function() {
    let canvas = p.createCanvas(70,70);
    canvas.parent("logo-container");
    p.stroke(0,0,255);
    p.noFill();
    for (var i = 0; i < number_of_lines; i++) {
      let start = p.noise(i, tick) * p.PI * 10;
      let end = p.noise(i + number_of_lines, tick) * p.PI * 10;
      lines.push({start:start, end:end});
    }
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width/2, p.height/2);
    p.strokeWeight(4);
    p.ellipse(0,0,radius);
    display();
    update();
  }

  function display () {
    p.strokeWeight(1);
    lines.forEach(function(l) {
      p.line(
        p.cos(l.start) * radius/2, p.sin(l.start) * radius/2, 
        p.cos(l.end) * radius/2, p.sin(l.end) * radius/2
      );
    }, this);
  }

  function update () {
    for (var i = 0; i < number_of_lines; i++) {
      let start = p.noise(i, tick) * p.PI * 10;
      let end = p.noise(i + number_of_lines, tick) * p.PI * 10;
      lines[i] = {start:start, end:end};
    }
    tick += .0003;
  }
}

new p5(sketch);
