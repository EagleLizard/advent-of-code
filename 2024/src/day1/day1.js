const assert = require('assert');

module.exports = {
  day1Pt1,
  day1Pt2,
};

function day1Pt2(inputLines) {
  let day1Input = parseInput(inputLines);
  let list1 = day1Input.list1;
  let list2 = day1Input.list2;
  let countMap = {};
  for(let i = 0; i < list1.length; ++i) {
    let currKey = list1[i];
    countMap[currKey] = countMap[currKey] ?? 0;
    for(let k = 0; k < list2.length; ++k) {
      if(list2[k] === currKey) {
        countMap[currKey]++;
      }
    }
  }
  let similarityScore = 0;
  let countMapKeys = Object.keys(countMap);
  for(let i = 0; i < countMapKeys.length; ++i) {
    let currKey = countMapKeys[i];
    let currVal = countMap[currKey];
    similarityScore += currKey * currVal;
  }
  return similarityScore;
}

function day1Pt1(inputLines) {
  let day1Input = parseInput(inputLines);
  let list1 = day1Input.list1;
  let list2 = day1Input.list2;
  let compFn = (a, b) => a - b;
  list1.sort(compFn);
  list2.sort(compFn);
  let totalDistance = 0;
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
    let matchIt = inputLine.matchAll(rx);
    let matchItRes = matchIt.next();
    let matches = matchItRes.value;
    let lVal = +matches[1];
    let rVal = +matches[2];
    assert(!isNaN(lVal));
    assert(!isNaN(rVal));
    list1.push(lVal);
    list2.push(rVal);
  }
  let res = {
    list1,
    list2,
  };
  return res;
}
