const p5 = require('p5');

module.exports.update = update;
module.exports.display = display;

function display (p, pos, vel) {
  //p.line(pos.x, pos.y, (pos.x + vel.x), (pos.y + vel.y));
  //p.fill(0);
  //p.ellipse(pos.x, pos.y, 50);
  p.point(pos.x, pos.y);
}

function update (p, t, pos, vel, seed) {
  const w = p.windowWidth;
  const h = p.windowHeight;

  pos.x = mod((pos.x + vel.x), w);
  pos.y = mod((pos.y + vel.y), h);

  var r = p5.Vector.fromAngle(p.noise(seed, t) * p.TWO_PI);
  vel.x = r.x;
  vel.y = r.y;

  vel.add(flow(p, pos)).mult(3);
}

function flow (p, pos) {
  let r = p.noise(pos.x / 100, pos.y / 100) * p.TWO_PI;
  return p5.Vector.fromAngle(r).mult(2);
}

function mod (x, n) {
  return ((x % n) + n ) % n;
}
