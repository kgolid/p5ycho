let sketch = function(p) {
  let THE_SEED;

  let width = 120;

  let resolution = 60;

  let noise_zoom = 90;
  let magnitude = 120;

  let plate_padding = 0;

  let number_of_blocks = 70;
  let blocks = [];

  let palette;

  p.setup = function() {
    p.createCanvas(1200, 1800);
    p.noLoop();

    p.strokeWeight(1);

    palette = [
      p.color(145, 172, 183),
      p.color(182, 32, 36),
      p.color(155, 80, 43),
      p.color(81, 82, 111),
      p.color(201, 179, 171),
      p.color(221, 226, 222)
    ];

    THE_SEED = p.floor(p.random(9999999));
    p.noiseSeed(THE_SEED);

    for (var i = 0; i < number_of_blocks; i++) {
      blocks.push(create_block(p.random(1, 10), i));
    }
  };

  p.draw = function() {
    p.background('#e0e1db');
    let current_height = 0;
    p.translate(65, p.height - 65);
    blocks.forEach(function(block, index) {
      let block_height = p.abs(Math.min(...block[block.length - 1].points) - 60);

      if (current_height + block_height < p.height - 200) {
        display_block(block, index);
        p.translate(0, -block_height);
        current_height += block_height;
      } else {
        p.translate(190, current_height);
        display_block(block, index);
        p.translate(0, -block_height);
        current_height = block_height;
      }
    }, this);
  };

  function create_block(number_of_plates, block_index) {
    let plates = [];
    for (var plate_index = 0; plate_index < number_of_plates; plate_index++) {
      let points = [];

      let plate_height = p.randomGaussian(0, 10);
      if (plate_index > 0) {
        for (let i = 0; i <= resolution; i++) {
          points.push(
            p.min(-plate_padding, get_noise(i, plate_index, block_index) - plate_height) +
              plates[plate_index - 1].points[i]
          );
        }
      } else {
        for (let i = 0; i <= resolution; i++) {
          points.push(p.min(-plate_padding, get_noise(i, plate_index, block_index) - plate_height));
        }
      }

      plates.push({
        points: points,
        color: palette[p.floor(p.random(palette.length))]
      });
    }
    return plates;
  }

  function display_block(block, block_index) {
    block.forEach(function(plate, index) {
      p.fill(plate.color);
      p.beginShape();
      if (index === 0) {
        p.vertex(0, 0);
        p.vertex(width, 0);
      } else {
        for (let i = 0; i <= resolution; i++) {
          p.vertex(i * width / resolution, block[index - 1].points[i] - plate_padding);
        }
      }
      for (let i = resolution; i >= 0; i--) {
        p.vertex(i * width / resolution, block[index].points[i]);
      }
      p.endShape(p.CLOSE);
    }, this);
  }

  function get_noise(x, y, z) {
    return -magnitude * (p.noise(x / noise_zoom, y, z) - 0.4);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('tectonic_' + THE_SEED, 'png');
  };
};
new p5(sketch);
