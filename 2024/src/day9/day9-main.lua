
local strUtil = require("../util/str-util")
local arr = require("../util/arr-util")

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
      -- printf("%d: %s - %s\n", currId, c, freeBlocks)
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

local function checkDiskHasGaps(disk)
  local parseFree = false
  for _, block in ipairs(disk) do
    if not parseFree then
      if block == "." then
        parseFree = true
      end
    else
      --[[ 
        if we encounter a block that is not free,
          then a gap exists
      ]]
      if block ~= "." then
        return true
      end
    end
  end
  return false
end

local function makeCompactDisk(diskArr)
  local diskCopy = arr.copy(diskArr)
  while checkDiskHasGaps(diskCopy) do
    --[[ 
      find last block idx, then find first free block idx
    ]]
    local blockIdx = -1
    local freeIdx = -1
    for i = #diskCopy, 1, -1 do
      if string.match(diskCopy[i], "%d") then
        blockIdx = i
        break
      end
    end
    for i = 1, #diskCopy do
      if string.match(diskCopy[i], "%.") then
        freeIdx = i
        break
      end
    end
    --[[ 
      swap
    ]]
    diskCopy[freeIdx] = diskCopy[blockIdx]
    diskCopy[blockIdx] = "."
  end
  return diskCopy
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
  -- for _, diskFile in ipairs(diskFiles) do
  --   printf("%d: %d", diskFile.id, diskFile.blockSize)
  --   if diskFile.freeBlocks ~= nil then
  --     printf(", free: %d", diskFile.freeBlocks)
  --   end
  --   printf("\n")
  -- end
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
  -- printf("%s\n", strUtil.join(diskArr, ""))
  local compactDisk = makeCompactDisk(diskArr)
  -- printf("%s\n", strUtil.join(compactDisk))
  local checksum = getCompactChecksum(compactDisk)
  return checksum
end

local day9MainModule = {
  day9Pt1 = day9Pt1,
}

return day9MainModule
