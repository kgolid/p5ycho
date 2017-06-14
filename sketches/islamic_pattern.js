let sketch = function(p) {
  let size = 400;
  let dim = 9;
  let t;
  let at;

  p.setup = function() {
    p.createCanvas(900,900);
    p.noStroke();
    p.frameRate(1);
  }

  p.draw = function() {
    p.clear();
    t = initial_array();
    let cur = {x:0,y:0,o:'u'};
    fill_cell(cur);
    at = get_unfilled_neighbors(cur).filter(hasHalo);
    while(at.length > 0) {
      step();
    }
    display();
  }

  let step = function() {
    let index = p.floor(p.random(at.length));
    let next = at[index];
    fill_cell(next);
    let next_neighbors = get_unfilled_neighbors(next);
    at.splice(index, 1);
    union(at, next_neighbors);
    at = at.filter(hasHalo);
  }

  let display = function() {
    p.translate(p.width/2, p.height/2);

    let w = (size / dim) * (p.sqrt(3 / 4));
    for(var r = 0; r < 3; r++) {
      p.push();
      p.rotate(r * (p.TWO_PI / 3));
      p.shearY(-p.PI / 6);
      for (var i = 0; i < dim; i++) {
        let x1 = w * i;
        let x2 = x1 + w;
        for (var j = 0; j < dim; j++) {
          let y1 = size / dim * j;
          let y2 = size / dim * (j + 1);
          p.fill(255, 0, 0, t[i][j]['u'] * 155);
          p.triangle(x1,y1, x2,y1, x2,y2);
          p.fill(255, 0, 0, t[i][j]['d'] * 155);
          p.triangle(x1,y1, x2,y2, x1,y2);
        }
      }
      p.pop();
    }
  }

  let initial_array = function() {
    let arr = [];
    for (var i = 0; i < dim; i++) {
      arr[i] = [];
      for (var j = 0; j < dim; j++) {
        if (j === dim-1 || i === dim-1 ) arr[i][j] = {u:1, d:1};
        else arr[i][j] = { u:0, d:0 };
      }
    }
    return arr;
  }

  let fill_cell = function(cell) {
    t[cell.x][cell.y][cell.o] = 1;
  }

  let get_unfilled_neighbors = function(c) {
    let ns = [];
    if (c.o === 'u') {
      if (t[c.x][c.y]['d'] === 0) ns.push({ x:c.x, y:c.y, o:'d' });
      if (c.x + 1 < dim && t[c.x+1][c.y]['d'] === 0) ns.push({ x:c.x+1, y:c.y, o:'d' });
      if (c.y - 1 >= 0  && t[c.x][c.y-1]['d'] === 0) ns.push({ x:c.x, y:c.y-1, o:'d' });
      if (c.y === 0 && t[0][c.x]['d'] === 0) ns.push({ x:0, y:c.x, o:'d' });
    }
    else {
      if (t[c.x][c.y]['u'] === 0) ns.push({x:c.x, y:c.y, o:'u'});
      if (c.x - 1 >= 0  && t[c.x-1][c.y]['u'] === 0) ns.push({ x:c.x-1, y:c.y, o:'u' });
      if (c.y + 1 < dim && t[c.x][c.y+1]['u'] === 0) ns.push({ x:c.x, y:c.y+1, o:'u' });
      if (c.x === 0 && t[c.y][0]['u'] === 0) ns.push({ x:c.y, y:0, o:'u' });
    }
    return ns;
  }

  let union = function(as,bs) {
    for(var b in bs) {
      var found = false;
      for(var a in as) {
        if(bs[b].x === as[a].x && bs[b].y === as[a].y && bs[b].o === as[a].o) {
          found = true;
        }
      }
      if (!found) as.push(bs[b]);
    }
  }

  let hasHalo = function(c) {
    return hasHalo1(c) || hasHalo2(c) || hasHalo3(c);
  }

  let hasHalo1 = function(c) {
    let halo1 = true;
    if (c.o === 'u') {
      if (c.x + 1 < dim) {
        if (t[c.x+1][c.y]['d'] === 1) halo1 = false;
        if (t[c.x+1][c.y]['u'] === 1) halo1 = false;
      }
      if (c.y > 0) {
        if (t[c.x][c.y-1]['d'] === 1) halo1 = false;
        if (t[c.x][c.y-1]['u'] === 1) halo1 = false;
      } else {
        if (t[0][c.x]['d'] === 1) halo1 = false;
        if (t[0][c.x]['u'] === 1) halo1 = false;
      }
      if (c.x + 1 < dim && c.y > 0) {
        if (t[c.x+1][c.y-1]['d'] === 1) halo1 = false;
      }
    }
    else if (c.o === 'd') {
      if (c.x > 0) {
        if (t[c.x-1][c.y]['d'] === 1) halo1 = false;
        if (t[c.x-1][c.y]['u'] === 1) halo1 = false;
      } else {
        if(t[c.y][0]['d'] === 1) halo1 = false;
        if(t[c.y][0]['u'] === 1) halo1 = false;
      }
      if (c.y + 1 < dim) {
        if (t[c.x][c.y+1]['d'] === 1) halo1 = false;
        if (t[c.x][c.y+1]['u'] === 1) halo1 = false;
      }
      if (c.x > 0 && c.y + 1 < dim) {
        if (t[c.x-1][c.y+1]['u'] === 1) halo1 = false;
      }
    }
    return halo1;
  }

  let hasHalo2 = function(c) {
    let halo1 = true;
    if (c.o === 'u') {
      if (t[c.x][c.y]['d'] === 1) halo1 = false;
      if (c.x > 0) {
        if (t[c.x-1][c.y]['u'] === 1) halo1 = false;
      } else {
        if (t[0][c.x]['u'] === 1) halo1 = false;
      }
      if (c.y > 0) {
        if (t[c.x][c.y-1]['d'] === 1) halo1 = false;
      } else {
        if (t[0][c.x]['d'] === 1) halo1 = false;
      }
      if (c.x > 0 && c.y > 0) {
        if (t[c.x-1][c.y-1]['d'] === 1) halo1 = false;
        if (t[c.x-1][c.y-1]['u'] === 1) halo1 = false;
      } else if (c.x == 0 && c.y > 0) {
        if (t[c.y-1][0]['d'] === 1) halo1 = false;
        if (t[c.y-1][0]['u'] === 1) halo1 = false;
      } else if (c.x > 0 && c.y == 0) {
        if (t[0][c.x-1]['d'] === 1) halo1 = false;
        if (t[0][c.x-1]['u'] === 1) halo1 = false;
      }
    }
    else if (c.o === 'd') {
      if (t[c.x][c.y]['u'] === 1) halo1 = false;
      if (c.x + 1 < dim) {
        if (t[c.x+1][c.y]['d'] === 1) halo1 = false;
      }
      if (c.y + 1 < dim) {
        if (t[c.x][c.y+1]['u'] === 1) halo1 = false;
      }
      if (c.x + 1 < dim && c.y + 1 < dim) {
        if (t[c.x+1][c.y+1]['d'] === 1) halo1 = false;
        if (t[c.x+1][c.y+1]['u'] === 1) halo1 = false;
      }
    }
    return halo1;
  }

  let hasHalo3 = function(c) {
    let halo1 = true;
    if (c.o === 'u') {
      if (t[c.x][c.y]['d'] === 1) halo1 = false;
      if (c.x + 1 < dim) {
        if (t[c.x+1][c.y]['d'] === 1) halo1 = false;
      }
      if (c.y + 1 < dim) {
        if (t[c.x][c.y+1]['u'] === 1) halo1 = false;
      }
      if (c.x + 1 < dim && c.y + 1 < dim) {
        if (t[c.x+1][c.y+1]['d'] === 1) halo1 = false;
        if (t[c.x+1][c.y+1]['u'] === 1) halo1 = false;
      }
    }
    else if (c.o === 'd') {
      if (t[c.x][c.y]['u'] === 1) halo1 = false;
      if (c.x > 0) {
        if (t[c.x-1][c.y]['u'] === 1) halo1 = false;
      } else {
        if (t[c.y][0]['u'] === 1) halo1 = false;
      }
      if (c.y > 0) {
        if (t[c.x][c.y-1]['d'] === 1) halo1 = false;
      } else {
        if (t[c.y][0]['d'] === 1) halo1 = false;
      }
      if (c.x > 0 && c.y > 0) {
        if (t[c.x-1][c.y-1]['d'] === 1) halo1 = false;
        if (t[c.x-1][c.y-1]['u'] === 1) halo1 = false;
      } else if (c.x == 0 && c.y > 0) {
        if (t[c.y-1][0]['d'] === 1) halo1 = false;
        if (t[c.y-1][0]['u'] === 1) halo1 = false;
      } else if (c.x > 0 && c.y == 0) {
        if (t[0][c.x-1]['d'] === 1) halo1 = false;
        if (t[0][c.x-1]['u'] === 1) halo1 = false;
      }
    }
    return halo1;
  }

}

new p5(sketch);
