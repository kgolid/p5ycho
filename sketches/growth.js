let sketch = function(p) {
  let tree = [];
  let boundary_size = 6;
  let number_of_tries = 10;
  let terminated = false;

  p.setup = function() {
    p.createCanvas(850,850);
    p.noStroke();
    p.fill(255,100,90);
    p.ellipse(p.width/2, p.height/2, 500, 500);

    p.stroke(0);
    p.strokeWeight(1);

    tree.push(
      {
        pos: p.createVector(p.width / 2, p.height / 2), 
        parent: 0,
        exhausted: false
      }
    )
  }

  p.draw = function() {
    if (!terminated) {
      terminated = grow();
      display();
    }
  }

  function grow () {
    //Breadth first
    //for (var index = 0; index < tree.length; index++) {
    //Depth first
    for (var index = tree.length-1; index >= 0; index--) {
      let current = tree[index];
      if(!current.exhausted) {
        let u = create_neighbour(current.pos);

        for (var t = 0; t < number_of_tries; t++) {
          if (ok_position(u)) {
            if (p.random() < .4) current.exhausted = true;
            tree.push({ pos: u, parent: index, exhausted: p.random() < .15 });
            return false;
          }
          u = create_neighbour(current.pos); 
        }
        current.exhausted = true;
      }
    }
    return true;
  }

  function display () {
    let last_index = tree.length - 1;
    let v = tree[last_index];
    let u = tree[v.parent];
    p.line(v.pos.x, v.pos.y, u.pos.x, u.pos.y);
  }

  function too_close_to_vertex (v,u) {
    return p5.Vector.dist(v,u) < boundary_size;
  }

  function too_close_to_tree (v) {
    for (let t in tree) {
      if (too_close_to_vertex(v,tree[t].pos)) return true;
    }
    return false;
  }

  function outside_canvas (v) {
    return p.dist(v.x, v.y, p.width / 2, p.height / 2) > 300; 
  }

  function ok_position (v) {
    return !too_close_to_tree(v) && !outside_canvas(v);
  }

  function create_neighbour (v) {
    let r = p.random(p.TWO_PI);
    let x = v.x + (p.cos(r) * (boundary_size + 1));
    let y = v.y + (p.sin(r) * (boundary_size + 1));
    return p.createVector(x,y);
  }
}

new p5(sketch);
