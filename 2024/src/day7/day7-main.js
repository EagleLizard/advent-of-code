
const assert = require('assert');

module.exports = {
  day7Part1,
};

function day7Part1(inputLines) {
  let equations = parseInput(inputLines);
  let ops = [ '+', '*' ];
  let calibrationRes = 0;
  for(let i = 0; i < equations.length; ++i) {
    let equation = equations[i];
    let solvable = checkSolvable(equation.testVal, equation.nums, ops);
    if(solvable) {
      calibrationRes += equation.testVal;
    }
    // console.log(`${equation.testVal}: ${equation.nums.join(' ')} - ${solvable}`);
  }
  return calibrationRes;
}

function checkSolvable(testVal, nums, ops) {
  function helper(idx, res) {
    if(idx >= nums.length) {
      return res === testVal;
    }
    for(let i = 0; i < ops.length; ++i) {
      let op = ops[i];
      let currRes = doOp(op, res, nums[idx]);
      let validEq = false;
      if(currRes <= testVal) {
        validEq = helper(idx + 1, currRes);
      }
      if(validEq) {
        return true;
      }
    }
    return false;
  }
  return helper(1, nums[0]);
}

function doOp(op, a, b) {
  switch(op) {
    case '+':
      return a + b;
    case '*':
      return a * b;
    default:
      throw new Error(`Invalid op: ${op}`);
  }
}

function parseInput(inputLines) {
  let equations = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    // let rx = /^([0-9]+):(\s[0-9]+)+$/g;
    let [ testValStr, numsStr ] = inputLine.split(':');
    let numStrs = [ ...numsStr.matchAll(/[0-9]+/g) ].map(rxExecArr => rxExecArr[0]);
    let testVal = +testValStr;
    let nums = numStrs.map(numStr => +numStr);
    assert(!isNaN(testVal));
    assert(nums.every(num => !isNaN(num)));
    let equation = {
      testVal,
      nums,
    };
    equations.push(equation);
  }
  return equations;
}
