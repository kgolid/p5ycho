let sketch = function(p) {
  let size = 300;
  let poslist = [];

  p.setup = function() {
    p.createCanvas(1200,800);
    p.strokeWeight(10);
    p.fill(255,100,85);
    p.blendMode(p.DARKEST);
    p.frameRate(1);

    let n = p.int(p.random(3,6));
    let angle = p.PI * p.random(2);
    display(n, angle);
  }

  let display = function(n, angle) {
    p.clear();
    p.translate(p.width/2, p.height/2);
    p.rotate(angle);
    p.push();
    init(n);
    draw_arcs(generate_string(n));
    p.pop();
    p.rotate(p.PI);
    init(n);
    draw_arcs(generate_string(n));

  }

  p.draw = function() {
    let n = p.int(p.random(3,6));
    let angle = p.PI * p.random(2);
    display(n, angle);
  }

  p.mousePressed = function() {
    let n = p.int(p.random(3,6));
    let angle = p.PI * p.random(2);
    display(n, angle);
  }

  let init = function(n) {
    p.translate(-size/2,0);
    poslist = [];
    for (var i = 0; i <= n; i++) {
      var leaf = {
        pos: i * (size / n),
        parent: null
      }
      poslist.push(leaf);
    }
  }

  let generate_string = function(n) {
    var arr = []
    for (var i = 1; i <= n; i++) {
      arr.push(i);
    }
    return p.shuffle(arr);
  }

  let draw_arcs = function(rstring) {
    var totalHeight = 0;
    for (var i = 0; i < rstring.length; i++) {
      let area = rstring[i];
      let start = get_top(poslist[area - 1]);
      let end = get_top(poslist[area]);

      let center = (start.pos + end.pos) / 2;
      let diameter = (end.pos - start.pos);
      let radius = diameter / 2;

      for (var j = 0; j < poslist.length; j++) {
        let top = get_top(poslist[j]);
        if(top != start && top != end){
          p.line(top.pos, 0, top.pos, -radius);
        }
      }
      p.arc(center, 0, diameter, diameter, p.PI, p.TWO_PI);
      p.noStroke();
      p.rect(start.pos, -1, diameter, totalHeight + 2);
      p.stroke(20);
      p.translate(0, -radius);

      let new_point = { pos: center, parent: null }
      start.parent = new_point;
      end.parent = new_point;

      totalHeight += radius;
    }
  }

  let get_top = function(point) {
    if (point.parent != null) {
      return get_top(point.parent);
    }
    return point;
  }

}

new p5(sketch);
