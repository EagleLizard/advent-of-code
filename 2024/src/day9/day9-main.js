
module.exports = {
  day9Part1,
};

/*
6323641412437 - correct
_*/
function day9Part1(inputLines) {
  let diskFiles = parseInput(inputLines);
  let disk = getDisk(diskFiles);
  let compactDisk = makeCompactDisk(disk);
  let checksum = getChecksum(compactDisk);
  return checksum;
}
 
function getChecksum(disk) {
  // let blockPos = 0;
  let checksum = 0;
  for(let i = 0; i < disk.length; ++i) {
    if(disk[i] >= 0) {
      checksum += i * disk[i];
    }
  } 
  return checksum;
}

function makeCompactDisk(disk) {
  disk = disk.slice();
  let gapPtr = 0;
  let blockPtr = disk.length - 1;
  while(blockPtr > gapPtr) {
    while(disk[gapPtr] >= 0) {
      gapPtr++;
    }
    while(disk[blockPtr] < 0) {
      blockPtr--;
    }
    if(gapPtr < blockPtr) {
      /* swap */
      disk[gapPtr] = disk[blockPtr];
      disk[blockPtr] = -1;
      gapPtr++;
      blockPtr--;
    }
  }
  return disk;
}

function printDisk(disk) {
  for(let i = 0; i < disk.length; ++i) {
    let c = (disk[i] === -1) ? '.' : `${disk[i]}`;
    process.stdout.write(c);
  }
  process.stdout.write('\n');
}

function getDisk(diskFiles) {
  let disk = [];
  for(let i = 0; i < diskFiles.length; ++i) {
    let diskFile = diskFiles[i];
    for(let k = 0; k < diskFile.blockSize; ++k) {
      disk.push(diskFile.id);
    }
    for(let k = 0; k < diskFile.freeBlocks; ++k) {
      disk.push(-1);
    }
  }
  return disk;
}

function parseInput(inputLines) {
  let diskStr = inputLines[0];
  let diskFiles = [];
  let idCounter = 0;
  for(let i = 0; i < diskStr.length; i += 2) {
    let id = idCounter++;
    let blockSize = +diskStr[i];
    let freeBlocks = (i < diskStr.length - 1) ? +diskStr[i + 1] : 0;
    let diskFile = {
      id,
      blockSize,
      freeBlocks,
    };
    diskFiles.push(diskFile);
  }
  return diskFiles;
}
