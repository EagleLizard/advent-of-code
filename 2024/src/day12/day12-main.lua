
local Point = require("lib.geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

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
  local width = #land[1]
  local height = #land
  local up, right, down, left
  --[[ up ]]
  if pt.y > 1 then
    up = Point:new(pt.x, pt.y - 1)
  end
  --[[ right ]]
  if pt.x < width then
    right = Point:new(pt.x + 1, pt.y)
  end
  --[[ down ]]
  if pt.y < height then
    down = Point:new(pt.x, pt.y + 1)
  end
  --[[ left ]]
  if pt.x > 1 then
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
    if plant.val ~= srcPlant.val then
      return
    end
    local ptKey = getPointKey(plant.point)
    visitedMap[ptKey] = true
    table.insert(regionPlants, plant)
    local adjPts = getAdjPoints(land, plant.point)
    for k, adjPt in pairs(adjPts) do
      local adjPlant = land[adjPt.y][adjPt.x]
      if adjPlant.val == plant.val then
        local adjPtKey = getPointKey(adjPlant.point)
        --[[
          set the current plant's relevant pointers
        ]]
        if k == "up" then
          plant.up = adjPlant
        elseif k == "right" then
          plant.right = adjPlant
        elseif k == "down" then
          plant.down = adjPlant
        elseif k == "left" then
          plant.left = adjPlant
        else
          errorf("Invalid direction: %s", k)
        end
        if not visitedMap[adjPtKey] then
          _getRegion(adjPlant)
        end
      end
    end
  end
  _getRegion(srcPlant)
  return regionPlants
end

local function getPerimeter(region)
  local perimeter = 0
  for _, plant in ipairs(region) do
    --[[ any non-connected edge is a perimeter ]]
    if plant.up == nil then
      perimeter = perimeter + 1
    end
    if plant.right == nil then
      perimeter = perimeter + 1
    end
    if plant.down == nil then
      perimeter = perimeter + 1
    end
    if plant.left == nil then
      perimeter = perimeter + 1
    end
  end
  return perimeter
end

local function getRegions(land)
  local visitedMap = {}
  local regions = {}
  for y in ipairs(land) do
    for x in ipairs(land[y]) do
      local plant = land[y][x]
      if not visitedMap[getPointKey(plant.point)] then
        local region = getRegion(land, plant, visitedMap)
        table.insert(regions, region)
      end
    end
  end
  return regions
end

--[[ 
  1518548 - correct
]]
local function day12Pt1(inputLines)
  local land = parseInput(inputLines)
  local regions = getRegions(land)
  local totalPrice = 0
  for _, region in ipairs(regions) do
    local perimeter = getPerimeter(region)
    local area = #region
    totalPrice = totalPrice + (area * perimeter)
  end
  return totalPrice
end

local day12Module = {
  day12Pt1 = day12Pt1,
}

return day12Module
