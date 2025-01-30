
local printf = require("util.printf")
local errorf = require("util.errorf")

local _warehouseModule = require("day15.warehouse")
local Warehouse = _warehouseModule.Warehouse
local Box = _warehouseModule.Box
local Robot = _warehouseModule.Robot
local MoveCmd = _warehouseModule.MoveCmd


---@param inputLines string[]
---@return { grid: string[][], boxes: Box[], robot: Robot, moveCmds: MoveCmd[] }
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
  local moveCmds = {}
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

  for _, move in ipairs(rawMoves) do
    table.insert(moveCmds, MoveCmd.new(move))
  end

  local res = {
    grid = grid,
    boxes = boxes,
    robot = robot,
    moveCmds = moveCmds,
  }
  return res
end

--[[ 
1430439 - correct
]]
local function day15Pt1(inputLines)
  local day15Input = parseInput(inputLines)
  local grid = day15Input.grid
  local boxes = day15Input.boxes
  local robot = day15Input.robot
  local wh = Warehouse.new(grid, boxes, robot)
  local moveCmds = day15Input.moveCmds

  local boxMoveCount = 0

  for _, moveCmd in ipairs(moveCmds) do
    local foundBox = wh:moveRobot(moveCmd)
    if foundBox ~= nil then
      boxMoveCount = boxMoveCount + 1
    end
  end
  local gpsSum = 0
  for _, box in ipairs(wh.boxes) do
    local currGps = (box.x - 1) + (100 * (box.y - 1))
    gpsSum = gpsSum + currGps
  end
  return gpsSum
end

local day15MainModule = {
  day15Pt1 = day15Pt1,
}

return day15MainModule
