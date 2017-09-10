let sketch = function(p) {
  let number_of_trees = 15;
  let trees = [];
  let radius = 400;
  let initial_boundary_size = 10;
  let number_of_tries = 10;
  let terminated = false;
  let colors;

  p.setup = function() {
    p.createCanvas(950,950);
    p.noStroke();
    p.fill(255,100,90);
    p.background("#252525");

    p.stroke(0);
    p.strokeWeight(2);
    colors = [
      p.color("#ce3830"),
      p.color("#1c8b94"),
      p.color("#de980f"),
      p.color("#d8d8be"),
      p.color("#454545")
    ];

    for (var i = 0; i < number_of_trees; i++) {
      let tree = [
        {
          pos: p.createVector(p.width / 2 + p.random(-200,200), p.height / 2 + p.random(-200,200)), 
          parent: 0,
          boundary: initial_boundary_size,
          exhausted: false
        }
      ];
      trees.push(tree);
    }
  }

  p.draw = function() {
    if (!terminated) {
      terminated = grow_all();
      trees.forEach(display);
    }
  }

  function grow_all () {
    return trees.map(grow).every((x)=>x);
  }

  function grow (tree) {
    //Breadth first
    for (var index = 0; index < tree.length; index++) {
    //Depth first
    //for (var index = tree.length-1; index >= 0; index--) {
      let current = tree[index];
      if(!current.exhausted) {
        let u = create_neighbour(current.pos, current.boundary);

        for (var t = 0; t < number_of_tries; t++) {
          let new_node = { pos: u, parent: index, boundary: current.boundary * 0.95, exhausted: current.boundary <= 3 }
          if (ok_position(new_node)) {
            if (p.random() < .3) current.exhausted = true;
            tree.push(new_node);
            return false;
          }
          u = create_neighbour(current.pos, current.boundary); 
        }
        current.exhausted = true;
      }
    }
    return true;
  }

  function display (tree, col) {
    let last_index = tree.length - 1;
    let v = tree[last_index];
    let u = tree[v.parent];

    p.stroke(colors[col % colors.length]);
    p.strokeWeight(.5 + v.boundary / 4);
    p.line(v.pos.x, v.pos.y, u.pos.x, u.pos.y);
  }

  function too_close_to_vertex (v,u) {
    return p5.Vector.dist(v.pos,u.pos) < p.max(v.boundary,u.boundary);
  }

  function too_close_to_trees (new_node) {
    return trees.some(function(tree) {
      return tree.some(function(t) {
        return too_close_to_vertex(new_node,t)})
    });
  }

  function outside_canvas (v) {
    return p.dist(v.x, v.y, p.width / 2, p.height / 2) > radius; 
  }

  function ok_position (node) {
    return !too_close_to_trees(node) && !outside_canvas(node.pos);
  }

  function create_neighbour (v, dist) {
    let r = p.random(p.TWO_PI);
    let x = v.x + (p.cos(r) * (dist + 1));
    let y = v.y + (p.sin(r) * (dist + 1));
    return p.createVector(x,y);
  }
  
  p.keyPressed = function () {
    if (p.keyCode === 80) {
      p.saveCanvas("roses", "jpeg");
    }
  }
}

new p5(sketch);
