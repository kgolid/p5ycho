let sketch = function(p) {
  let size = 100;
  let dim = 4;

  let colors;
  p.setup = function() {
    p.createCanvas(900, 900);
    p.strokeWeight(2);
    p.fill(255, 100, 85);
    p.blendMode(p.DARKEST);
    p.frameRate(0.6);
    p.smooth();

    colors = [p.color(255, 135, 95), p.color(255, 135, 95), p.color(255, 225, 95), p.color(75, 215, 225)];

    let n = p.int(p.random(3, 6));
    let angle = p.PI * p.random(2);
    display();
  };

  let display = function() {
    for (var i = 0; i < dim; i++) {
      for (var j = 0; j < dim; j++) {
        p.fill(colors[p.floor(p.random(colors.length))]);
        let pos = p.createVector(p.width / dim * (i + 0.5), p.height / dim * (j + 0.5));
        draw_shape(pos);
      }
    }
  };

  let draw_shape = function(pos) {
    let n = p.int(p.random(3, 6));
    let angle = p.PI * p.random(2);

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(angle);
    p.push();
    draw_arcs(generate_string(n), create_initial_array(n));
    p.pop();
    p.rotate(p.PI);
    draw_arcs(generate_string(n), create_initial_array(n));
    p.pop();
  };

  p.draw = function() {
    p.clear();
    display();
  };

  let create_initial_array = function(n) {
    p.translate(-size / 2, 0);
    let arr = [];
    for (var i = 0; i <= n; i++) {
      var leaf = { pos: i * (size / n) };
      arr.push(leaf);
    }
    return arr;
  };

  let generate_string = function(n) {
    var arr = [];
    for (var i = 1; i <= n; i++) {
      arr.push(i);
    }
    return p.shuffle(arr);
  };

  let draw_arcs = function(rstring, poslist) {
    var totalHeight = 0;
    for (var i = 0; i < rstring.length; i++) {
      let area = rstring[i];
      let start = get_top(poslist[area - 1]);
      let end = get_top(poslist[area]);

      let center = (start.pos + end.pos) / 2;
      let diameter = end.pos - start.pos;
      let radius = diameter / 2;

      for (var j = 0; j < poslist.length; j++) {
        let top = get_top(poslist[j]);
        if (top != start && top != end) {
          p.line(top.pos, 0, top.pos, -radius);
        }
      }
      p.arc(center, 0, diameter, diameter, p.PI, p.TWO_PI);
      p.noStroke();
      p.rect(start.pos, -1, diameter, totalHeight + 2);
      p.stroke(35);
      p.translate(0, -radius);

      let new_point = { pos: center, parent: null };
      start.parent = new_point;
      end.parent = new_point;

      totalHeight += radius;
    }
  };

  let get_top = function(point) {
    if (point.parent != null) {
      return get_top(point.parent);
    }
    return point;
  };
};

new p5(sketch);
