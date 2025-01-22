
local strUtil = require("util.str-util")
local arr = require("util.arr-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

local function getPtKey(pt)
  return string.format("%d %d", pt.x, pt.y)
end

local function parseInput(inputLines)
  local trailHeads = {}
  local destPts = {}
  local grid = {}
  local width = 0
  local height = 0
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
      elseif n == 9 then
        table.insert(destPts, {
          x = x,
          y = y,
        })
      end
      width = width + 1
    end
    height = height + 1
  end
  local res = {
    grid = grid,
    trailHeads = trailHeads,
    destPts = destPts,
    width = width,
    height = height,
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

local function hike2(grid, srcPt)
  local paths = {}
  local toVisit = {
    {
      pt = srcPt,
      soFar = {},
    },
  }
  while #toVisit > 0 do
    local currItem = table.remove(toVisit)
    local currPt = currItem.pt
    local currVal = grid[currPt.y][currPt.x]
    -- printf("(%d, %d)\n", currPt.x, currPt.y)
    if currVal == 9 then
      local path = arr.copy(currItem.soFar)
      table.insert(path, currPt)
      table.insert(paths, path)
    else
      local adjPts = getAdjPts(grid, currPt)
      for _, adjPt in ipairs(adjPts) do
        local adjVal = grid[adjPt.y][adjPt.x]
        if (adjVal - currVal) == 1 then
          local nextSoFar = arr.copy(currItem.soFar)
          table.insert(nextSoFar, currPt)
          table.insert(toVisit, {
            pt = adjPt,
            soFar = nextSoFar,
          })
        end
      end
    end
  end
  return paths
end

--[[ 
  535 - correct
]]
local function day10Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  local grid = parsedInput.grid
  local width = parsedInput.width
  local height = parsedInput.height
  local trailHeads = parsedInput.trailHeads
  local destPts = parsedInput.destPts

  local totalScore = 0
  -- trailHeads = { trailHeads[1] }
  for _, hPt in ipairs(trailHeads) do
    --[[ 
      N E S W - Up, Right, Down, Left
    ]]
    -- local adjPts = getAdjPts(grid, width, height, hPt)
    -- for _, adjPt in pairs(adjPts) do
    --   printf("(%s, %s) ", adjPt.x, adjPt.y)
    -- end
    -- printf("\n")
    local currScore = 0
    local paths = hike(grid, hPt)
    -- printf("num paths: %d\n", #paths)
    local destSet = {}
    for _, path in ipairs(paths) do
      -- for _, pt in ipairs(path) do
      --   -- printf("(%d, %d) ", pt.x, pt.y)
      --   printf("%s ", ptToStr(pt))
      --   -- printf("%d ", grid[pt.y][pt.x])
      -- end
      -- printf("%s\n", getPtKey(path[#path]))
      -- printf("\n")
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
}

return day10MainModule
