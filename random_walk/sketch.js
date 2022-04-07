const H = 400;
const W = 400;
const bg = 50;

function isequal_array(a, b) {
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }

  return true;
}

function random_walk(max_tunnels, max_len, size) {
  let curr_x = parseInt(random(size, W - size));
  let curr_y = parseInt(random(size, H - size));
  let direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let prev_dir = [0, 0];
  let curr_cap = max_tunnels;

  square(curr_x, curr_y, size, 1);

  while (curr_cap > 0) {
    let rand_len = parseInt(random(1, max_len + 1));
    let rand_dir = direction[parseInt(random(0, 4))];
    let tun_len = 0;

    while (isequal_array(prev_dir, rand_dir)) {
      rand_dir = direction[parseInt(random(0, 4))];
    }

    for (let i = 0; i < rand_len; i++) {
      curr_x = curr_x + rand_dir[0] * size;
      curr_y = curr_y + rand_dir[1] * size;

      if (curr_x < size || curr_x > W - size) break;
      if (curr_y < size || curr_y > H - size) break;

      square(curr_x, curr_y, size, 1);
      tun_len += 1;
    }

    if (tun_len) {
      curr_cap = curr_cap - 1;
      prev_dir = rand_dir;
    }
  }
}

function setup() {
  createCanvas(H, W);
  background(bg);

  random_walk(20, 50, 10);
}
