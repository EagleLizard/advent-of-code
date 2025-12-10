
import { Point3d } from '../../lib/geom/point3d';
import { AocDayDef } from '../../models/aoc-day-def';

// const DAY_8_FILE_NAME = 'day8-test1.txt';
const DAY_8_FILE_NAME = 'day8.txt';

// const distance_pair_lim = 10; // for test input
// const distance_pair_lim = 1000; // for part1 input

class JunctionBox {
  public readonly id: number;
  pos: Point3d;
  // connections: JunctionBox[];
  constructor(x: number, y: number, z: number) {
    this.id = JunctionBox.id_counter++;
    this.pos = new Point3d(x, y, z);
    // this.connections = [];
  }
  private static id_counter = 0;
}

class CircuitGraph {
  /* edges */
  nodes: JunctionBox[];
  connections: [ JunctionBox['id'], JunctionBox['id'] ][];
  /* adjacency matrix */
  adjMatrix: Record<JunctionBox['id'], Set<JunctionBox['id']>>;
  constructor(nodes: JunctionBox[]) {
    this.nodes = nodes.slice();
    this.connections = [];
    this.adjMatrix = {};
    for(let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      this.adjMatrix[node.id] = new Set();
    }
  }
  connect(box1: JunctionBox, box2: JunctionBox) {
    this.adjMatrix[box1.id].add(box2.id);
    this.adjMatrix[box2.id].add(box1.id);
  }
  isConnected(box1: JunctionBox, box2: JunctionBox): boolean {
    return this.adjMatrix[box1.id].has(box2.id)
    || this.adjMatrix[box2.id].has(box1.id);
  }
  getCircuits(): number[][] {
    let circuits: number[][] = [];
    for(let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let foundCircuit: number[] | undefined = circuits.find(circuit => {
        return circuit.includes(node.id);
      });
      if(foundCircuit === undefined)  {
        let currCircuit = this.getCircuit(node);
        circuits.push([ ...currCircuit ]);
      }
    }
    return circuits;
  }
  getCircuit(box: JunctionBox) {
    let visited: Set<number> = new Set();
    let toVisit: number[] = [ box.id ];
    while(toVisit.length > 0) {
      let currId = toVisit.shift()!;
      if(visited.has(currId)) {
        /* cycle, continue */
        continue;
      }
      visited.add(currId);
      let connectedIds = [ ...this.adjMatrix[currId] ];
      for(let i = 0; i < connectedIds.length; i++) {
        toVisit.push(connectedIds[i]);
      }
    }
    return visited;
  }
  isInCircuit(box1: JunctionBox, box2: JunctionBox): boolean {
    let visited: Set<number> = new Set();
    let toVisit: number[] = [ box1.id ];
    while(toVisit.length > 0) {
      let currId = toVisit.shift()!;
      if(visited.has(currId)) {
        /* cycle, continue */
        continue;
      }
      visited.add(currId);
      if(currId === box2.id) {
        return true;
      }
      let connectedIds = [ ...this.adjMatrix[currId] ];
      for(let i = 0; i < connectedIds.length; i++) {
        let connectedId = connectedIds[i];
        toVisit.push(connectedId);
      }
    }
    return false;
  }
}

export const day8 = {
  dayNum: 8,
  file_name: DAY_8_FILE_NAME,
  part1: day8Pt1,
} as const satisfies AocDayDef;

function day8Pt2(inputLines: string[]): number {

}

/*
  131580 - correct
_*/
function day8Pt1(inputLines: string[]): number {
  let boxes: JunctionBox[] = parseInput(inputLines);
  const distance_pair_lim = (boxes.length > 100)
    ? 1000 // for part1 input
    : 10 // for test input
  ;
  /*
  Calculate ALL relative distances in 3d
    sort by lowest
  _*/
  let res = connectLargestCircuits2(boxes, distance_pair_lim);
  return res;
}

function connectLargestCircuits2(boxes: JunctionBox[], connectLimit: number): number {
  let res: number;
  let adjMatrix: Record<number, Set<number>> = {};
  let circuits: Set<number>[] = [];
  /* initialize circuits _*/
  for(let i = 0; i < boxes.length; i++) {
    let circuit = new Set<number>();
    let box = boxes[i];
    circuit.add(box.id);
    circuits.push(circuit);
    adjMatrix[box.id] = new Set();
  }
  let distances = findDistances(boxes).toSorted((a,b) => a.relDist - b.relDist);
  for(let i = 0; i < connectLimit; i++) {
    let currDist = distances[i];
    let box1 = currDist.box1;
    let box2 = currDist.box2;
    let isDirectConnection = isConnected(adjMatrix, box1, box2);
    if(!isDirectConnection) {
      let inCircuit = checkInCircuit(circuits, box1, box2);
      if(!inCircuit) {
        connectBoxes(circuits, adjMatrix, box1, box2);
      }
    }
  }
  let circuitArrs: number[][] = [];
  for(let i = 0; i < circuits.length; i++) {
    let circuit = circuits[i];
    let circuitArr: number[] = [ ...circuit ];
    circuitArrs.push(circuitArr);
  }
  circuitArrs.sort((a, b) => b.length - a.length);
  // console.log(circuitArrs);
  res = circuitArrs[0].length * circuitArrs[1].length * circuitArrs[2].length;
  return res;
}

