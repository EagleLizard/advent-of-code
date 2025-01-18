
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

--[[ 
6323641412437 - correct - 114311.527 ms (1.91 m)
]]
local function day9Pt1(inputLines)
  local inputLine = inputLines[1]
  local diskFiles = parseInput(inputLine)
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
  local compactDisk = makeCompactDisk3(diskArr)
  local checksum = getCompactChecksum(compactDisk)
  return checksum
end

local day9MainModule = {
  day9Pt1 = day9Pt1,
}

return day9MainModule
