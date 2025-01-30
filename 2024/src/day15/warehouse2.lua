
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
    local canMove = self:checkMoveBox(moveCmd, srcBox)
    if canMove then
      self:checkMoveBox(moveCmd, srcBox, true)
    end
    return canMove
  end

  ---@param moveCmd MoveCmd
  ---@param srcBox Box2
  ---@param commit boolean|nil
  function Warehouse2:checkMoveBox(moveCmd, srcBox, commit)
    local canMove = false
    local destX = srcBox.x + moveCmd.dx
    local destY = srcBox.y + moveCmd.dy
    --[[
      the calculation will be different depending on if
        the box is moving left or right
      if the box is moving up or down, need to check 2 points
    ]]
    if moveCmd.dy == 0 then
      local foundBox = nil
      if moveCmd.dx < 0 then
        --[[ left ]]
        foundBox = arr.find(self.boxes, function(box)
          if box.y ~= destY then
            return false
          end
          return (box.x == destX) or (box.x == destX - 1)
        end)
        -- if foundBox ~= nil then
        --   printf("(%s, %s)\n", foundBox.x, foundBox.y)
        -- end
      elseif moveCmd.dx > 0 then
        foundBox = arr.find(self.boxes, function(box)
          if box.y ~= destY then
            return false
          end
          return (box.x == destX + 1) or (box.x == destX + 2) 
        end)
      end
      if foundBox == nil then
        local destVal
        if moveCmd.dx < 0 then
          destVal = self.grid[destY][destX]
        elseif moveCmd.dy > 0 then
          destVal = self.grid[destY][destX + 1]
        end
        canMove = destVal == "."
      else
        canMove = self:checkMoveBox(moveCmd, foundBox, commit)
      end
    else
      --[[ up or down ]]
      local foundBoxes = {}
      if moveCmd.dy < 0 then
        --[[ up ]]
        foundBoxes = arr.filter(self.boxes, function(box)
          if box.y ~= destY then
            return false
          end
          return box.x == destX or box.x == destX + 1 or box.x == destX - 1
          -- return (box.x >= destX - 1) and (box.x <= destX + 2)
        end)
        if #foundBoxes < 1 then
          canMove = self.grid[destY][destX] == "." and self.grid[destY][destX + 1] == "."
        else
          local moveAcc = true
          for _, foundBox in ipairs(foundBoxes) do
            moveAcc = moveAcc and self:checkMoveBox(moveCmd, foundBox, commit)
          end
          canMove = moveAcc
        end
        -- printf("%d\n", #foundBoxes)
      end
    end
    if canMove and commit then
      srcBox.x = destX
      srcBox.y = destY
    end
    -- printf("canMove: %s\n", canMove)
    return canMove
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
        printf("%s%s", grid[y][x], (x == #grid[y] and "\n") or "")
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
