
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  keyStr() {
    return `${this.x},${this.y}`;
  }
}

module.exports = {
  Point,
};
