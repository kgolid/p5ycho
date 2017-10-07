let sketch = function(p) {
  let number_of_trees = 45;
  let columns = 9;
  let trees = [];
  let radius = 400;
  let initial_boundary_size = 6;
  let number_of_tries = 7;
  let terminated = false;
  let colors;

  p.setup = function() {
    p.createCanvas(1000, 1000);
    p.noStroke();
    p.fill(255, 100, 90);
    p.background('#252525');

    p.stroke(0);
    p.strokeWeight(1);
    colors = [p.color('#ce3830'), p.color('#1c8b94'), p.color('#de980f'), p.color('#d8d8be'), p.color('#454545')];

    for (var i = 0; i < number_of_trees; i++) {
      let tree = [
        {
          pos: p.createVector(
            (i % columns + 0.5) * (p.width / columns),
            p.floor(i / columns + 1) * (p.height / columns)
          ),
          dir: -p.PI / 2,
          parent: 0,
          boundary: initial_boundary_size,
          exhausted: false
        }
      ];
      trees.push(tree);
    }
  };

  p.draw = function() {
    if (!terminated) {
      terminated = grow_all();
      trees.forEach(display);
    }
  };

  function grow_all() {
    return trees.map(grow).every(x => x);
  }

  function grow(tree) {
    //Breadth first
    for (var index = 0; index < tree.length; index++) {
      //Depth first
      //for (var index = tree.length-1; index >= 0; index--) {
      let current = tree[index];
      if (!current.exhausted) {
        let dir = p.randomGaussian(current.dir - 0.5, p.PI / 5);
        let u = create_neighbour(current.pos, dir, current.boundary);

        for (var t = 0; t < number_of_tries; t++) {
          let new_node = {
            pos: u,
            dir: dir,
            parent: index,
            boundary: current.boundary,
            exhausted: current.boundary <= 3
          };
          if (ok_position(new_node)) {
            tree.push(new_node);
            return false;
          }
          dir = dir = p.randomGaussian(current.dir - 0.5, p.PI / 5);
          u = create_neighbour(current.pos, current.dir, current.boundary);
        }
        current.exhausted = true;
      }
    }
    return true;
  }

  function display(tree, col) {
    let last_index = tree.length - 1;
    let v = tree[last_index];
    let u = tree[v.parent];

    p.stroke(colors[col % colors.length]);
    p.line(v.pos.x, v.pos.y, u.pos.x, u.pos.y);
  }

  function too_close_to_vertex(v, u) {
    return p5.Vector.dist(v.pos, u.pos) < p.max(v.boundary, u.boundary);
  }

  function too_close_to_trees(new_node) {
    return trees.some(function(tree) {
      return tree.some(function(t) {
        return too_close_to_vertex(new_node, t);
      });
    });
  }
  function inside_canvas(v) {
    return v.x > 0 && v.x < p.width && v.y > 0 && v.y < p.height;
  }

  function ok_position(node) {
    return !too_close_to_trees(node) && inside_canvas(node.pos);
  }

  function create_neighbour(v, dir, dist) {
    let x = v.x + p.cos(dir) * (dist + 1);
    let y = v.y + p.sin(dir) * (dist + 1);
    return p.createVector(x, y);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('roses', 'jpeg');
    }
  };
};

new p5(sketch);
