let sketch = function(p) {
  let pattern_height = 10;
  let pattern_width = 10;
  let atom_dim = 20;
  let space_dim = 25;
  let density = .5;

  let horizontals = [];
  let verticals = [];

  let density_slider;
  let width_slider, height_slider;
  let atom_slider, space_slider;

  p.setup = function() {
    let canvas = p.createCanvas(800,800);
    canvas.parent("sketch");
    p.fill(0);
    p.noStroke();
    p.frameRate(1);
    //p.noLoop();

    setup_controllers();
  }

  p.draw = function() {
    update_variables();
    p.clear();
    p.translate(p.width/2 - (atom_dim+space_dim)*pattern_width /2, p.height/2 - (atom_dim+space_dim)*pattern_height/2);
    for (let y = 0; y < pattern_height; y++) {
      p.push();
      for (let x = 0; x < pattern_width; x++) {
        p.rect(0,0,atom_dim,atom_dim);
        if (x < pattern_width-1 && p.random() < density) 
          p.rect(0, 0, atom_dim + space_dim, atom_dim); 
        if (y < pattern_height-1 && p.random() < density) 
          p.rect(0, 0, atom_dim, space_dim + atom_dim); 

        p.translate(atom_dim + space_dim,0);
      }
      p.pop();
      p.translate(0, atom_dim + space_dim);
    }
  }

  function setup_controllers () {
    let density_container = p.createDiv("density ").parent("ctrl");
    let width_container = p.createDiv("width ").parent("ctrl");
    let height_container = p.createDiv("height ").parent("ctrl");
    let atom_container = p.createDiv("square size ").parent("ctrl");
    let space_container = p.createDiv("space size ").parent("ctrl");

    density_slider = p.createSlider(0, 100, 50).parent(density_container);
    width_slider = p.createSlider(3, 15, 10).parent(width_container);
    height_slider = p.createSlider(3, 15, 10).parent(height_container);
    atom_slider = p.createSlider(1, 30, 20).parent(atom_container);
    space_slider = p.createSlider(1, 30, 25).parent(space_container);

    update_variables();
  }

  function update_variables () {
    density = p.constrain(density_slider.value()/100, 0, 1);
    pattern_width = p.constrain(width_slider.value(), 3, 12);
    pattern_height = p.constrain(height_slider.value(), 3, 12);
    atom_dim = p.constrain(atom_slider.value(), 1, 30);
    space_dim = p.constrain(space_slider.value(), 1, 30);
  }
}

new p5(sketch);
