
local Point = require("geom.point")
local arr = require("util.arr-util")

local printf = require("util.printf")

-- local _Warehouse = require("day15.warehouse")
-- local Robot = _Warehouse.Robot

-- local DEBUG = false
local DEBUG = true

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
  function Warehouse2:moveRobot(moveCmd, moveCount)
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
      canMove = self:moveBox(moveCmd, foundBox, moveCount)
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
  function Warehouse2:moveBox(moveCmd, srcBox, moveCount)
    local boxesToMove = self:checkMove(moveCmd, srcBox)
    if boxesToMove ~= nil then
      --[[ move ]]
      if DEBUG then
        printf("\n%s   %d\n", moveCmd.str, moveCount or -1)
      end
      for i, box in ipairs(boxesToMove) do
        if DEBUG then
          printf("(%d, %d)%s", box.x, box.y, (i == #boxesToMove and "\n") or ", ")
        end
        box.x = box.x + moveCmd.dx
        box.y = box.y + moveCmd.dy
      end
      if DEBUG then
        self:print()
      end
    end
    return boxesToMove ~= nil
  end
  ---@param moveCmd MoveCmd
  ---@param srcBox Box2
  ----@returns boxesToMove Box2[]|nil
  function Warehouse2:checkMove(moveCmd, srcBox)
    local boxesToMove = {}
    local up = moveCmd.dy < 0
    local right = moveCmd.dx > 0
    local down = moveCmd.dy > 0
    local left = moveCmd.dx < 0
    --[[ helper ]]
    ---@param _srcBox Box2
    local function _checkMove(_srcBox)
      local foundBoxes = arr.filter(self.boxes, function(box)
        if up then
          return box.y == (_srcBox.y - 1) and (box.x >= (_srcBox.x - 1) and box.x <= (_srcBox.x + 1))
        elseif right then
          return (box.y == _srcBox.y) and (box.x == (_srcBox.x + 2))
        elseif down then
          return box.y == (_srcBox.y + 1) and (box.x >= (_srcBox.x - 1) and box.x <= (_srcBox.x + 1))
        elseif left then
          return (box.y == _srcBox.y) and (
            -- (box.x == (_srcBox.x - 1))
            (box.x == (_srcBox.x - 2))
          )
        end
        return false
      end)
      local _canMove = false
      -- if #foundBoxes < 1 then
        --[[ check if a wall is in the way ]]
        if up then
          _canMove = (
            (self.grid[_srcBox.y - 1][_srcBox.x] ~= "#")
            and (self.grid[_srcBox.y - 1][_srcBox.x + 1] ~= "#")
          )
        elseif right then
          _canMove = self.grid[_srcBox.y][_srcBox.x + 2] ~= "#"
        elseif down then
          _canMove = (
            (self.grid[_srcBox.y + 1][_srcBox.x] ~= "#")
            and (self.grid[_srcBox.y + 1][_srcBox.x + 1] ~= "#")
          )
        elseif left then
          _canMove = self.grid[_srcBox.y][_srcBox.x - 1] ~= "#"
        end
      -- else
      if _canMove then
        --[[ recursively check found boxes ]]
        _canMove = arr.every(foundBoxes, function (currBox)
          return _checkMove(currBox)
        end)
      end
      -- end
      if _canMove then
        table.insert(boxesToMove, _srcBox)
      end
      return _canMove
    end
    local canMove = _checkMove(srcBox)
    -- if canMove then
    --   for i, box in ipairs(boxesToMove) do
    --     -- printf("(%d, %d), %s", box.x, box.y, (i == #boxesToMove and "\n") or "")
    --   end
    -- end
    if canMove then
      return boxesToMove
    end
    return nil
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
      if grid[box.y][box.x] ~= "#" then
        grid[box.y][box.x] = "["
      end
      if grid[box.y][box.x + 1] ~= "#" then
        grid[box.y][box.x + 1] = "]"
      end
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
