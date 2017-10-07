let sketch = function(p) {
  let xdim = 1;
  let ydim = 1;
  let size = 25;

  let vseps;
  let hseps;

  p.setup = function() {
    p.createCanvas(1380,900);
    p.frameRate(4);
    p.noLoop();
    p.background(230,255,172);
    p.noFill();
  }

  p.draw = function() {
    p.clear();
    p.translate(40,40);
    for (var i = 0; i < 5; i++) {
      p.push();
      for (var j = 0; j < 7; j++) {
        generate_grid(xdim + j, ydim + i);

        p.strokeWeight(8);
        p.stroke(84,85,115);
        display(xdim + j, ydim + i);
        p.strokeWeight(4);
        p.stroke(230,255,172);
        display(xdim + j, ydim + i);

        p.translate(120 + (j * size), 0);
      }
      p.pop();
      p.translate(0, 120 + (i * size));
    }
  }

  function generate_grid(xd,yd) {
    vseps = new Array(yd);
    hseps = new Array(yd - 1);

    for (var i = 0; i < yd; i++) {
      vseps[i] = new Array(xd - 1);
      vseps[i].fill(-1);
    }

    vseps[0] = randomly_fill_remaining_vseps(vseps[0]);

    for (var i = 0; i < yd - 1; i++) {
      hseps[i] = genereate_hseps(vseps[i], new Array(xd));
      vseps[i + 1] = fill_forced_vseps(hseps[i], vseps[i], vseps[i + 1]);
      vseps[i + 1] = randomly_fill_remaining_vseps(vseps[i + 1]);
    }
  }

  function display(xd,yd) {
    p.push();
    p.rect(0,0,xd * size, yd * size);

    for (var j = 1; j < xd; j++) {
      if (vseps[0][j-1] === 1) p.line(j * size, 0, j * size, size);
    }  

    for (var i = 0; i < yd - 1; i++) {
      p.translate(0, size);
      if (hseps[i][0] === 1) p.line(0, 0, size, 0);
      for (var j = 1; j < xd; j++) {
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
    return p.random() < .6 ? 0:1
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
