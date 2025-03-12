
const { LanNetwork } = require('./lan-network');

module.exports = {
  day23Part1,
  day23Part2,
};

/*
cc,ff,fh,fr,ny,oa,pl,rg,uj,wd,xn,xs,zw - correct
_*/
function day23Part2(inputLines) {
  let day23Input = parseInput(inputLines);
  let connPairs = day23Input.connPairs;
  let lan = new LanNetwork();
  for(let i = 0; i < connPairs.length; ++i) {
    let [ compA, compB ] = connPairs[i];
    lan.addConn(compA, compB);
  }
  let largestConn = findLargestConn(lan);
  let password = largestConn.map(node => node.val).join(',');

  return password;
}

function findLargestConn (lan) {
  // let foundConns = [];
  let cycleSet = new Set();
  let longestConnLen = -Infinity;
  let longestConn = undefined;
  traverse(lan, (lanNode, soFar) => {
    // console.log(soFar.map(sfNode => sfNode.val).join(' '));
    /*
      only continue if the node being visited is also connected to the first node
    _*/
    
    if(soFar.length > 2) {
      let isConnected = true;
      for(let i = 0; i < soFar.length - 1; ++i) {
        for(let k = i + 1; k < soFar.length; ++k) {
          isConnected = soFar[i].hasConn(soFar[k].val);
          if(!isConnected) {
            break;
          }
        }
        if(!isConnected) {
          break;
        }
      }
      if(!isConnected) {
        return 0;
      }
      if(soFar.length > longestConnLen) {
        longestConnLen = soFar.length;
        longestConn = soFar.slice();
      }
      let connKey = soFar.map(lanNode => lanNode.val).toSorted().join(' ');
      if(cycleSet.has(connKey)) {
        return 0;
      }
      cycleSet.add(connKey);
      // if(soFar.length >= longestConnLen) {
      //   process.stdout.write(`${connKey}\n`);
      // }
    }
  });
  return longestConn;
}

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
