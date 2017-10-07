let sketch = function(p) {

  let da = 1.0;
  let db = 0.5;
  let f = 0.0367;
  let k = 0.0649;
  let t = 1.1;

  let grid = [];
  let prev = [];

  p.setup = function() {
    p.createCanvas(200,200);
    p.pixelDensity(1);

    for(let i = 0; i < p.width; i++) {
      grid[i] = [];
      for(let j = 0; j < p.height; j++) {
        grid[i][j] = { a:1, b:0 };
      }
    }

    for (let i = 0; i < p.width; i++) {
      for (let j = 0; j < p.height; j++) {
        let r1 = p.sqrt(p.sq(i-90) + p.sq(j-90));
        let r2 = p.sqrt(p.sq(i-100) + p.sq(j-100));
        if(r1 < 5 || r2 < 5)
          grid[i][j] = { a:0, b:1 };
      }
    }
  }

  p.draw = function() {
    update();
    display();
  }

  let update = function() {
    p.arrayCopy(grid,prev);
    for (let x = 1; x < p.width-1; x++) {
      for (let y = 1; y < p.height-1; y++) {
        grid[x][y] = update_cell(x,y);
      }
    }
  }

  let update_cell = function(x,y) {
    let a = prev[x][y].a;
    let b = prev[x][y].b;

    let an = a + (da * laplacian(x,y,"a") - (a * b * b) + f * (1 - a)) * t;
    let bn = b + (db * laplacian(x,y,"b") + (a * b * b) - (k + f) * b) * t;

    return {a:an, b:bn}
  }

  let laplacian = function(x,y,s) {
    var sum = 0;

    sum += prev[x][y][s] * -1;
    sum += prev[x-1][y][s] * 0.2;
    sum += prev[x+1][y][s] * 0.2;
    sum += prev[x][y-1][s] * 0.2;
    sum += prev[x][y+1][s] * 0.2;
    sum += prev[x-1][y-1][s] * 0.05;
    sum += prev[x-1][y+1][s] * 0.05;
    sum += prev[x+1][y-1][s] * 0.05;
    sum += prev[x+1][y+1][s] * 0.05;

    return sum;
  }

  let display = function() {
    p.loadPixels();
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let pix = (x + y * p.width) * 4;
        let c = p.floor((grid[x][y].a - grid[x][y].b) * 255)
        c = p.constrain(c, 0, 255)
        p.pixels[pix + 0] = 255;
        p.pixels[pix + 1] = 240;
        p.pixels[pix + 2] = 230;
        p.pixels[pix + 3] = 255 - c;
      }
    }
    p.updatePixels();
  }
}

new p5(sketch);
