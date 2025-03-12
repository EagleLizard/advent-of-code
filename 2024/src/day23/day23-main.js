
const { LanNetwork } = require('./lan-network');

module.exports = {
  day23Part1,
};

/*
998 - correct
_*/
function day23Part1(inputLines) {
  let day23Input = parseInput(inputLines);
  let connPairs = day23Input.connPairs;
  let lanNetwork = new LanNetwork();
  for(let i = 0; i < connPairs.length; ++i) {
    let [ compA, compB ] = connPairs[i];
    lanNetwork.addConn(compA, compB);
  }
  
  let foundConns = findTriCycles(lanNetwork);
  /* 
    Found interconnected nodes all connect to each other, so order doesn't matter.
      We can find unique sets by sorting the keys.
  _*/
  let triCycleSet = new Set();
  for(let i = 0; i < foundConns.length; ++i) {
    let foundConn = foundConns[i];
    let connKey = foundConn.map(lanNode => lanNode.val).toSorted().join(' ');
    triCycleSet.add(connKey);
  }
  return triCycleSet.size;;
}

/*
  3 interconnected nodes represent a cycle. If a node cannot connect to itself,
    then 3 interconnected nodes represent the minimum cycle.
_*/
function findTriCycles(lan) {
  let foundCycles = [];
  traverse(lan, (lanNode, soFar) => {
    if(soFar.length === 3) {
      let hasTNode = soFar.some(sfNode => /^t/i.test(sfNode.val));
      let isCycle = soFar[0].hasConn(soFar[2].val);
      if(hasTNode && isCycle) {
        foundCycles.push(soFar.slice());
      }
      return 0;
    }
  });
  return foundCycles;
}

function traverse(lan, visitFn) {
  let lanNodes = lan.getNodes();
  
  for(let i = 0; i < lanNodes.length; ++i) {
    let lanNode = lanNodes[i];
    helper(lanNode, [ lanNode ]);
  }

  function helper(currNode, soFar) {
    soFar = soFar ?? [];
    let visitRes = visitFn?.(currNode, soFar); 
    if(visitRes === 0) {
      return;
    }
    let nodes = currNode.getNodes();
    for(let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      let foundSfIdx = soFar.findIndex(sfNode => {
        return sfNode.val === node.val;
      });
      let visited = foundSfIdx !== -1;
      if(!visited) {
        helper(node, [ ...soFar, node ]);
      }
    }
  }
}

function parseInput(inputLines) {
  let connPairs = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(/\S+-\S+/.test(inputLine)) {
      let [ compA, compB ] = inputLine.trim().split('-');
      connPairs.push([ compA, compB ]);
    }
  }
  let res = {
    connPairs,
  };
  return res;
}
