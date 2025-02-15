
const { Point } = require('../lib/geom/point');

module.exports = {
  day18Part1
};

function day18Part1(inputLines) {
  let day18Input = parseInput(inputLines);
  let isTest = (day18Input.maxX === 6) && (day18Input.maxY === 6);
  let width = isTest ? 7 : 71;
  let height = isTest ? 7 : 71;
  let n = isTest ? 12 : 1024;
  let grid = makeGrid(day18Input.coords, width, height, n);
  console.log(printGrid(grid));
  return -1;
}

function makeGrid(coords, w, h, n) {
  let grid = Array(h).fill(0).map(() => {
    return Array(w).fill(0).map(() => '.');
  });
  console.log(grid[6]);
  for(let i = 0; i < n; ++i) {
    let coord = coords[i];
    grid[coord.y][coord.x] = '#';
  }
  return grid;
}

function printGrid(grid) {
  let gridStr = '';
  for(let y = 0; y < grid.length; ++y) {
    for(let x = 0; x < grid[y].length; ++x) {
      gridStr += grid[y][x];
    }
    gridStr += '\n';
  }
  return gridStr;
}

function parseInput(inputLines) {
  let maxX = -Infinity;
  let maxY = -Infinity;
  let coords = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    let rx = /(?<left>[0-9]+),(?<right>[0-9]+)/;
    let rxExecRes = rx.exec(inputLine);
    let left = +rxExecRes?.groups?.left;
    let right = +rxExecRes?.groups?.right;
    if(left > maxX) {
      maxX = left;
    }
    if(right > maxY) {
      maxY = right;
    }
    let point = new Point(left, right);
    coords.push(point);
  }
  let res = {
    coords,
    maxX,
    maxY,
  };
  return res;
}
