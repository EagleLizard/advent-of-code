
local Point = require("geom.point")

local printf = require("util.printf")

local Box2 = (function ()
  ---@class Box2
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  ---@field id integer
  local Box2 = {}
  Box2.__index = Box2

  local idCounter = 1

  function Box2.new(x, y)
    local self = setmetatable({}, Box2)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    self.id = idCounter
    idCounter = idCounter + 1
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
    local foundBox = nil
    for _, box in ipairs(self.boxes) do
      if box.y == destY and (box.x == destX or (box.x + 1) == destX) then
        foundBox = box
        break
      end
    end
    -- local foundBox = arr.find(self.boxes, function(box)
    --   return box.y == destY and (box.x == destX or (box.x + 1) == destX)
    -- end)
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
      for _, box in pairs(boxesToMove) do
        box.x = box.x + moveCmd.dx
        box.y = box.y + moveCmd.dy
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
      local wallHit = false
      --[[ check if a wall is in the way ]]
      if up then
        wallHit = (
          (self.grid[_srcBox.y - 1][_srcBox.x] ~= "#")
          and (self.grid[_srcBox.y - 1][_srcBox.x + 1] ~= "#")
        )
      elseif right then
        wallHit = self.grid[_srcBox.y][_srcBox.x + 2] ~= "#"
      elseif down then
        wallHit = (
          (self.grid[_srcBox.y + 1][_srcBox.x] ~= "#")
          and (self.grid[_srcBox.y + 1][_srcBox.x + 1] ~= "#")
        )
      elseif left then
        wallHit = self.grid[_srcBox.y][_srcBox.x - 1] ~= "#"
      end
      --[[
        if the box is going to move into a wall we can return early
      ]]
      if not wallHit then
        return false
      end
      local foundBoxes = {}
      --[[ 
        find any boxes in the way
      ]]
      for _, box in ipairs(self.boxes) do
        if up then
          if box.y == (_srcBox.y - 1) and (box.x >= (_srcBox.x - 1) and box.x <= (_srcBox.x + 1)) then
            table.insert(foundBoxes, box)
          end
        elseif right then
          if (box.y == _srcBox.y) and (box.x == (_srcBox.x + 2)) then
            table.insert(foundBoxes, box)
          end
        elseif down then
          if box.y == (_srcBox.y + 1) and (box.x >= (_srcBox.x - 1) and box.x <= (_srcBox.x + 1)) then
            table.insert(foundBoxes, box)
          end
        elseif left then
          if (box.y == _srcBox.y) and (box.x == (_srcBox.x - 2)) then
            table.insert(foundBoxes, box)
          end
        end
      end
      --[[
        recursively check if any boxes in the way can be moved
      ]]
      local _canMove = true
      for _, foundBoxes in ipairs(foundBoxes) do
        _canMove = _checkMove(foundBoxes)
        if not _canMove then
          break
        end
      end
      if not _canMove then
        return false
      end
      --[[
        add to the list of boxes to moved only if the box
          isn't already in the list of boxes to move
      ]]
      boxesToMove[_srcBox.id] = _srcBox 
      return true
    end
    local canMove = _checkMove(srcBox)
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
