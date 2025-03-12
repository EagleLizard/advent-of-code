
let lanNodeIdCounter = 0;

class LanNode {
  constructor(val) {
    this.id = lanNodeIdCounter++;
    this.val = val;
    this.nodeMap = new Map();
  }
  addConn(lanNode) {
    if(!this.nodeMap.has(lanNode.val)) {
      this.nodeMap.set(lanNode.val, lanNode);
    }
  }
  getNodes() {
    return [ ...this.nodeMap.values() ].toSorted(compNodeLex);
  }
  hasConn(val) {
    return this.nodeMap.has(val);
  }
}

class LanNetwork {
  constructor() {
    this.nodeMap = new Map();
  }
  addConn(compA, compB) {
    let lnA, lnB;
    if(!this.nodeMap.has(compA)) {
      this.nodeMap.set(compA, new LanNode(compA));
    }
    lnA = this.nodeMap.get(compA);
    if(!this.nodeMap.has(compB)) {
      this.nodeMap.set(compB, new LanNode(compB));
    }
    lnB = this.nodeMap.get(compB);
    lnA.addConn(lnB);
    lnB.addConn(lnA);
  }

  getNodes() {
    return [ ...this.nodeMap.values() ].toSorted(compNodeLex);
    // return [ ...this.nodeMap.values() ];
  }
}

module.exports = {
  LanNetwork,
};

function compNodeLex(a, b) {
  if(a.val > b.val) {
    return 1;
  } else if(a.val < b.val) {
    return -1;
  } else {
    return 0;
  }
}
