
local arr = require("util.arr-util")

local mazeModule = require("day16.maze")
local Maze = mazeModule.Maze
local mazeEnum = mazeModule.mazeEnum
local mazeCharMap = mazeModule.mazeCharMap
local mazeGraphModule = require("day16.maze-graph")
local MazeGraph = mazeGraphModule.MazeGraph
local MazeNode = mazeGraphModule.MazeNode
local Point = require("geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

local DEBUG = false
DEBUG = true

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
  local rawGrid = maze:gridCopy()
  -- for _, pathPt in ipairs(path) do
  --   rawGrid[pathPt.y][pathPt.x] = 3
  -- end
  local charGrid = {}
  for y in ipairs(rawGrid) do
    local row = {}
    for x in ipairs(rawGrid[y]) do
      table.insert(row, mazeCharMap[rawGrid[y][x]])
    end
    table.insert(charGrid, row)
  end
  local arrows = { "^", ">", "v", "<", }
  for _, pathStep in ipairs(path) do
    charGrid[pathStep.y][pathStep.x] = arrows[pathStep.direction]
  end
  local gridStr = ""
  for y in ipairs(charGrid) do
    for _, c in ipairs(charGrid[y]) do
      gridStr = gridStr..c
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
---@return { x: integer, y: integer, direction: integer }[]
local function findPaths(maze, sPos, ePos)
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
    end
    for i, dpt in ipairs(directionPoints) do
      local nx = x + dpt.x
      local ny = y + dpt.y
      local nd = i
      table.insert(soFar, {
        x = x,
        y = y,
        direction = i,
      })
      helper(nx, ny, nd, soFar)
      table.remove(soFar)
    end
    visited[y][x] = nil
  end
  local pathSoFar = {}
  helper(sPos.x, sPos.y, 2, pathSoFar)
  return foundPaths
end

local function getPathScore(path)
  local currDirection = 2
  local score = 0
  for _, pathStep in ipairs(path) do
    score = score + 1
    if pathStep.direction ~= currDirection then
      --[[ rotation happened ]]
      score = score + 1000
      currDirection = pathStep.direction
    end
  end
  return score
end

---@param inputLines string[]
---@return { maze: MazeGraph, sPos: Point, ePos: Point }
local function parseInput2(inputLines)
  local grid = {}
  local sPos = nil
  local ePos = nil
  for y in ipairs(inputLines) do
    local x = 1
    local row = {}
    for c in string.gmatch(inputLines[y], ".") do
      if c == "#" then
        row[x] = mazeEnum.wall
      else
        row[x] = mazeEnum.tile
      end
      if c == "S" then
        sPos = Point.new(x, y)
      elseif c == "E" then
        ePos = Point.new(x, y)
      end
      x = x + 1
    end
    table.insert(grid, row)
  end
  if sPos == nil then
    return errorf("Missing start pos")
  end
  if ePos == nil then
    return errorf("Missing end pos")
  end
  local mazeGraph = MazeGraph.new(grid, sPos, ePos)
  local nodeGrid = mazeGraph.nodeGrid
  local res = {
    maze = mazeGraph,
    sPos = sPos,
    ePos = ePos,
  }
  return res
end

---@param maze MazeGraph
---@param sPos Point
---@param ePos Point
local function findPaths2(maze, sPos, ePos)
  local foundPaths = {}
  local visited = {}
  local sNode = maze.nodeGrid[sPos.y][sPos.x]
  local eNode = maze.nodeGrid[ePos.y][ePos.x]

  ---@param node MazeNode|nil
  ---@param direction integer
  ---@param soFar any
  local function helper(node, direction, soFar)
    if node == nil or visited[node.id] then
      return
    end
    visited[node.id] = true
    if node.x == eNode.x and node.y == eNode.y then
      --[[ validPath found ]]
      local foundPath = {}
      for i, v in ipairs(soFar) do
        foundPath[i] = v
      end
      table.insert(foundPaths, foundPath)
    end
    table.insert(soFar, {
      node = node,
      direction = direction,
    })
    -- helper(node.up, 1, soFar)
  end
  local pathSoFar = {}
  helper(sNode, 2, pathSoFar)
end

local function day16Pt1(inputLines)
  local day16Input = parseInput2(inputLines)
  local maze = day16Input.maze
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos
  local paths = findPaths2(maze, sPos, ePos)
  return -1
end

local function day16Pt1_2(inputLines)
  local day16Input = parseInput(inputLines)
  local maze = day16Input.maze
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos

  if DEBUG then
    printf("%s\n", maze:gridStr())
    printf("start: (%d, %d)\n", sPos.x, sPos.y)
    printf("end: (%d, %d)\n", ePos.x, ePos.y)
  end
  local foundPaths = findPaths(maze, sPos, ePos)
  local scores = {}
  local minScore = math.huge
  for _, foundPath in ipairs(foundPaths) do
    local score = getPathScore(foundPath)
    if score < minScore then
      minScore = score
    end
    table.insert(scores, score)
  end
  if DEBUG then
    for i, score in ipairs(scores) do
      if score == minScore then
        printf(gridPathStr(maze, foundPaths[i]))
        printf("score: %d\n", score)
      end
    end
  end
  -- printf("num paths: %d\n", #foundPaths or 0)
  return minScore
  -- return -1
end

local day16MainModule = {
  day16Pt1 = day16Pt1,
}

return day16MainModule
