export default class {
  constructor(x, y, r, c_new, c_ext, c_vert, cols, symmetric, wh_ratio) {
    this.xdim = x;
    this.ydim = y;
    this.radius = r;
    this.chance_new = c_new;
    this.chance_extend = c_ext;
    this.chance_vertical = c_vert;
    this.colors = cols;
    this.symmetric = symmetric;
    this.wh_ratio = wh_ratio ? wh_ratio : 1;
  }

  generate() {
    this.main_color = get_random(this.colors);

    let grid = new Array(this.ydim + 1);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(this.xdim + 1);
      for (var j = 0; j < grid[i].length; j++) {
        if (i == 0 || j == 0) grid[i][j] = { h: false, v: false, in: false, col: null };
        else if (this.symmetric && j > grid.length / 2)
          grid[i][j] = {
            h: grid[i][grid.length - j].h,
            v: grid[i][grid.length - j + 1].v,
            in: grid[i][grid.length - j].in,
            col: grid[i][grid.length - j].col
          };
        else grid[i][j] = this.next_block(j, i, grid[i][j - 1], grid[i - 1][j]);
      }
    }

    return grid;
  }

  next_block(x, y, left, top) {
    const context = this;

    if (!left.in && !top.in) {
      return block_set_1(x, y);
    }

    if (left.in && !top.in) {
      if (left.h) return block_set_3(x, y);
      return block_set_2(x, y);
    }

    if (!left.in && top.in) {
      if (top.v) return block_set_5(x, y);
      return block_set_4(x, y);
    }

    if (left.in && top.in) {
      if (!left.h && !top.v) return block_set_6();
      if (left.h && !top.v) return block_set_7(x, y);
      if (!left.h && top.v) return block_set_8(x, y);
      return block_set_9(x, y);
    }

    // --- Block sets ----

    function block_set_1(x, y) {
      if (start_new_from_blank(x, y)) return new_block();
      return { v: false, h: false, in: false, col: null };
    }

    function block_set_2(x, y) {
      if (start_new_from_blank(x, y)) return new_block();
      return { v: true, h: false, in: false, col: null };
    }

    function block_set_3(x, y) {
      if (extend(x, y)) return { v: false, h: true, in: true, col: left.col };
      return block_set_2(x, y);
    }

    function block_set_4(x, y) {
      if (start_new_from_blank(x, y)) return new_block();
      return { v: false, h: true, in: false, col: null };
    }

    function block_set_5(x, y) {
      if (extend(x, y)) return { v: true, h: false, in: true, col: top.col };
      return block_set_4(x, y);
    }

    function block_set_6() {
      return { v: false, h: false, in: true, col: left.col };
    }

    function block_set_7(x, y) {
      if (extend(x, y)) return { v: false, h: true, in: true, col: left.col };
      if (start_new(x, y)) return new_block();
      return { v: true, h: true, in: false, col: null };
    }

    function block_set_8(x, y) {
      if (extend(x, y)) return { v: true, h: false, in: true, col: top.col };
      if (start_new(x, y)) return new_block();
      return { v: true, h: true, in: false, col: null };
    }

    function block_set_9(x, y) {
      //if (extend(x, y)) {
      if (vertical_dir()) return { v: true, h: false, in: true, col: top.col };
      return { v: false, h: true, in: true, col: left.col };
      //}
      //if (start_new(x, y)) return new_block();
      //return { v: true, h: true, in: false, col: null };
    }

    // ---- Blocks ----

    function new_block() {
      context.main_color = Math.random() > 0.85 ? get_random(context.colors) : context.main_color;
      return {
        v: true,
        h: true,
        in: true,
        col: context.main_color
      };
    }

    // ---- Decisions ----

    function start_new_from_blank(x, y) {
      if (!active_position(x, y, -0.2)) return false;
      return Math.random() <= context.chance_new / 10;
    }

    function start_new(x, y) {
      if (!active_position(x, y, -0.2)) return false;
      return Math.random() <= context.chance_new;
    }

    function extend(x, y) {
      if (!active_position(x, y, 0.2)) return false;
      return Math.random() <= context.chance_extend;
    }

    function vertical_dir() {
      return Math.random() <= context.chance_vertical;
    }

    function active_position(x, y, fuzzy) {
      let fuzziness = 1 + Math.random() * fuzzy;
      return (
        get_diagonal(
          x,
          context.ydim * ((1 - context.wh_ratio) / 2) + y * context.wh_ratio,
          context.xdim / 2,
          context.ydim / 2
        ) <
        context.radius * fuzziness
      );
    }
  }
}

// --- Utils ----
function get_diagonal(p1x, p1y, p2x, p2y) {
  return Math.sqrt(Math.pow(dist(p1x, p2x), 2) + Math.pow(dist(p1y, p2y), 2));
}

function dist(n, m) {
  return Math.max(n - m, m - n);
}

function get_random(array) {
  return array[Math.floor(Math.random() * array.length)];
}
