
local strUtil = require("../util/str-util")
local arr = require("../util/arr-util")
local dateTimeUtil = require("../util/date-time-util")

local printf = require("../util/printf")
local errorf = require("../util/errorf")

local function parseInput(inputLine)
  -- printf("%s\n", inputLine)
  local idCounter = 0
  local diskFiles = {}
  for i = 1, #inputLine do
    local c = string.sub(inputLine, i, i)
    local isId = i % 2 ~= 0
    local freeBlocksStr = nil
    if isId then
      local currId = idCounter
      idCounter = idCounter + 1
      if i < #inputLine then
        freeBlocksStr = string.sub(inputLine, i + 1, i + 1)
      end
      local blockSize = tonumber(c)
      if blockSize == nil then
        errorf("invalid blockSize '%s', file id: %d", c, currId)
      end
      local freeBlocks = nil
      if freeBlocksStr ~= nil then
        freeBlocks = tonumber(freeBlocksStr)
        if freeBlocks == nil then
          errorf("invalid freeBlocks '%s', file id: %d, blockSize: %s", freeBlocksStr, currId, c)
        end
      end
      table.insert(diskFiles, {
        id = currId,
        blockSize = blockSize,
        freeBlocks = freeBlocks,
      })
    end
  end
  return diskFiles
end

local function makeCompactDisk3(diskArr)
  local disk = arr.copy(diskArr)
  local gapPtr = 1
  local blockPtr = #disk
  while blockPtr > gapPtr do
    --[[ find next gap ]]
    while disk[gapPtr] ~= "." do
      gapPtr = gapPtr + 1
    end
    --[[ find next block ]]
    while disk[blockPtr] == "." do
      blockPtr = blockPtr - 1
    end
    if gapPtr < blockPtr then
      --[[ swap ]]
      disk[gapPtr] = disk[blockPtr]
      disk[blockPtr] = "."
      gapPtr = gapPtr + 1
      blockPtr = blockPtr - 1
    end
  end
  return disk
end

local function getCompactChecksum(compactDisk)
  local blockPos = 0
  local checksum = 0
  for _, block in ipairs(compactDisk) do
    if block ~= "." then
      checksum = checksum + (blockPos * block)
    end
    blockPos = blockPos + 1
  end
  return checksum
end

local function getDisk(diskFiles)
  local diskArr = {}
  for _, diskFile in ipairs(diskFiles) do
    for _ = 1, diskFile.blockSize do
      table.insert(diskArr, diskFile.id)
    end
    if diskFile.freeBlocks ~= nil then
      for _ = 1, diskFile.freeBlocks do
        table.insert(diskArr, ".")
      end
    end
  end
  return diskArr
end

local function getDiskGaps(disk)
  local diskGaps = {}
  local parseGap = false
  local currGapLen = 0
  local gapStartIdx = nil
  for i = 1, #disk do
    local block = disk[i]
    if block == "." then
      if not parseGap then
        parseGap = true
        gapStartIdx = i
      end
      currGapLen = currGapLen + 1
    else
      if parseGap then
        --[[ add the current gap and reset ]]
        parseGap = false
        local nextGap = {
          idx = gapStartIdx,
          len = currGapLen,
        }
        table.insert(diskGaps, nextGap)
        gapStartIdx = nil
        currGapLen = 0
      end
    end
  end
  return diskGaps
end

local function defragDisk2(diskArr, diskIds)
  table.sort(diskIds, function(a, b)
    return a > b
  end)
  local disk = arr.copy(diskArr)
  local diskGaps = getDiskGaps(disk)
  -- printf("%s\n", strUtil.join(disk, ""))
  -- printf("%s\n", strUtil.join(diskIds, ""))
  local parseBlock = false
  local currIdIdx = 1
  local currId = diskIds[currIdIdx]
  -- local currIdBlockLen = 0
  local idPtr = #disk
  while idPtr > 0 do
    local currBlockLen = 0
    -- printf("currId: %d\n", currId)
    -- printf("%s\n", strUtil.join(disk, ""))
    while disk[idPtr] ~= currId do
      idPtr = idPtr - 1
    end
    while disk[idPtr] == currId do
      currBlockLen = currBlockLen + 1
      idPtr = idPtr - 1
    end
    if currBlockLen < 1 then
      errorf("invalid state at idPtr: %d", idPtr)
    end
    local foundGapIdx = arr.findIndex(diskGaps, function (gap)
      return gap.idx < idPtr and gap.len >= currBlockLen
    end)
    if foundGapIdx ~= nil then
      local foundGap = diskGaps[foundGapIdx]
      for k = 0, currBlockLen - 1 do
        disk[foundGap.idx + k] = currId
        disk[idPtr + 1 + k] = "."
      end
      -- printf("%s\n", strUtil.join(disk, ""))
      -- printf("id: %d\nlen: %d\n", currId, currBlockLen)
      -- printf("foundGap: (%d, %d)\n", foundGap.idx, foundGap.len)
      if foundGap.len > currBlockLen then
        --[[
          If the gap is smaller than the current file block,
            adjust it's idx and len
        ]]
        foundGap.idx = foundGap.idx + currBlockLen
        foundGap.len = foundGap.len - currBlockLen
      else
        --[[ gap is same size as id block, remove ]]
        table.remove(diskGaps, foundGapIdx)
      end
    end
    currIdIdx = currIdIdx + 1
    currId = diskIds[currIdIdx]
    -- printf("%s\n", strUtil.join(disk, ""))
  end
  return disk
end

--[[ 
8505770332595 - too high
6351801932670 - correct
]]
local function day9Pt2(inputLines)
  local inputLine = inputLines[1]
  local diskFiles = parseInput(inputLine)
  local diskIds = {}
  for _, diskFile in ipairs(diskFiles) do
    table.insert(diskIds, diskFile.id)
  end
  local diskArr = getDisk(diskFiles)
  local defraggedDisk = defragDisk2(diskArr, diskIds)
  local checksum = getCompactChecksum(defraggedDisk)
  return checksum
end

--[[ 
6323641412437 - correct - 114311.527 ms (1.91 m)
]]
local function day9Pt1(inputLines)
  local inputLine = inputLines[1]
  local diskFiles = parseInput(inputLine)
  local diskArr = getDisk(diskFiles)
  local compactDisk = makeCompactDisk3(diskArr)
  local checksum = getCompactChecksum(compactDisk)
  return checksum
end

local day9MainModule = {
  day9Pt1 = day9Pt1,
  day9Pt2 = day9Pt2,
}

return day9MainModule
