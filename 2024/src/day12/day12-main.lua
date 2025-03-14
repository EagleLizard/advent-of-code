
local Point = require("lib.geom.point")
local strUtil = require("util.str-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

local Plant = (function ()
  local Plant = {}
  Plant.__index = Plant
  
  function Plant:new(val, x, y)
    local self = setmetatable({}, Plant)
    self.val = val
    self.point = Point.new(x, y)

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
    up = Point.new(pt.x, pt.y - 1)
  end
  --[[ right ]]
  if pt.x < width then
    right = Point.new(pt.x + 1, pt.y)
  end
  --[[ down ]]
  if pt.y < height then
    down = Point.new(pt.x, pt.y + 1)
  end
  --[[ left ]]
  if pt.x > 1 then
    left = Point.new(pt.x - 1, pt.y)
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

local function getSides(region)
  local minX = math.huge
  local minY = math.huge
  local maxX = -math.huge
  local maxY = -math.huge
  for _, plant in ipairs(region) do
    minX = math.min(minX, plant.point.x)
    minY = math.min(minY, plant.point.y)
    maxX = math.max(maxX, plant.point.x)
    maxY = math.max(maxY, plant.point.y)
  end
  --[[
    plot region on its own isolated land
  ]]
  local land = {}
  for y = minY, maxY do
    table.insert(land, {})
    for x = minX, maxX do
      table.insert(land[y - minY + 1], Plant:new(nil, -1, -1))
    end
    -- printf("\n")
  end
  for _, plant in ipairs(region) do
    local plantX = plant.point.x - minX + 1
    local plantY = plant.point.y - minY + 1
    land[plantY][plantX] = plant
  end
  local upSides = 0
  local downSides = 0
  for y in ipairs(land) do
    local uLine = false
    local dLine = false
    for x in ipairs(land[y]) do
      local currElem = land[y][x]
      if (currElem.val == nil or currElem.up ~= nil) and uLine then
        upSides = upSides + 1
        uLine = false
      elseif currElem.val ~= nil and currElem.up == nil then
        uLine = true
      end
      if (currElem.val == nil or currElem.down ~= nil) and dLine then
        downSides = downSides + 1
        dLine = false
      elseif currElem.val ~= nil and currElem.down == nil then
        dLine = true
      end
      -- printf("%s", land[y][x])
    end
    -- printf("uLine: %s\n", uLine)
    if uLine then
      upSides = upSides + 1
    end
    if dLine then
      downSides = downSides + 1
    end
    -- printf("\n")
  end
  local width = #land[1]
  local height = #land
  local rightSides = 0
  local leftSides = 0
  for x = 1, width do
    local rLine = false
    local lLine = false
    for y = 1, height do
      local currElem = land[y][x]
      if (currElem.val == nil or currElem.left ~= nil) and lLine then
        leftSides = leftSides + 1
        lLine = false
      elseif currElem.val ~= nil and currElem.left == nil then
        lLine = true
      end
      if (currElem.val == nil or currElem.right ~= nil) and rLine then
        rightSides = rightSides + 1
        rLine = false
      elseif currElem.val ~= nil and currElem.right == nil then
        rLine = true
      end
    end
    if lLine then
      leftSides = leftSides + 1
    end
    if rLine then
      rightSides = rightSides + 1
    end
  end
  local allSides = upSides + downSides + leftSides + rightSides
  return allSides
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
--[[ 
  844704 - incorrect, too low
  909564 - correct
]]
local function day12Pt2(inputLines)
  local land = parseInput(inputLines)
  local regions = getRegions(land)
  local totalPrice = 0
  for _, region in ipairs(regions) do
    local sides = getSides(region)
    local area = #region
    totalPrice = totalPrice + (area * sides)
  end
  return totalPrice
end

local day12Module = {
  day12Pt1 = day12Pt1,
  day12Pt2 = day12Pt2,
}

return day12Module
