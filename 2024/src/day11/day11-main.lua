
local arr = require("util.arr-util")
local strUtil = require("util.str-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

local function parseInput(inputLines)
  local inputLine = inputLines[1]
  local stones = {}
  for stoneStr in string.gmatch(inputLine, "%d+") do
    local num = tonumber(stoneStr)
    if num == nil then
      errorf("Invalid stone label: %s", stoneStr)
    end
    table.insert(stones, num)
  end
  return stones
end

local function getDigits(n)
  return math.floor(math.log(n, 10)) + 1
end

local function blink2(srcStones, srcBlinks)
  local bCache = {}
  local function getBCacheKey(stone, n)
    return stone.." "..n
  end
  --[[ helper ]]
  local function _blink2(stone, n) 
    local bCacheKey = getBCacheKey(stone, n)
    local res = bCache[bCacheKey]
    if res ~= nil then
      return res
    end
    if n == 0 then
      res = 1
    elseif stone == 0 then
      res = _blink2(1, n - 1)
    else
      local nDigits = getDigits(stone)
      if (nDigits % 2) == 0 then
        local midPow = 10 ^ (nDigits / 2)
        local lNum = math.floor(stone / midPow)
        local rNum = math.floor(stone % midPow)
        res = _blink2(lNum, n - 1) + _blink2(rNum, n - 1)
      else
        res = _blink2(stone * 2024, n - 1)
      end
    end
    bCache[bCacheKey] = res
    return res
  end

  local totalStones = 0
  for _, srcStone in ipairs(srcStones) do
    totalStones = totalStones + _blink2(srcStone, srcBlinks)
  end
  return totalStones
end

--[[ 
  189167 - correct
]]
local function day11Pt1(inputLines)
  local stones = parseInput(inputLines)
  local stoneCount = blink2(stones, 25)
  return stoneCount
end

--[[ 
  225253278506288 - correct
]]
local function day11Pt2(inputLines)
  local stones = parseInput(inputLines)
  local stoneCount = blink2(stones, 75)
  return stoneCount
end

local day11MainModule = {
  day11Pt1 = day11Pt1,
  day11Pt2 = day11Pt2,
}

return day11MainModule
