let sketch = function(p) {
  let THE_SEED;

  let outer_dim, inner_dim;
  let rows;
  let block_back, block_front;

  let iul, iur, ill, ilr;
  let oul, our, oll, olr;

  let tick = 0;

  p.setup = function() {
    p.createCanvas(1300, 1000);
    p.rectMode(p.CORNERS);
    //p.noLoop();
    p.noStroke();
    //p.strokeWeight(2);

    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    inner_dim = 220;
    outer_dim = 800;

    rows = 24;

    block_back = inner_dim;
    block_front = p.map(inner_dim / outer_dim, 0, rows, inner_dim, outer_dim);

    iul = p.createVector(-inner_dim, -inner_dim);
    iur = p.createVector(inner_dim, -inner_dim);
    ill = p.createVector(-inner_dim, inner_dim);
    ilr = p.createVector(inner_dim, inner_dim);

    oul = p.createVector(-outer_dim, -outer_dim);
    our = p.createVector(outer_dim, -outer_dim);
    oll = p.createVector(-outer_dim, outer_dim);
    olr = p.createVector(outer_dim, outer_dim);
  };
  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, 0);
    for (var j = 0; j < rows; j++) {
      p.scale(block_front / block_back);
      for (var i = 0; i < rows / 2; i++) {
        display_column(i, j);
        display_column(rows - i - 1, j);
      }
    }
    tick++;
  };

  function display_column(i, j) {
    //let val = p.random(-0.1, 0.1);
    let val = p.map(p.noise(i / 20 + tick / 200, j / 8, tick / 150), 0, 1, -0.4, 0);

    let q1 = get_point(i, val, block_back);
    let q2 = get_point(i + 1, val, block_back);
    let q3 = get_point(i + 1, val, block_front);
    let q4 = get_point(i, val, block_front);

    if (q4.y < block_front + 180) {
      p.fill(236, 65, 38);
      p.beginShape();
      p.vertex(q1.x, q1.y);
      p.vertex(q4.x, q4.y);
      p.vertex(q4.x, block_front + 180);
      p.vertex(q1.x, block_back + 180);
      p.endShape(p.CLOSE);

      p.fill(236, 65, 38);
      p.beginShape();
      p.vertex(q2.x, q2.y);
      p.vertex(q3.x, q3.y);
      p.vertex(q3.x, block_front + 180);
      p.vertex(q2.x, block_back + 180);
      p.endShape(p.CLOSE);

      p.fill(255);
      p.beginShape();
      p.vertex(q1.x, q1.y);
      p.vertex(q2.x, q2.y);
      p.vertex(q3.x, q3.y);
      p.vertex(q4.x, q4.y);
      p.endShape(p.CLOSE);

      p.fill(236, 65, 38);
      p.rect(q4.x, q4.y, q3.x, block_front + 180);
    }
  }

  function get_point(xcol, yval, bound) {
    let x = p.map(xcol, 0, rows, -bound, bound);
    let y = p.map(yval, 0, 1, bound, -bound);
    return p.createVector(x, y);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
