
const assert = require('assert');

module.exports = {
  day19Part1,
  day19Part2,
};

function day19Part1(inputLines) {
  let day19Input = parseInput(inputLines);
  let towels = day19Input.towels;
  let designs = day19Input.designs;
  let possibleDesignCount = 0;
  for(let i = 0; i < designs.length; ++i) {
    let design = designs[i];
    let isValid = checkDesign(towels, design) ?? false;
    if(isValid) {
      possibleDesignCount++;
    }
  }
  return possibleDesignCount;
}

/* 
705756472327497 - correct
*/

function day19Part2(inputLines) {
  let day19Input = parseInput(inputLines);
  let towels = day19Input.towels;
  let designs = day19Input.designs;
  let allPossibleDesigns = 0;
  for(let i = 0; i < designs.length; ++i) {
    let design = designs[i];
    let possibleDesigns = countDesigns(towels, design);
    allPossibleDesigns += possibleDesigns;
  }
  return allPossibleDesigns;
}

function countDesigns(towels, srcDesign) {
  const helper = (() => {
    let cache = {};
    return (design) => {
      if(cache[design] !== undefined) {
        return cache[design];
      }
      let currCount = 0;
      if(design.length === 0) {
        cache[design] = 1;
        return cache[design];
      }
      for(let i = 0; i < towels.length; ++i) {
        let towel = towels[i];
        if(design.startsWith(towel)) {
          currCount += helper(design.substring(towel.length));
        }
      }
      cache[design] = currCount;
      return cache[design];
    };
  })();
  return helper(srcDesign);
}

function checkDesign(towels, srcDesign) {
  towels = towels.slice();
  const helper = (() => {
    let cache = {};
    return (design) => {
      if(cache[design] !== undefined) {
        return cache[design];
      }
      if(design.length === 0) {
        cache[design] = true;
        return cache[design];
      }
      for(let i = 0; i < towels.length; ++i) {
        let towel = towels[i];
        if(design.startsWith(towel)) {
          let nd = design.substring(towel.length);
          let isValid = helper(nd);
          if(isValid) {
            cache[design] = true;
            return cache[design];
          }
        }
      }
      cache[design] = false;
      return cache[design];
    };
  })();
  return helper(srcDesign);
}
function psf(soFar, towels) {
  let sfArr = [];
  let useTowelStr = towels !== undefined;
  for(let i = 0; i < soFar.length; ++i) {
    let sfv = useTowelStr ? towels[soFar[i]] : soFar[i];
    sfArr.push(sfv);
  }
  return sfArr.join(' ');
}

function parseInput(inputLines) {
  let readTowels = true;
  let readDesigns = false;
  let towels = [];
  let designs = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(readTowels) {
      let rx = /(?<towel>[a-z]+),?/g;
      let rxExecRes = [ ...inputLine.matchAll(rx) ];
      for(let k = 0; k < rxExecRes.length; ++k) {
        assert(rxExecRes[k]?.groups?.towel !== undefined);
        towels.push(rxExecRes[k].groups.towel);
      }
      readTowels = false;
    } else if(!readDesigns) {
      if(inputLine.length < 1) {
        readDesigns = true;
      }
    } else if(readDesigns) {
      designs.push(inputLine);
    }
  }
  let res = {
    towels,
    designs,
  };
  return res;
}
