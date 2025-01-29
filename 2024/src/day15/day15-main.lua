
local Point = require("geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

local Box = (function ()
  ---@class Box
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  local Box = {}
  Box.__index = Box

  ---@param x integer
  ---@param y integer
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
  ---@class Robot
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  local Robot = {}
  Robot.__index = Robot

  ---@param x integer
  ---@param y integer
  function Robot.new(x, y)
    local self = setmetatable({}, Robot)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    return self
  end

  return Robot
end)()

local Warehouse = (function ()
  ---@class Warehouse
  ---@field grid string[][]
  ---@field boxes Box[]
  ---@field robot Robot
  local Warehouse = {}
  Warehouse.__index = Warehouse

  ---@param grid string[][]
  ---@param boxes Box[]
  ---@param robot Robot
  function Warehouse.new(grid, boxes, robot)
    local self = setmetatable({}, Warehouse)
    self.grid = grid
    self.boxes = boxes
    self.robot = robot
    return self
  end

  function Warehouse:print()
    --[[ copy the grid ]]
    local grid = {}
    for y in ipairs(self.grid) do
      grid[y] = {}
      for x, v in ipairs(self.grid[y]) do
        grid[y][x] = v
      end
    end
    --[[ place the boxes ]]
    for _, box in ipairs(self.boxes) do
      grid[box.y][box.x] = "O"
    end
    --[[ place the robot ]]
    grid[self.robot.y][self.robot.y] = "@"

    for y in ipairs(grid) do
      for x in ipairs(grid[y]) do
        printf(grid[y][x])
        if x == #grid[y] then
          printf("\n")
        end
      end
    end
  end

  return Warehouse
end)()

---@param inputLines string[]
---@return { grid: string[][], boxes: Box[], robot: Robot, moves: string[] }
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
    boxes = boxes,
    robot = robot,
    moves = rawMoves,
  }
  return res
end

local function day15Pt1(inputLines)
  local day15Input = parseInput(inputLines)
  local grid = day15Input.grid
  local boxes = day15Input.boxes
  local robot = day15Input.robot
  local moves = day15Input.moves
  local wh = Warehouse.new(grid, boxes, robot)

  for _, move in ipairs(moves) do
    local dx = ((move == "<" and -1) or (move == ">" and 1)) or 0
    local dy = ((move == "^" and -1) or (move == "v" and 1)) or 0
    local destX = wh.robot.x + dx
    local destY = wh.robot.y + dy
    local destVal = wh.grid[destY][destX]
    printf("%s\n", move)
    -- if destVal ~= "#" then
    --   robot.x = destX
    --   robot.y = destY
    -- end
    wh:print()
    -- printWarehouse(grid, boxes, robot)
  end
  return -1
end

local day15MainModule = {
  day15Pt1 = day15Pt1,
}

return day15MainModule
