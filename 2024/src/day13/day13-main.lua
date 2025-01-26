
local Point = require("geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

local function parseInput(inputLines)
  local claws = {}
  local a, b
  for _, inputLine in ipairs(inputLines) do
    if string.match(inputLine, "^Button A:") then
      local xStr, yStr = string.match(inputLine, "^Button A: X%+(%d+), Y%+(%d+)")
      local x = tonumber(xStr) or errorf("Invalid button X: %s", xStr)
      local y = tonumber(yStr) or errorf("Invalid button Y: %s", yStr)
      a = Point.new(x, y)
    elseif string.match(inputLine, "^Button B:") then
      local xStr, yStr = string.match(inputLine, "^Button B: X%+(%d+), Y%+(%d+)")
      local x = tonumber(xStr) or errorf("Invalid button X: %s", xStr)
      local y = tonumber(yStr) or errorf("Invalid button Y: %s", yStr)
      b = Point.new(x, y)
    elseif string.match(inputLine, "^Prize: ") then
      local xStr, yStr = string.match(inputLine, "^Prize: X=(%d+), Y=(%d+)")
      local x = tonumber(xStr) or errorf("Invalid button X: %s", xStr)
      local y = tonumber(yStr) or errorf("Invalid button Y: %s", yStr)
      table.insert(claws, {
        a = a,
        b = b,
        prize = Point.new(x, y),
      })
    end
  end
  return claws
end

local function getClawTokens(x1, y1, x2, y2, x3, y3)
  local a = (y2*x3 - x2*y3)/(x1*y2 - y1*x2)
  local b = (y1*x3 - x1*y3)/(y1*x2 - x1*y2)
  --[[
    a and b must be integers for the claw to be exactly on top
  ]]
  if a == math.floor(a) and b == math.floor(b) then
    return a*3 + b
  end
  return 0
end

--[[ 
  31761 - correct
]]
local function day13Pt1(inputLines)
  local claws = parseInput(inputLines)
  local totalTokens = 0
  for _, claw in ipairs(claws) do
    local tokens = getClawTokens(claw.a.x, claw.a.y, claw.b.x, claw.b.y, claw.prize.x, claw.prize.y)
    totalTokens = totalTokens + tokens
  end

  return totalTokens
end

--[[ 
  90798500745591 - correct
]]
local function day13Pt2(inputLines)
  local claws = parseInput(inputLines)
  local totalTokens = 0
  local mod = 1e13
  for _, claw in ipairs(claws) do
    local tokens = getClawTokens(claw.a.x, claw.a.y, claw.b.x, claw.b.y, claw.prize.x + mod, claw.prize.y + mod)
    totalTokens = totalTokens + tokens
  end
  return totalTokens
end

local day13Module = {
  day13Pt1 = day13Pt1,
  day13Pt2 = day13Pt2,
}

return day13Module
