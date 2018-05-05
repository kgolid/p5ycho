export default class {
  constructor(x, y, r, c_new, c_ext, c_vert, cols) {
    this.grid_dim_x = x;
    this.grid_dim_y = y;
    this.radius = r;
    this.chance_new = c_new;
    this.chance_extend = c_ext;
    this.chance_vertical = c_vert;
    this.colors = cols;
  }

  generate() {
    let grid = new Array(this.grid_dim_y + 1);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(this.grid_dim_x + 1);
      for (var j = 0; j < grid[i].length; j++) {
        if (i == 0 || j == 0) grid[i][j] = { h: false, v: false, in: false, col: null };
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
      if (extend(x, y)) {
        if (vertical_dir()) return { v: true, h: false, in: true, col: top.col };
        return { v: false, h: true, in: true, col: left.col };
      }
      if (start_new(x, y)) return new_block();
      return { v: true, h: true, in: false, col: null };
    }

    // ---- Blocks ----

    function new_block() {
      return { v: true, h: true, in: true, col: get_random(context.colors) };
    }

    // ---- Decisions ----

    function start_new_from_blank(x, y) {
      if (!active_position(x, y, false)) return false;
      return Math.random() <= context.chance_new / 10;
    }

    function start_new(x, y) {
      if (!active_position(x, y, false)) return false;
      return Math.random() <= context.chance_new;
    }

    function extend(x, y) {
      if (!active_position(x, y, true)) return false;
      return Math.random() <= context.chance_extend;
    }

    function g_start_new(x, y) {
      let dist_from_centre = get_diagonal(x, y, context.grid_dim_x / 2, context.grid_dim_y / 2);
      return Math.random() * context.radius > dist_from_centre;
    }

    function g_extend(x, y) {
      let dist_from_centre = get_diagonal(x, y, context.grid_dim_x / 2, context.grid_dim_y / 2);
      return Math.sqrt(Math.random()) * context.radius * 2 > dist_from_centre;
    }

    function vertical_dir() {
      return Math.random() <= context.chance_vertical;
    }

    function active_position(x, y, fuzzy) {
      let fuzziness = fuzzy ? 1 + Math.random() * 0.3 : 1 - Math.random() * 0.3;
      return get_diagonal(x, y, context.grid_dim_x / 2, context.grid_dim_y / 2) < context.radius * 1;
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
  }
}
