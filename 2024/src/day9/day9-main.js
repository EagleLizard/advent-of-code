
module.exports = {
  day9Part1,
  day9Part2,
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

/*
6351801932670 - correct
_*/
function day9Part2(inputLines) {
  let diskFiles = parseInput(inputLines);
  let disk = getDisk(diskFiles);
  let defraggedDisk = defragDisk(disk, diskFiles);
  let checksum = getChecksum(defraggedDisk);
  return checksum;
}

function defragDisk(disk, diskFiles) {
  disk = disk.slice();
  diskFiles = diskFiles.slice();
  diskFiles.sort((a, b) => b.id - a.id);
  for(let i = 0; i < diskFiles.length; ++i) {
    let diskFile = diskFiles[i];
    let diskId = diskFile.id;
    let idIdx = disk.indexOf(diskId);
    let blockSize = diskFile.blockSize;
    let gapIdx = findGapIdx(disk, blockSize, idIdx);
    if(gapIdx !== -1) {
      for(let k = 0; k < blockSize; ++k) {
        /* swap */
        disk[gapIdx + k] = diskId;
        disk[idIdx + k] = -1;
      }
    }
  }
  return disk;
}

function findGapIdx(disk, gapSize, endIdx) {
  endIdx = endIdx ?? disk.length - 1;
  let gsPtr = 0;
  let gePtr = -1;
  while(gsPtr < endIdx) {
    while(disk[gsPtr] >= 0) {
      gsPtr++;
    }
    if(gsPtr >= endIdx) {
      break;
    }
    gePtr = gsPtr + 1;
    while(disk[gePtr] < 0) {
      gePtr++;
    }
    let currGapSize = gePtr - gsPtr;
    if(currGapSize >= gapSize) {
      return gsPtr;
    }
    gsPtr += currGapSize;
    gePtr = -1;
  }
  return -1;
}
 
function getChecksum(disk) {
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
