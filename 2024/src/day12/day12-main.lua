
local Point = require("lib.geom.point")

local printf = require("util.printf")

local Plant = (function ()
  local Plant = {}
  Plant.__index = Plant
  
  function Plant:new(val, x, y)
    local self = setmetatable({}, Plant)
    self.val = val
    self.point = Point:new(x, y)

    self.up = nil
    self.right = nil
    self.down = nil
    self.left = nil
    return self
  end
  return Plant
end)()


local function parseInput(inputLines)
  local land = {}
  for y, inputLine in ipairs(inputLines) do
    table.insert(land, {})
    for x = 1, #inputLine do
      local c = string.sub(inputLine, x, x)
      local plant = Plant:new(c, x, y)
      table.insert(land[y], plant)
    end
  end
  return land
end 

local function getPointKey(point)
  return point.x.." "..point.y
end

local function getAdjPoints(land, pt)
  local adjPts = {}
  local width = #land[1]
  local height = #land
  local up, right, down, left
  --[[ up, right, down, left ]]
  --[[ up ]]
  if pt.y > 1 then
    -- table.insert(adjPts, Point:new(pt.x, pt.y - 1))
    up = Point:new(pt.x, pt.y - 1)
  end
  --[[ right ]]
  if pt.x < width then
    -- table.insert(adjPts, Point:new(pt.x + 1, pt.y))
    right = Point:new(pt.x + 1, pt.y)
  end
  --[[ down ]]
  if pt.y < height then
    -- table.insert(adjPts, Point:new(pt.x, pt.y + 1))
    down = Point:new(pt.x, pt.y + 1)
  end
  --[[ left ]]
  if pt.x > 1 then
    table.insert(adjPts, Point:new(pt.x - 1, pt.y))
    left = Point:new(pt.x - 1, pt.y)
  end
  -- return adjPts
  return {
    up = up,
    right = right,
    down = down,
    left = left,
  }
end

local function getRegion(land, srcPlant, visitedMap)
  local regionPlants = {}
  --[[ helper ]]
  local function _getRegion(plant)
    local ptKey = getPointKey(plant.point)
    if plant.val == srcPlant.val and not visitedMap[ptKey] then
      visitedMap[ptKey] = true
      table.insert(regionPlants, plant)
      local adjPts = getAdjPoints(land, plant.point)
      for _, adjPt in pairs(adjPts) do
        _getRegion(land[adjPt.y][adjPt.x])
      end
    end
  end
  _getRegion(srcPlant)
  return regionPlants
end

local function getRegions(land)
  local visitedMap = {}
  for y, row in ipairs(land) do
    for x in ipairs(land[y]) do
      local plant = land[y][x]
      -- printf("%s%s", plant.val, (x == #row and "\n") or " ")
      -- connect adj
      if not visitedMap[getPointKey(plant.point)] then
        printf("%s ", plant.val)
        local region = getRegion(land, plant, visitedMap)
        for i, plant in ipairs(region) do
          printf("(%d, %d)%s", plant.point.x, plant.point.y, (i == #region and "\n") or " ")
        end
      end
    end
  end
end

local function day12Pt1(inputLines)
  local land = parseInput(inputLines)
  local regions = getRegions(land)
  return -1
end

local day12Module = {
  day12Pt1 = day12Pt1,
}

return day12Module
