
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
  let defraggedDisk = defragDisk2(disk, diskFiles);
  let checksum = getChecksum(defraggedDisk);
  return checksum;
}

function defragDisk2(disk, diskFiles) {
  disk = disk.slice();
  diskFiles = diskFiles.slice();
  diskFiles.sort((a, b) => b.id - a.id);
  let diskGaps = getDiskGaps(disk);
  let currIdIdx = 0;
  let currId = diskFiles[currIdIdx].id;
  let idPtr = disk.length - 1;
  while(idPtr > 0) {
    let currBlockLen = 0;
    while(disk[idPtr] !== currId) {
      idPtr--;
    }
    while(disk[idPtr] === currId) {
      currBlockLen++;
      idPtr--;
    }
    if(currBlockLen < 1) {
      throw new Error(`invalid state at idPtr: ${idPtr}`);
    }
    let foundGapIdx = diskGaps.findIndex((gap) => {
      return gap.idx < idPtr && gap.len >= currBlockLen;
    });
    if(foundGapIdx !== -1) {
      let foundGap = diskGaps[foundGapIdx];
      for(let k = 0; k < currBlockLen; ++k) {
        disk[foundGap.idx + k] = currId;
        disk[idPtr + 1 + k] = -1;
      }
      if(foundGap.len > currBlockLen) {
        foundGap.idx += currBlockLen;
        foundGap.len -= currBlockLen;
      } else {
        diskGaps.splice(foundGapIdx, 1);
      }
    }
    currIdIdx++;
    currId = diskFiles[currIdIdx]?.id;
  }
  return disk;
}

function getDiskGaps(disk) {
  let diskGaps = [];
  let parseGap = false;
  let currGapLen = 0;
  let gapStartIdx = -1;
  for(let i = 0; i < disk.length; ++i) {
    let block = disk[i];
    if(block === -1) {
      if(!parseGap) {
        parseGap = true;
        gapStartIdx = i;
      }
      currGapLen++;
    } else {
      if(parseGap) {
        parseGap = false;
        let nextGap = {
          idx: gapStartIdx,
          len: currGapLen,
        };
        diskGaps.push(nextGap);
        gapStartIdx = -1;
        currGapLen = 0;
      }
    }
  }
  return diskGaps;
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
