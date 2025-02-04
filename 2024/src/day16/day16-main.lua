
local mazeModule = require("day16.maze")
local Maze = mazeModule.Maze
local mazeEnum = mazeModule.mazeEnum
local Point = require("geom.point")

local printf = require("util.printf")

---@param inputLines string[]
---@return { maze: Maze, sPos: Point, ePos: Point }
local function parseInput(inputLines)
  local maze = Maze.new(#inputLines[1], #inputLines)
  local sPos = nil
  local ePos = nil
  for y, inputLine in ipairs(inputLines) do
    local x = 1
    for c in string.gmatch(inputLine, ".") do
      if c == "#" then
        maze:setWall(x, y)
      elseif c == "S" then
        sPos = Point.new(x, y)
      elseif c == "E" then
        ePos = Point.new(x, y)
      end
      x = x + 1
    end
  end
  -- printf(maze:gridStr())
  local res = {
    maze = maze,
    sPos = sPos,
    ePos = ePos,
  }
  return res
end

local directionPoints = {
  Point.new(0, -1), --[[ up ]]
  Point.new(1, 0), --[[ right ]]
  Point.new(0, 1), --[[ down ]]
  Point.new(-1, 0), --[[ left ]]
}
---@param x integer
---@param y integer
---@return { x: integer, y: integer, direction: integer }[]
local function getMoves(x, y)
  local moves = {}
  for i, dPt in ipairs(directionPoints) do
    moves[i] = {
      x = x + dPt.x,
      y = y + dPt.y,
      direction = i,
    }
  end
  return moves
end

---@param maze Maze
---@param sPos Point
---@param ePos Point
local function findPath(maze, sPos, ePos)
  local visited = {}
  for y = 1, maze.height do
    visited[y] = {}
  end
  local grid = maze:gridCopy()
  
  local function helper(x, y, direction, soFar)
    if x == ePos.x and y == ePos.y then
      --[[ valid path found ]]
    end
    printf("(%d, %d) - %s\n", x, y, direction)
    local dpt = directionPoints[direction]
    local nextX = x + dpt.x
    local nextY = y + dpt.y
    local canMove = not visited[y][x] and (grid[y][x] == mazeEnum.tile)
    if canMove then
      --[[ try to move in the direction already facing ]]
      helper(nextX, nextY, direction, soFar)
    else
      --[[ check if we can rotate ]]
    end
  end
  local pathSoFar = {}
  helper(sPos.x, sPos.y, 2, pathSoFar)

end

local function day16Pt1(inputLines)
  local day16Input = parseInput(inputLines)
  local maze = day16Input.maze
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos

  printf("%s\n", maze:gridStr())
  printf("start: (%d, %d)\n", sPos.x, sPos.y)
  printf("end: (%d, %d)\n", ePos.x, ePos.y)

  findPath(maze, sPos, ePos)

  return -1
end

local day16MainModule = {
  day16Pt1 = day16Pt1,
}

return day16MainModule
