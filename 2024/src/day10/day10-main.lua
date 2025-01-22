
local strUtil = require("util.str-util")
local arr = require("util.arr-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

local function getPtKey(pt)
  return string.format("%d %d", pt.x, pt.y)
end

local function parseInput(inputLines)
  local trailHeads = {}
  local grid = {}
  for y, inputLine in ipairs(inputLines) do
    table.insert(grid, {})
    for x = 1, #inputLine do
      local c = string.sub(inputLine, x, x)
      local n = tonumber(c)
      if n == nil then
         errorf("Invalid input char at (%d, %d): '%s'", x, y, c)
      end
      table.insert(grid[y], n)
      if n == 0 then
        table.insert(trailHeads, {
          x = x,
          y = y,
        })
      end
    end
  end
  local res = {
    grid = grid,
    trailHeads = trailHeads,
  }
  return res
end

local function getAdjPts(grid, pt)
  local width = #grid[1]
  local height = #grid
  local adjPts = {}
  --[[ up ]]
  if pt.y > 1 then
    table.insert(adjPts, {
      x = pt.x,
      y = pt.y - 1
    })
  end
  --[[ right ]]
  if pt.x < width then
    table.insert(adjPts, {
      x = pt.x + 1,
      y = pt.y,
    })
  end
  -- [[ down ]]
  if pt.y < height then
    table.insert(adjPts, {
      x = pt.x,
      y = pt.y + 1,
    })
  end
  --[[ left ]]
  if pt.x > 1 then
    table.insert(adjPts, {
      x = pt.x - 1,
      y = pt.y,
    })
  end

  return adjPts
end

local function hike(grid, srcPt)
  local paths = {}
  --[[ helper ]]
  local function _hike(pt, soFar)
    local adjPts = getAdjPts(grid, pt)
    local currVal = grid[pt.y][pt.x]
    if currVal == 9 then
      local path = arr.copy(soFar)
      table.insert(path, pt)
      table.insert(paths, path)
      return
    end
    for _, adjPt in ipairs(adjPts) do
      local adjVal = grid[adjPt.y][adjPt.x]
      if (adjVal - currVal) == 1 then
        table.insert(soFar, pt)
        _hike(adjPt, soFar)
        table.remove(soFar)
      end
    end
  end
  
  _hike(srcPt, {})
  return paths
end

--[[ 
  1186 - correct
]]
local function day10Pt2(inputLines)
  local parsedInput = parseInput(inputLines)
  local grid = parsedInput.grid
  local trailHeads = parsedInput.trailHeads
  local totalScore = 0
  for _, hPt in ipairs(trailHeads) do
    local paths = hike(grid, hPt)
    totalScore = totalScore + #paths
  end
  return totalScore
end

--[[ 
  535 - correct
]]
local function day10Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  local grid = parsedInput.grid
  local trailHeads = parsedInput.trailHeads

  local totalScore = 0
  -- trailHeads = { trailHeads[1] }
  for _, hPt in ipairs(trailHeads) do
    --[[ 
      N E S W - Up, Right, Down, Left
    ]]
    local currScore = 0
    local paths = hike(grid, hPt)
    local destSet = {}
    for _, path in ipairs(paths) do
      local destPt = path[#path]
      local destPtKey = getPtKey(destPt)
      if destSet[destPtKey] == nil then
        destSet[destPtKey] = destPt
      end
    end
    for _, destPt in pairs(destSet) do
      -- printf("(%s, %s)\n", destPt.x, destPt.y)
      currScore = currScore + 1
    end
    totalScore = totalScore + currScore
  end
  return totalScore
end

local day10MainModule = {
  day10Pt1 = day10Pt1,
  day10Pt2 = day10Pt2,
}

return day10MainModule