function connectBoxes(
  circuits: Set<number>[],
  adjMatrix: Record<number, Set<number>>,
  box1: JunctionBox,
  box2: JunctionBox
): void {
  adjMatrix[box1.id].add(box2.id);
  adjMatrix[box2.id].add(box1.id);
  let circuit1Idx = circuits.findIndex((circuit) => {
    return circuit.has(box1.id);
  });
  if(circuit1Idx === -1) {
    /* shouldn't happen _*/
    throw new Error(`Box ${box1.id} not in circuit: ${box1.pos.x},${box1.pos.y},${box1.pos.z}`);
  }
  let circuit2Idx = circuits.findIndex((circuit) => {
    return circuit.has(box2.id);
  });
  if(circuit2Idx === -1) {
    /* shouldn't happen _*/
    throw new Error(`Box ${box2.id} not in circuit: ${box2.pos.x},${box2.pos.y},${box2.pos.z}`);
  }
  let circuit1 = circuits[circuit1Idx];
  let circuit2 = circuits[circuit2Idx];
  if(circuit1Idx !== circuit2Idx) {
    /* merge circuits _*/
    let circuit2BoxIds = [ ...circuit2 ];
    for(let i = 0; i < circuit2BoxIds.length; i++) {
      let circuit2BoxId = circuit2BoxIds[i];
      circuit1.add(circuit2BoxId);
    }
    circuits.splice(circuit2Idx, 1);
  }
}

function checkInCircuit(circuits: Set<number>[], box1: JunctionBox, box2: JunctionBox): boolean {
  let circuit1 = circuits.find((circuit) => {
    return circuit.has(box1.id);
  });
  if(circuit1 === undefined) {
    /* shouldn't happen _*/
    throw new Error(`Box ${box1.id} not in circuit: ${box1.pos.x},${box1.pos.y},${box1.pos.z}`);
  }
  return circuit1.has(box2.id);
}

function isConnected(
  adjMatrix: Record<number, Set<number>>,
  box1: JunctionBox,
  box2: JunctionBox
): boolean {
  return adjMatrix[box1.id].has(box2.id) || adjMatrix[box2.id].has(box1.id);
}

function connectLargestCircuits(boxes: JunctionBox[], connectLimit: number): number {
  let graph: CircuitGraph = new CircuitGraph(boxes);
  let distStartNs = process.hrtime.bigint();
  let distances = findDistances(boxes);
  let distEndNs = process.hrtime.bigint();
  let distMs: number = Number(distEndNs - distStartNs) / 1e6;
  console.log(`distance ms: ${distMs}`);
  distances.sort((a, b) => a.relDist - b.relDist);
  for(let i = 0; i < distances.length; i++) {
    if(i > (connectLimit - 1)) {
      break;
    }
    let currDist = distances[i];
    let box1 = currDist.box1;
    let box2 = currDist.box2;
    let isDirectConnection = graph.isConnected(box1, box2);
    let isInCircuit = graph.isInCircuit(box1, box2);
    if(!isDirectConnection) {
      if(!isInCircuit) {
        graph.connect(box1, box2);
      }
    }
  }
  let circuits = graph.getCircuits().toSorted((a,b) => b.length - a.length);
  let res = circuits[0].length * circuits[1].length * circuits[2].length;
  return res;
}

type DistancePair = {
  box1: JunctionBox;
  box2: JunctionBox;
  relDist: number;
};

function findDistances(boxes: JunctionBox[]): DistancePair[] {
  let distances: DistancePair[] = [];
  for(let i = 0; i < boxes.length; i++) {
    let box1 = boxes[i];
    for(let k = i + 1; k < boxes.length; k++) {
      let box2 = boxes[k];
      let relDist = getDistanceRelative(box1.pos, box2.pos);
      distances.push({
        box1: box1,
        box2: box2,
        relDist: relDist,
      });
    }
  }
  return distances;
}

function getDistanceRelative(p1: Point3d, p2: Point3d): number {
  let xd: number;
  let yd: number;
  let zd: number;
  xd = p2.x - p1.x;
  yd = p2.y - p1.y;
  zd = p2.z - p1.z;
  let relDist = (xd * xd) + (yd * yd) + (zd * zd);
  return relDist;
}

function parseInput(inputLines: string[]) {
  let junctionBoxes: JunctionBox[] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let x: number;
    let y: number;
    let z: number;
    let coordStrs: string[];
    let inputLine = inputLines[i];
    coordStrs = inputLine.split(',');
    x = +coordStrs[0];
    y = +coordStrs[1];
    z = +coordStrs[2];
    if(isNaN(x) || isNaN(y) || isNaN(z)) {
      throw new Error(`Invalid input: ${inputLine}`);
    }
    let junctionBox = new JunctionBox(x, y, z);
    junctionBoxes.push(junctionBox);
  }
  return junctionBoxes;
}
