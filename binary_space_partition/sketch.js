const BG = 125;
const H = 700;
const W = 700;
const SPACE_H = 500;
const SPACE_W = 500;
const MIN_WIDTH = 40;
const MIN_HEIGHT = 40;
const MIN_ROOM_AREA = 10000;
const MAX_NODES = 5;
let LEAVES = [];
let PATHS = [];

class Space {
  constructor(
    x,
    y,
    width,
    height,
    parent = null,
    left_child = null,
    right_child = null
  ) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.left_child = left_child;
    this.right_child = right_child;
    this.middle_x = parseInt(x + width / 2);
    this.middle_y = parseInt(y + height / 2);
    this.room_x = -1;
    this.room_y = -1;
    this.room_w = -1;
    this.room_h = -1;
    this.room_mx = -1;
    this.room_my = -1;
  }

  drawSpace() {
    rect(this.x, this.y, this.width, this.height);
  }

  drawRoom(crowding_x, crowding_y) {
    let rw = parseInt(random(MIN_WIDTH, this.width - crowding_x));
    let rh = parseInt(random(MIN_HEIGHT, this.height - crowding_y));

    let rx = parseInt(random(this.x, this.x + this.width - rw));
    let ry = parseInt(random(this.y, this.y + this.height - rh));

    rect(rx, ry, rw, rh);

    this.room_x = rx;
    this.room_y = ry;
    this.room_w = rw;
    this.room_h = rh;
    this.room_mx = parseInt(this.room_x + this.room_w / 2);
    this.room_my = parseInt(this.room_y + this.room_h / 2);
  }

  isLeaf() {
    if (this.left_child == null && this.right_child == null) return true;

    return false;
  }
}

function create_space_partition(
  x_start,
  y_start,
  width,
  height,
  parent,
  isdraw = false
) {
  if (
    height < MIN_HEIGHT ||
    width < MIN_WIDTH ||
    x_start + width > W ||
    y_start + height > H
  ) {
    //console.log(x_start,y_start,height,width);
    return false;
  }

  if (isdraw) rect(x_start, y_start, width, height);
  //console.log(x_start,y_start,height,width);

  /// partition

  let dir = parseInt(random(0, 2));

  if (dir == 0) {
    // vertical

    let a = new Space(
      x_start,
      y_start,
      parseInt(width / 2),
      parseInt(height),
      (parent = parent)
    );
    let b = new Space(
      x_start + parseInt(width / 2),
      y_start,
      parseInt(width / 2),
      parseInt(height),
      (parent = parent)
    );

    let l = create_space_partition(
      x_start,
      y_start,
      parseInt(width / 2),
      parseInt(height),
      a,
      isdraw
    );
    let r = create_space_partition(
      x_start + parseInt(width / 2),
      y_start,
      parseInt(width / 2),
      parseInt(height),
      b,
      isdraw
    );

    // creating objects

    if (l == true) {
      parent.left_child = a;
    }

    if (r == true) {
      parent.right_child = b;
    }
  } else {
    /// horizontal

    let a = new Space(
      x_start,
      y_start,
      parseInt(width),
      parseInt(height / 2),
      (parent = parent)
    );
    let b = new Space(
      x_start,
      y_start + parseInt(height / 2),
      parseInt(width),
      parseInt(height / 2),
      (parent = parent)
    );

    let l = create_space_partition(
      x_start,
      y_start,
      parseInt(width),
      parseInt(height / 2),
      a,
      isdraw
    );
    let r = create_space_partition(
      x_start,
      y_start + parseInt(height / 2),
      parseInt(width),
      parseInt(height / 2),
      b,
      isdraw
    );

    if (l == true) {
      parent.left_child = a;
    }

    if (r == true) {
      parent.right_child = b;
    }
  }

  return true;
}

function draw_path(x1, y1, x2, y2) {
  strokeWeight(4);
  stroke(255);
  line(x1, y1, x2, y2);
  strokeWeight(0);
}

function dfs(node) {
  if (node == null) return;
  // node.drawSpace();

  if (node.left_child == null && node.right_child == null) LEAVES.push(node);
  dfs(node.left_child);
  dfs(node.right_child);

  return;
}

function create_path(node) {
  if (node == null) return [];

  if (node.isLeaf()) return [node];

  //    if(node.left_child.isLeaf() && node.right_child.isLeaf())
  //    {

  //       let x1 = (node.left_child.room_mx == -1)?node.left_child.middle_x : node.left_child.room_mx;
  //       let y1 = (node.left_child.room_my == -1)?node.left_child.middle_y : node.left_child.room_my;

  //       let x2 = (node.right_child.room_mx == -1)?node.right_child.middle_x : node.right_child.room_mx;
  //       let y2 = (node.right_child.room_my == -1)?node.right_child.middle_y : node.right_child.room_my;

  //       draw_path(x1,y1,x2,y2);

  //    }

  let left_children = create_path(node.left_child);
  let right_children = create_path(node.right_child);

  if (left_children.length > 0 && right_children.length > 0) {
    let rand_l = random(left_children);
    let rand_r = random(right_children);

    let x1 = rand_l.room_mx;
    let y1 = rand_l.room_my;

    let x2 = rand_r.room_mx;
    let y2 = rand_r.room_my;

    draw_path(x1, y1, x2, y2);
  }

  let answer = left_children.concat(right_children);

  return answer;
}

function setup() {
  createCanvas(H, W);
  background(BG);

  let parent = new Space(100, 100, SPACE_W, SPACE_H);
  create_space_partition(100, 100, SPACE_W, SPACE_H, parent, (isdraw = false));

  dfs(parent);

  for (let i = 0; i < LEAVES.length; i++) {
    print(LEAVES[i].x, LEAVES[i].y, LEAVES[i].width, LEAVES[i].height);
    // LEAVES[i].drawSpace();
    strokeWeight(0);
    LEAVES[i].drawRoom(MIN_WIDTH - 10, MIN_HEIGHT - 10);

    //      if(i > 0){

    //        draw_path(LEAVES[i].room_mx ,LEAVES[i].room_my,LEAVES[i-1].room_mx,LEAVES[i-1].room_my)
    //      }

    // let curr_parent = LEAVES[i].parent;
    // let sibling = LEAVES[i].
  }

  create_path(parent);
}
