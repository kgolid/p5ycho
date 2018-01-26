let sketch = function(p) {
  let THE_SEED;
  let padding = 16;
  let cutoff = 72;
  let palette;

  p.setup = function() {
    p.createCanvas(600, 600);
    p.frameRate(2);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.background('#ebebe4');
    p.strokeWeight(4);

    p.rectMode(p.CORNERS);

    palette = [
      p.color('#dd6853'),
      p.color('#0aa2c0'),
      p.color('#e88b17'),
      p.color('#f7e868'),
      p.color('#87c6be'),
      p.color('#7d6b9f'),
      p.color('#f7f7f7')
    ];
  };

  p.draw = function() {
    p.background('#ebebe4');
    let w = p.random(250, 400);
    let h = p.random(250, 400);
    p.translate(p.width / 2, p.height / 2);
    draw_block(p.createVector(-w / 2, -h / 2), p.createVector(w / 2, h / 2));
  };

  function draw_section(v1, v2) {
    if (v2.x - v1.x < cutoff || v2.y - v1.y < cutoff) {
      draw_block(v1, v2);
      return;
    }
    let decide = p.random();

    if (decide < 0.5) {
      draw_block(v1, v2);
    } else if (decide < 0.95) {
      split_section(v1, v2);
    } else {
      //NOTHING, FOR NOW...
    }
  }

  function draw_block(v1, v2) {
    if (v2.x - v1.x < cutoff || v2.y - v1.y < cutoff) {
      draw_rectangle(v1, v2);
      return;
    }
    let decide = p.random();

    if (decide < 0.4) {
      draw_rectangle(v1, v2);
      draw_section(p.createVector(v1.x + padding, v1.y + padding), p.createVector(v2.x - padding, v2.y - padding));
    } else if (decide < 0.95) {
      split_block(v1, v2);
    } else {
      draw_rectangle(v1, v2);
    }
  }

  function split_section(v1, v2) {
    let cut_dir = get_cut_direction(v1, v2);
    if (cut_dir == 'H') {
      let pivot = get_cut_pos(v1.y, v2.y);
      draw_section(v1, p.createVector(v2.x, pivot - padding / 2));
      draw_section(p.createVector(v1.x, pivot + padding / 2), v2);
    } else {
      let pivot = get_cut_pos(v1.x, v2.x);
      draw_section(v1, p.createVector(pivot - padding / 2, v2.y));
      draw_section(p.createVector(pivot + padding / 2, v1.y), v2);
    }
  }

  function split_block(v1, v2) {
    let cut_dir = get_cut_direction(v1, v2);
    if (cut_dir == 'H') {
      let pivot = get_cut_pos(v1.y, v2.y);
      draw_block(v1, p.createVector(v2.x, pivot));
      draw_block(p.createVector(v1.x, pivot), v2);
    } else {
      let pivot = get_cut_pos(v1.x, v2.x);
      draw_block(v1, p.createVector(pivot, v2.y));
      draw_block(p.createVector(pivot, v1.y), v2);
    }
  }

  function draw_rectangle(v1, v2) {
    p.fill(palette[p.floor(p.random(palette.length))]);
    p.rect(v1.x, v1.y, v2.x, v2.y);
  }

  function get_cut_direction(v1, v2) {
    return v2.x - v1.x < v2.y - v1.y ? 'H' : 'V';
  }

  function get_cut_pos(p1, p2) {
    return p.constrain(p.randomGaussian((p1 + p2) / 2, (p2 - p1) / 8), p1 + 20, p2 - 20);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
