let sketch = function(p) {
  let xdim = 4;
  let ydim = 3;
  let size = 20;

  let vseps;
  let hseps;

  p.setup = function() {
    p.createCanvas(1000,800);
    p.frameRate(1);
    p.background(230,255,172);
    p.fill(84,85,115);
    p.stroke(230,255,172);
    p.strokeWeight(2);
  }

  p.draw = function() {
    p.translate(40,40);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 5; j++) {
        generate_grid();
        display();
        p.translate(200, 0);
      }
      p.translate(-200 * 5, 200);
    }
  }

  function generate_grid() {
    vseps = new Array(ydim);
    hseps = new Array(ydim - 1);

    for (var i = 0; i < ydim; i++) {
      vseps[i] = new Array(xdim - 1);
      vseps[i].fill(-1);
    }

    vseps[0] = randomly_fill_remaining_vseps(vseps[0]);

    for (var i = 0; i < ydim - 1; i++) {
      hseps[i] = genereate_hseps(vseps[i], new Array(xdim));
      vseps[i + 1] = fill_forced_vseps(hseps[i], vseps[i], vseps[i + 1]);
      vseps[i + 1] = randomly_fill_remaining_vseps(vseps[i + 1]);
    }
  }

  function display() {
    p.push();
    p.rect(0,0,xdim * size, ydim * size);

    for (var j = 1; j < xdim; j++) {
        if (vseps[0][j-1] === 1) p.line(j * size, 0, j * size, size);
      }  

    for (var i = 0; i < ydim - 1; i++) {
      p.translate(0, size);
      if (hseps[i][0] === 1) p.line(0, 0, size, 0);
      for (var j = 1; j < xdim; j++) {
        if (vseps[i+1][j-1] === 1) p.line(j * size, 0, j * size, size);
        if (hseps[i][j] === 1)   p.line(j * size, 0, (j+1) * size, 0)
      }    
    }
    p.pop()
  }

  function randomly_fill_remaining_vseps(arr) {
    for (var i in arr) {
      if(arr[i] === -1) {
        arr[i] = flip_coin();
      }
    };
    return arr;
  }

  function genereate_hseps(vsep, arr) {
    arr[0] = flip_coin();
    for (var i = 1; i < arr.length; i++) {
      arr[i] = (vsep[i - 1] === 0) ? arr[i - 1] : flip_coin();
    }
    return arr;
  }

  function fill_forced_vseps(hsep, last_vsep, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (hsep[i] != hsep[i + 1]) {
        arr[i] = 1;
      } else if (hsep[i] === 0 && hsep[i + 1] === 0) {
        arr[i] = last_vsep[i];
      }
    }
    return arr;
  }

  function flip_coin() {
    return p.random() < .5 ? 0:1
  }





  function display_ascii() {     
    for (var r = 0; r < ydim - 1; r++) {
      var s = "|";
      if (hseps[r][0] === 1) s += "__";
      else s += "  ";

      for (var i = 0; i < xdim - 1; i++) {
        if (vseps[r][i] === 1) s += "|";
        else s += " ";
        if (hseps[r][i + 1] === 1) s += "__";
        else s +=  "  ";
      }
      s += "|";

      console.log(s);
    }

    var s = "|__";

    for (var i = 0; i < xdim-1; i++) {
      if (vseps[ydim - 1][i] === 1) s += "|";
      else s += " ";
      s +=  "__";
    }
    s += "|"

    console.log(s);
  }
}

new p5(sketch);
