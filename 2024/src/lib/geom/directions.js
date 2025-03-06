
const { Point } = require('./point');

module.exports = {
  getDirectionPoints,
};

function getDirectionPoints() {
  return [
    new Point(0, -1), // up
    new Point(1, 0), // right
    new Point(0, 1), // down
    new Point(-1, 0), // left
  ];
}
