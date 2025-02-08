
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
  local res = {
    maze = mazeGraph,
    sPos = sPos,
    ePos = ePos,
  }
  return res
end

local directions = { 1, 2, 3, 4, }

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
  local function helper(node, direction, soFar, score)
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
      table.insert(foundPaths, {
        path = foundPath,
        score = score,
      })
    end
    for _, d in ipairs(directions) do
      local nextNode = node:next(d)
      local cost = 1 + ((d ~= direction and 1000) or 0)
      local nextScore = score + cost
      table.insert(soFar, {
        node = node,
        direction = direction,
      })
      helper(nextNode, d, soFar, nextScore)
      table.remove(soFar)
    end
    visited[node.id] = nil
  end
  local pathSoFar = {}
  helper(sNode, 2, pathSoFar, 0)
  return foundPaths
end

--[[ bfs ]]
---@param maze MazeGraph
---@param sPos Point
---@param ePos Point
---@return { node: MazeNode, direction: integer, cost: integer }[]
local function findPath(maze, sPos, ePos)
  local queue = {}
  local visited = {}
  local sNode = maze.nodeGrid[sPos.y][sPos.x]
  local eNode = maze.nodeGrid[ePos.y][ePos.x]
  table.insert(queue, {
    node = sNode,
    direction = 2,
    pathSoFar = {},
    cost = 0,
  })
  local foundPath = {}
  while #queue > 0 do
    --[[ find the smallest node to visit next ]]
    local minCost = math.huge
    local minCostIdx = nil
    for i, qNode in ipairs(queue) do
      if qNode.cost < minCost then
        minCost = qNode.cost
        minCostIdx = i
      end
    end
    -- local curr = table.remove(queue, minCostIdx)
    local curr = table.remove(queue)
    local node = curr.node
    local pathSoFar = curr.pathSoFar
    local direction = curr.direction
    local cost = curr.cost
    if node.x == eNode.x and node.y == eNode.y then
      foundPath = pathSoFar
      table.insert(foundPath, {
        node = node,
        direction = direction,
        cost = cost,
      })
      break
    end
    -- for i, sf in ipairs(pathSoFar) do
    --   printf("(%d, %d)%s", sf.node.x, sf.node.y, (i == #pathSoFar and "\n") or " ")
    -- end
    visited[node.id] = true
    for _, d in ipairs(directions) do
      local nextNode = node:next(d)
      if nextNode ~= nil and not visited[nextNode.id] then
        -- printf("(%d, %d)\n", nextNode.x, nextNode.y)
        local nextSoFar = arr.copy(pathSoFar)
        -- local nextCost = 1 + ((d == direction and 0) or 1000)
        local nextCost = 1
        table.insert(nextSoFar, {
          node = node,
          direction = direction,
          cost = cost,
        })
        table.insert(queue, {
          node = nextNode,
          direction = d,
          pathSoFar = nextSoFar,
          cost = nextCost,
        })
      end
    end
  end
  -- printf(maze:gridStr(visited))
  return foundPath
end

local function getMinDistIdx(q, dist, spt)
  local min = math.huge
  local minIdx = -1
  for i, node in ipairs(q) do
    if spt[node.id] == false and dist[node.id] <= min then
      min = dist[node.id]
      minIdx = i
    end
  end
  return minIdx
end

---@param maze MazeGraph
---@param sPos Point
---@param ePos Point
local function findPath2(maze, sPos, ePos)
  local dist = {}
  local spt = {}
  local prev = {}
  local sNode = maze.nodeGrid[sPos.y][sPos.x]
  local q = {}
  for _, node in ipairs(maze.nodes) do
    dist[node.id] = math.huge
    spt[node.id] = false
    table.insert(q, node)
  end
  dist[sNode.id] = 0
  local direction = 2
  while #q do
    local u = getMinDistIdx(q, dist, spt)
    if u == -1 then
      break
    end
    local uNode = table.remove(q, u)
    spt[uNode.id] = true
    for _, d in ipairs(directions) do
      local adj = uNode:next(d)
      if adj ~= nil and not spt[adj.id] then
        local pNode = prev[uNode.id]
        local dx = adj.x - uNode.x
        local dy = adj.y - uNode.y
        if pNode ~= nil then
          dx = adj.x - pNode.x
          dy = adj.y - pNode.y
        end
        --[[ 
          if it's the first node, a turn occurs if the direction
            differs from the initial direction
        ]]
        local turn = (
          ((uNode.id == sNode.id) and (d ~= direction))
          or (dx ~= 0 and dy ~= 0)
        )
        local alt = dist[uNode.id] + (1 + ((turn and 1000) or 0))
        if alt < dist[adj.id] then
          dist[adj.id] = alt
          prev[adj.id] = uNode
        end
      end
    end
  end
  local foundPath = {}
  local node = maze.nodeGrid[ePos.y][ePos.x]
  if prev[node.id] ~= nil then
    while node ~= nil do
      table.insert(foundPath, 1, node)
      node = prev[node.id]
    end
  end
  for i, pathPt in ipairs(foundPath) do
    printf("(%d, %d)%s", pathPt.x, pathPt.y, (i == #foundPath and "\n") or " ")
  end
  printf("cost: %d\n", dist[maze.nodeGrid[ePos.y][ePos.x].id])
end

--[[ 
88472 - incorrect, too high
]]
local function day16Pt1(inputLines)
  local day16Input = parseInput2(inputLines)
  local maze = day16Input.maze
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos

  local minPath = findPath2(maze, sPos, ePos)

  local minPath = findPath(maze, sPos, ePos)
  local minScore = 0
  for _, pathPt in ipairs(minPath) do
    -- printf("(%d, %d) d:%d, c:%d\n", pathPt.node.x, pathPt.node.y, pathPt.direction, pathPt.cost)
    minScore = minScore + pathPt.cost
  end
  printf("minPath: %d\n", minScore)
  printf(maze:pathStr(minPath))

  local paths = findPaths2(maze, sPos, ePos)
  local minScore = math.huge
  for i, foundPath in ipairs(paths) do
    -- printf("%d: %d\n", i, foundPath.score)
    if foundPath.score < minScore then
      minScore = foundPath.score
    end
  end
  printf("numPaths: %d\n", #paths)
  return minScore
  -- return -1
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
