
local Point = require("geom.point")
local arr = require("util.arr-util")

local printf = require("util.printf")

-- local _Warehouse = require("day15.warehouse")
-- local Robot = _Warehouse.Robot

local Box2 = (function ()
  ---@class Box2
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  local Box2 = {}
  Box2.__index = Box2

  function Box2.new(x, y)
    local self = setmetatable({}, Box2)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    return self
  end

  return Box2
end)()

local Warehouse2 = (function ()
  ---@class Warehouse2
  ---@field grid string[][]
  ---@field boxes Box2
  ---@field robot Robot
  local Warehouse2 = {}
  Warehouse2.__index = Warehouse2

  function Warehouse2.new(grid, boxes, robot)
    local self = setmetatable({}, Warehouse2)
    self.grid = grid
    self.boxes = boxes
    self.robot = robot
    return self
  end

  ---@param moveCmd MoveCmd
  ---@return Box2|nil
  function Warehouse2:moveRobot(moveCmd)
    local destX = self.robot.x + moveCmd.dx
    local destY = self.robot.y + moveCmd.dy
    local destVal = self.grid[destY][destX]
    local foundBox = arr.find(self.boxes, function(box)
      return box.y == destY and (box.x == destX or (box.x + 1) == destX)
    end)
    local movedBox = nil
    local canMove = false
    if foundBox == nil then
      canMove = self.grid[destY][destX] == "."
    else
      canMove = self:moveBox(moveCmd, foundBox)
    end
    -- printf("canMove: %s\n", canMove)
    if canMove then
      self.robot.x = destX
      self.robot.y = destY
    end
    return movedBox
  end

  ---@param moveCmd MoveCmd
  ---@param srcBox Box2
  function Warehouse2:moveBox(moveCmd, srcBox)
    
  end

  function Warehouse2:print()
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
      grid[box.y][box.x] = "["
      grid[box.y][box.x + 1] = "]"
    end
    --[[ place the robot ]]
    grid[self.robot.y][self.robot.x] = "@"
    for y in ipairs(grid) do
      for x in ipairs(grid[y]) do
        local val = grid[y][x]
        printf("%s%s", val, (x == #grid[y] and "\n") or "")
      end
    end
  end

  return Warehouse2
end)()

local warehouse2Module = {
  Warehouse2 = Warehouse2,
  Box2 = Box2,
}

return warehouse2Module
