// Returns distance between two points.
export function distance_between_points(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

// Maps value x from interval [x0,x1] to [y0, y1];
export function map_value(x, x0, x1, y0, y1) {
  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

// Returns point at given ratio between two given points
export function on_line(p1, p2, r) {
  let x = map_value(r, 0, 1, p1[0], p2[0]);
  let y = map_value(r, 0, 1, p1[1], p2[1]);
  return [x, y];
}

// Returns an array of distances between pairs of points in order, given an array of points.
function distance_array(points) {
  let distances = [];
  for (let i = 1; i < points.length; i++) {
    let line_length = distance_between_points(points[i - 1], points[i]);
    distances.push(line_length);
  }
  return distances;
}

// Returns points at given ratio on multi-point path.
export function on_path(points, r) {
  let distances = distance_array(points);
  let total_dist = distances.reduce((sum, x) => sum + x);
  let r_length = total_dist * (r % 1);

  let acc = 0;
  for (let i = 0; i < distances.length; i++) {
    if (acc + distances[i] > r_length) {
      let line_r = map_value(r_length, acc, acc + distances[i], 0, 1);
      return on_line(points[i], points[i + 1], line_r);
    }
    acc += distances[i];
  }
}

// Returns angle of line, given two points on line.
export function angle_of_direction(p1, p2) {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}

// Returns point, given base point, distance and angle.
export function point_at_distance_and_angle(p1, dist, rad) {
  return [p1[0] + dist * Math.cos(rad), p1[1] + dist * Math.sin(rad)];
}

// Returns point at given distance from base point, toward direction point.
export function point_at_distance_towards_direction(p1, dist, pdir) {
  return point_at_distance_and_angle(p1, dist, angle_of_direction(p1, pdir));
}

export function intersection_of_two_circles(p1, r1, p2, r2) {
  let d = distance_between_points(p1, p2);

  // Circles are seperate.
  if (d > r1 + r2) return [];
  // One circle is contained within the other.
  if (d < Math.abs(r1 - r2)) return [];
  // Circles are coincident.
  if (d === 0 && r1 === r2) return [];

  let a = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
  let b =
    Math.sqrt(4 * Math.pow(d, 2) * Math.pow(r1, 2) - Math.pow(Math.pow(d, 2) - Math.pow(r2, 2) + Math.pow(r1, 2), 2)) /
    d;

  let p1p2_angle = angle_of_direction(p1, p2);
  let ab_angle = angle_of_direction([0, 0], [a, b]);

  return point_at_distance_and_angle(p1, r1, p1p2_angle + ab_angle);
}
