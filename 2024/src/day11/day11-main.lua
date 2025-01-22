
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
    local stone = {
      num = num,
    }
    table.insert(stones, stone)
  end
  return stones
end

local function day11Pt1(inputLines)
  local stones = parseInput(inputLines)
  for _, stone in ipairs(stones) do
    printf("%d, ", stone.num)
  end
  printf("\n")
  return -1
end

local day11MainModule = {
  day11Pt1 = day11Pt1,
}

return day11MainModule
