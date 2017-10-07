var sketch = function (p) {

  var graph;
  var number_of_nodes = 100;

  p.setup = function () {
    p.createCanvas(1000,800);
    p.stroke(255,255,255);
    p.noFill();
    p.strokeWeight(2);

    graph = new Graph(number_of_nodes);
    graph.createNodes();
    graph.createEdges();
  }

  p.draw = function () {
    p.clear();
    graph.display();
    graph.update();
  }

  function Graph(num) {
    this.number_of_nodes = num;
    this.nodes = [];
    this.edges = [];

    this.createNodes = function () {
      for (var i = 0; i < this.number_of_nodes; i++)
        this.nodes.push(new Node( new p5.Vector(p.random(50, p.width-50), p.random(50, p.height-50)), this.nodes ) );
    }

    this.createEdges = function () {
      for (var i = 0; i < this.nodes.length; i++) {
        for (var j = 0; j < this.nodes.length; j++) {
          if (i != j)
            this.edges.push( new Edge(this.nodes[i], this.nodes[j]) );
        }
      }
    }

    this.update = function () {
      for (var n in this.nodes)
        this.nodes[n].update();
    }

    this.display = function () {
      for (var e in this.edges)
        this.edges[e].display();
    }
  }

  function Edge(n1, n2) {
    this.n1 = n1;
    this.n2 = n2;

    this.display = function () {
      if (this.n1.loc.dist(this.n2.loc) < 45) {
        p.stroke(0,95);
        p.line(this.n1.loc.x, this.n1.loc.y, this.n2.loc.x, this.n2.loc.y);
      } else if (this.n1.loc.dist(this.n2.loc) < 100) {
        p.stroke(0,10);
        p.line(this.n1.loc.x, this.n1.loc.y, this.n2.loc.x, this.n2.loc.y);
      }
    }
  }

  function Node(loc, nodes) {
    this.loc = loc;
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, 0);

    this.nodes = nodes;

    this.update = function () {
      this.calculate_acceleration();

      this.vel.add(this.acc);
      this.loc.add(this.vel);
    }

    this.calculate_acceleration = function () {
      this.accelerate_towards_nearby_nodes(0.2, 100);
      this.not_too_close(2, 40);
      this.accelerate_away_from_edge(1);
      this.add_friction(0.1);

      this.acc.div(50);
    }

    this.accelerate_towards_nearby_nodes = function ( weight, distance ) {
      var dir = new p5.Vector(0, 0);
      for (var n in this.nodes) {
        if (this.nodes[n] != this && this.loc.dist(this.nodes[n].loc) < distance )
          dir.add( this.get_direction(this.nodes[n].loc) );
      }
      dir.normalize();
      dir.mult(weight);
      this.acc.add( dir );
    }

    this.not_too_close = function ( weight, distance ) {
      var dir = new p5.Vector(0, 0);
      for (var n in this.nodes) {
        if (this.nodes[n] != this && this.loc.dist(this.nodes[n].loc) < distance )
          dir.add( this.get_direction(this.nodes[n].loc) );
      }
      dir.normalize();
      dir.mult(-weight);
      this.acc.add( dir );
    }

    this.accelerate_away_from_edge = function ( weight ) {
      var center = new p5.Vector(p.width/2, p.height/2);
      if ( this.loc.dist(center) > 400 ) {
        var dir = this.get_direction(center);
        dir.mult(weight);
        this.acc.add( dir );
      }
    }

    this.add_friction = function ( weight ) {
      var friction = new p5.Vector(this.vel.x, this.vel.y);
      friction.normalize();
      friction.mult(-1);
      friction.mult(weight);
      this.acc.add(friction);
    }

    this.get_direction = function( loc ) {
      var dir = p5.Vector.sub(loc, this.loc);
      dir.normalize();
      return dir;
    }
  }
}

new p5(sketch);
