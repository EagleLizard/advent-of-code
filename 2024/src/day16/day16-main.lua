
local mazeModule = require("day16.maze")
local Maze = mazeModule.Maze
local mazeEnum = mazeModule.mazeEnum
local mazeCharMap = mazeModule.mazeCharMap
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

local function gridPathStr(maze, path)
  local grid = maze:gridCopy()
  for _, pathPt in ipairs(path) do
    grid[pathPt.y][pathPt.x] = 3
  end
  local gridStr = ""
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      local val = grid[y][x]
      if mazeCharMap[val] ~= nil then
        gridStr = gridStr..mazeCharMap[val]
      else
        gridStr = gridStr.."o"
      end
    end
    gridStr = gridStr.."\n"
  end
  return gridStr
end

local directionPoints = {
  Point.new(0, -1), --[[ up ]]
  Point.new(1, 0), --[[ right ]]
  Point.new(0, 1), --[[ down ]]
  Point.new(-1, 0), --[[ left ]]
}

---@param maze Maze
---@param sPos Point
---@param ePos Point
local function findPath(maze, sPos, ePos)
  local visited = {}
  for y = 1, maze.height do
    visited[y] = {}
  end
  local grid = maze:gridCopy()
  local foundPaths = {}
  local function helper(x, y, direction, soFar)
    if visited[y][x] or (grid[y][x] ~= mazeEnum.tile) then
      return
    end
    visited[y][x] = true
    if x == ePos.x and y == ePos.y then
      --[[ valid path found ]]
      local foundPath = {}
      for i, v in ipairs(soFar) do
        foundPath[i] = v
      end
      table.insert(foundPaths, foundPath)
      return
    end
    for i, dpt in ipairs(directionPoints) do
      local nx = x + dpt.x
      local ny = y + dpt.y
      local nd = i
      table.insert(soFar, {
        x = nx,
        y = ny,
        direction = nd,
      })
      helper(nx, ny, nd, soFar)
      table.remove(soFar)
    end
  end
  local pathSoFar = {}
  helper(sPos.x, sPos.y, 2, pathSoFar)
  for _, foundPath in ipairs(foundPaths) do
    printf(gridPathStr(maze, foundPath))
  end
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
