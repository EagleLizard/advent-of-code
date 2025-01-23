
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

local function blink(stones)
  local nextStones = {}
  for _, stone in ipairs(stones) do
    if stone == 0 then
      table.insert(nextStones, 1)
    elseif stone > 9 and (#(""..stone) % 2) == 0 then
      local stoneStr = ""..stone
      local midIdx = #stoneStr / 2
      local lStr = string.sub(stoneStr, 1, midIdx)
      local rStr = string.sub(stoneStr, midIdx + 1, #stoneStr)
      local lNum = tonumber(lStr)
      if lNum == nil then
        errorf("Invalid stone label: %s", lStr)
      end
      local rNum = tonumber(rStr)
      if rNum == nil then
        errorf("Invalid stone label: %s", rStr)
      end
      table.insert(nextStones, lNum)
      table.insert(nextStones, rNum)
    else
      table.insert(nextStones, stone * 2024)
    end
  end
  return nextStones
end

--[[ 
  189167 - correct
]]
local function day11Pt1(inputLines)
  local stones = parseInput(inputLines)
  for _ = 1, 25 do
    stones = blink(stones)
  end
  return #stones
end

local day11MainModule = {
  day11Pt1 = day11Pt1,
}

return day11MainModule
