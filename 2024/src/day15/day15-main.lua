
local Point = require("geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

local Box = (function ()
  local Box = {}
  Box.__index = Box

  ---@class Box
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  function Box.new(x, y)
    local self = setmetatable({}, Box)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    return self
  end

  return Box
end)()

local Robot = (function ()
  local Robot = {}
  Robot.__index = Robot

  ---@class Robot
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  function Robot.new(x, y)
    local self = setmetatable({}, Robot)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    return self
  end

  return Robot
end)()

local function parseInput(inputLines)
  local parseWarehouse = true
  local rawGrid = {}
  local rawMoves = {}
  for _, inputLine in ipairs(inputLines) do
    if parseWarehouse then
      if #inputLine < 1 then
        parseWarehouse = false
      else
        local currRow = {}
        for c in string.gmatch(inputLine, ".") do
          table.insert(currRow, c)
        end
        table.insert(rawGrid, currRow)
      end
    else
      --[[ parse movements ]]
      for c in string.gmatch(inputLine, ".") do
        table.insert(rawMoves, c)
      end
    end
  end

  local grid = {}
  local boxes = {}
  local robot = nil
  for y in ipairs(rawGrid) do
    table.insert(grid, {})
    for x in ipairs(rawGrid[y]) do
      local val = rawGrid[y][x]
      if val == "O" then
        local box = Box.new(x, y)
        table.insert(boxes, box)
      elseif val == "@" then
        if robot ~= nil then
          errorf("Unexpected Robot at (%d, %d), robot already exists", x, y)
        end
        robot = Robot.new(x, y)
      end
      if rawGrid[y][x] == "#" then
        table.insert(grid[y], "#")
      else
        table.insert(grid[y], ".")
      end
    end
  end

  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      printf("%s", grid[y][x])
      if x == #grid[y] then
        printf("\n")
      end
    end
  end

  for _, move in ipairs(rawMoves) do
    printf("%s", move)
  end
  printf("\n")

  local res = {
    grid = grid,
    moves = rawMoves,
  }
  return res
end

local function day15Pt1(inputLines)
  local day15Input = parseInput(inputLines)

  return -1
end

local day15MainModule = {
  day15Pt1 = day15Pt1,
}

return day15MainModule
