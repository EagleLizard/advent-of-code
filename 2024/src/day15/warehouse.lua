
local Point = require("geom.point")

local printf = require("util.printf")

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

local MoveCmd = (function ()
  ---@class MoveCmd
  ---@field str string
  ---@field dx integer
  ---@field dy integer
  local MoveCmd = {}
  MoveCmd.__index = MoveCmd

  ---@param str string
  function MoveCmd.new(str)
    local self = setmetatable({}, MoveCmd)
    self.str = str
    self.dx = ((str == ">" and 1) or (str == "<" and -1)) or 0
    self.dy = ((str == "^" and -1) or (str == "v" and 1)) or 0
    return self
  end

  return MoveCmd
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
    grid[self.robot.y][self.robot.x] = "@"

    for y in ipairs(grid) do
      for x in ipairs(grid[y]) do
        printf(grid[y][x])
        if x == #grid[y] then
          printf("\n")
        end
      end
    end
  end

  ---@param moveCmd MoveCmd
  function Warehouse:moveRobot(moveCmd)
    local destX = self.robot.x + moveCmd.dx
    local destY = self.robot.y + moveCmd.dy
    local destVal = self.grid[destY][destX]
    local foundBox = nil
    for _, box in ipairs(self.boxes) do
      if box.x == destX and box.y == destY then
        foundBox = box
        break
      end
    end
    local canMove = false
    if foundBox ~= nil then
      --[[ handle collision ]]
      canMove = self:moveBox(moveCmd, foundBox)
    else
      canMove = destVal == "."
    end
    if canMove then
      self.robot.x = destX
      self.robot.y = destY
    end
    return foundBox
  end

  ---@param moveCmd MoveCmd
  ---@param srcBox Box
  ---@return boolean
  function Warehouse:moveBox(moveCmd, srcBox)
    --[[ see if there's another box in the way ]]
    local canMove = false
    local destX = srcBox.x + moveCmd.dx
    local destY = srcBox.y + moveCmd.dy
    local foundBox = nil
    for _, box in ipairs(self.boxes) do
      if box.x == destX and box.y == destY then
        foundBox = box
        break
      end
    end
    if foundBox == nil then
      --[[ can move if grid val not a wall ]]
      canMove = self.grid[destY][destX] == "."
    else
      canMove = self:moveBox(moveCmd, foundBox)
    end
    if canMove then
      srcBox.x = destX
      srcBox.y = destY
    end
    return canMove
  end

  return Warehouse
end)()

local warehouseModule = {
  Warehouse = Warehouse,
  Box = Box,
  Robot = Robot,
  MoveCmd = MoveCmd,
}

return warehouseModule
