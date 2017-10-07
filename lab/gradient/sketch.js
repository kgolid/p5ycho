let sketch = function(p) {
  var resolution = 10;
  var gradient_collection = [];

  p.setup = function() {
    p.createCanvas(800, 800);
    p.colorMode(p.HSB);
    p.noLoop();
    p.noStroke();
  };
  p.draw = function() {
    p.scale(resolution);
    make_gradient(150, 250, 10, true, p.DARKEST);
    make_gradient(0, 50, 10, true, p.DARKEST);
  };

  function make_gradient(color_from, color_to, zoom, transparent, blend_mode) {
    for (var j = 0; j < p.height; j++) {
      for (var i = 0; i < p.width; i++) {
        //p.blend_mode(blend_mode);
        let value = p.noise(i / zoom, j / zoom);
        if (transparent) p.fill(p.map(value, 0, 1, color_from, color_to), 100, 100, value);
        else p.fill(p.map(value, 0, 1, color_from, color_to), 100, 100, 1);
        p.rect(i, j, 1, 1);
      }
    }
  }
};
new p5(sketch);
