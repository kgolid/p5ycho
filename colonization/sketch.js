let sketch = function(p) {
  let THE_SEED;
  let number_of_sources = 200;
  let padding = 50;

  let kill_range = 15;
  let growth = 5;

  let cluster_spread = 100;
  let cluster_size = 2000;

  let nodes;
  let sources;

  p.setup = function() {
    p.createCanvas(1000, 1000);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.fill(255);
    //p.frameRate(2);
    p.stroke(50);
    p.strokeWeight(2);

    generate_sources();
    generate_root_node_on_circumference();
  };

  p.draw = function() {
    p.clear();
    update();
    display();
  };

  function display() {
    //sources.forEach(src => src.display());
    nodes.forEach(node => node.display());
  }

  function update() {
    for (let i = 0; i < sources.length; i++) {
      if (sources[i].alive) {
        let closest_node = find_closest_node(sources[i]);
        if (closest_node.pos.dist(sources[i].pos) < kill_range) sources[i].kill();
        closest_node.neighbors.push(sources[i]);
      }
    }

    let new_nodes = [];
    for (let n in nodes) {
      let node = nodes[n];
      if (node.neighbors.length > 0) {
        let dir = node.get_mean_dir();
        new_nodes.push(new Node(node.pos.x + dir.x * growth, node.pos.y + dir.y * growth, node.pos));
        node.neighbors = [];
      }
    }
    nodes = nodes.concat(new_nodes);
  }

  function generate_sources() {
    sources = [];
    for (let i = 0; i < cluster_size; i++) {
      //sources.push(new Source(p.random(padding, p.width - padding), p.random(padding, p.height - padding)));
      sources.push(
        new Source(p.randomGaussian(p.width / 2, cluster_spread), p.randomGaussian(p.height / 2, cluster_spread))
      );
    }
  }

  function generate_root_node() {
    nodes = [];
    for (let i = 0; i < 5; i++) {
      let xpos = p.random(0, p.width);
      let ypos = p.random(0, p.height);
      nodes.push(new Node(xpos, ypos, xpos, ypos));
    }
  }

  function generate_root_node_on_circumference() {
    nodes = [];
    for (let i = 0; i < 3; i++) {
      let angle = p.random(p.TAU);
      nodes.push(
        new Node(
          p.width / 2 + p.cos(angle) * 300,
          p.height / 2 + p.sin(angle) * 300,
          p.width / 2 + p.cos(angle) * 300,
          p.height / 2 + p.sin(angle) * 300
        )
      );
    }
  }

  function find_closest_node(source) {
    return nodes.reduce((acc, curr) => (acc.pos.dist(source.pos) < curr.pos.dist(source.pos) ? acc : curr));
  }

  class Source {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.alive = true;
    }

    kill() {
      this.alive = false;
    }

    display() {
      p.noStroke();
      p.fill(255, 0, 0);
      if (this.alive) {
        p.ellipse(this.pos.x, this.pos.y, 4, 4);
      }
    }
  }

  class Node {
    constructor(x, y, parent) {
      this.pos = p.createVector(x + p.randomGaussian(0, 1.5), y + p.randomGaussian(0, 1.5));
      this.parent_pos = parent;
      this.neighbors = [];
    }

    get_mean_dir() {
      let normalized = this.neighbors.map(n => p5.Vector.sub(n.pos, this.pos).normalize());
      return normalized.reduce((acc, curr) => p5.Vector.add(acc, curr)).normalize();
    }

    display() {
      p.stroke(50);
      p.line(this.parent_pos.x, this.parent_pos.y, this.pos.x, this.pos.y);
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
