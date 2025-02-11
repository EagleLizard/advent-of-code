const assert = require('assert');

module.exports = {
  day1Pt1,
  day1Pt2,
};

function day1Pt2(inputLines) {
  return -1;
}

function day1Pt1(inputLines) {
  let day1Input = parseInput(inputLines);
  let list1 = day1Input.list1;
  let list2 = day1Input.list2;
  let compFn = (a, b) => a - b;
  list1.sort(compFn);
  list2.sort(compFn);
  let totalDistance = 0
  for(let i = 0; i < list1.length; ++i) {
    totalDistance += Math.abs(list2[i] - list1[i]);
  }
  
  return totalDistance;
}

function parseInput(inputLines) {
  let list1 = [];
  let list2 = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    let rx = /^([0-9]+)\s+([0-9]+)$/g;
    // console.log(rx);
    let matchIt = inputLine.matchAll(rx);
    let matchItRes = matchIt.next();
    assert(!matchItRes.done);
    let matches = matchItRes.value;
    matchItRes = matchIt.next();
    assert(matchItRes.done);
    let lVal = +matches[1];
    let rVal = +matches[2];
    assert(!isNaN(lVal));
    assert(!isNaN(rVal));
    list1.push(lVal);
    list2.push(rVal);
    // console.log(inputLine);
    // while((itRes = matchIt.next()).done) {
    //   console.log(itRes.value);
    // }
    // console.log(matchIt);
    // console.log([ ...matches ]);
  }
  let res = {
    list1,
    list2,
  };
  return res;
}
