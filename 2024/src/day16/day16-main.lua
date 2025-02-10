
local arr = require("util.arr-util")

local Point = require("geom.point")
local priorityQueueModule = require("util.priority-queue")
local PriorityQueue = priorityQueueModule.PriorityQueue

local printf = require("util.printf")

local DEBUG = false
-- DEBUG = true

---@param inputLines string[]
---@return { grid: string[][], sPos: Point, ePos: Point }
local function parseInput(inputLines)
  local grid = {}
  local sPos = nil
  local ePos = nil
  for y, inputLine in ipairs(inputLines) do
    local x = 1
    local row = {}
    for c in string.gmatch(inputLine, ".") do
      if c == "#" then
        row[x] = "#"
      else
        row[x] = "."
      end
      if c == "S" then
        sPos = Point.new(x, y)
      elseif c == "E" then
        ePos = Point.new(x, y)
      end
      x = x + 1
    end
    grid[y] = row
  end
  local res = {
    grid = grid,
    sPos = sPos,
    ePos = ePos,
  }
  return res
end

local function getVisitedKey(x, y, d)
  return string.format("%s,%s,%s", x, y, d)
end

local directions = {1, 2, 3, 4,}
local directionPoints = {
  Point.new(0, -1), --[[ up ]]
  Point.new(1, 0), --[[ right ]]
  Point.new(0, 1), --[[ down ]]
  Point.new(-1, 0), --[[ left ]]
}

---@param grid string[][]
---@param sPos Point
---@param ePos Point
---@return nil|{ path: {x: integer, y: integer, d: integer}[], cost: integer }
local function findPath(grid, sPos, ePos)
  local pq = PriorityQueue.new()
  pq:insert(0, {
    x = sPos.x,
    y = sPos.y,
    d = 2,
    soFar = {
      {
        x = sPos.x,
        y = sPos.y,
        d = 2,
      }
    }
  })
  local visited = {}
  local res = nil
  while not pq:empty() do
    local curr = pq:pullMin()
    local cost = curr.p
    local x = curr.val.x
    local y = curr.val.y
    local d = curr.val.d
    local soFar = curr.val.soFar
    local currVKey = getVisitedKey(x, y, d)
    if x == ePos.x and y == ePos.y then
      --[[ found end ]]
      -- for i, sfPt in ipairs(soFar) do
      --   printf("(%d, %d) %d%s", sfPt.x, sfPt.y, sfPt.d, (i == #soFar and "\n") or ", ")
      -- end
      -- return soFar
      res = {
        path = soFar,
        cost = cost,
      }
      break
    end
    if visited[currVKey] == nil or (visited[currVKey] and visited[currVKey] > cost) then
      -- printf("%d (%d, %d), d: %d\n", cost, x, y, d)
      visited[currVKey] = cost
      for nd, ndp in ipairs(directionPoints) do
        local nx = x + ndp.x
        local ny = y + ndp.y
        if grid[ny][nx] == "." then
          local nCost = cost + 1
          local nSoFar = arr.copy(soFar)
          -- table.insert(nSoFar, Point.new(nx, ny))
          table.insert(nSoFar, {
            x = nx,
            y = ny,
            d = nd,
          })
          if d ~= nd then
            nCost = nCost + 1000
          end
          pq:insert(nCost, {
            x = nx,
            y = ny,
            d = nd,
            soFar = nSoFar,
          })
        end
      end
    end
  end
  return res
end

local function gridStr(srcGrid, path)
  --[[ copy grid ]]
  local grid = {}
  for y in ipairs(srcGrid) do
    local row = {}
    for x in ipairs(srcGrid[y]) do
      row[x] = srcGrid[y][x]
    end
    grid[y] = row
  end
  local arrows = { "^", ">", "v", "<" }
  if path ~= nil then
    for _, pathPt in ipairs(path) do
      grid[pathPt.y][pathPt.x] = arrows[pathPt.d]
    end
  end
  local gridStr = ""
  for y in ipairs(grid) do
    for x, c in ipairs(grid[y]) do
      gridStr = gridStr..c
      if x == #grid[y] then
        gridStr = gridStr.."\n"
      end
    end
  end
  return gridStr
end

---@param x integer
---@param y integer
---@return string
local function getPtKey(x, y)
  return string.format("%d,%d", x, y)
end

---@param srcGrid string[][]
---@param seatPts {[string]: Point}
-- ---@param seatPts {[integer]: {[integer]: boolean}}
local function gridSeatStr(srcGrid, seatPts)
  local gridStr = ""
  for y in ipairs(srcGrid) do
    -- local row = {}
    for x in ipairs(srcGrid[y]) do
      local ptKey = getPtKey(x, y)
      local c = (seatPts[ptKey] and "o") or srcGrid[y][x]
      gridStr = gridStr..c
    end
    gridStr = gridStr.."\n"
  end
  return gridStr
end

--[[ dfs ]]
---@param grid string[][]
---@param sPos Point
---@param ePos Point
---@param costLimit integer
local function findPaths(grid, sPos, ePos, costLimit)
  ---@type {x: integer, y: integer, d: integer}[]
  local foundPaths = {}
  local visited = {}
  for y = 1, #grid do
    visited[y] = {}
  end
  ---@param x integer
  ---@param y integer
  ---@param d integer
  ---@param cost integer
  ---@param soFar {x: integer, y: integer, d: integer, cost: integer}[]
  local function helper(x, y, d, cost, soFar)
    if x == ePos.x and y == ePos.y then
      --[[ valid path found ]]
      local foundPath = {}
      for i, v in ipairs(soFar) do
        foundPath[i] = v
      end
      table.insert(foundPaths, foundPath)
    end
    visited[y][x] = true
    for i, dpt in ipairs(directionPoints) do
      local nx = x + dpt.x
      local ny = y + dpt.y
      local nd = i
      local nc = cost + (1 + ((nd == d and 0) or 1000))
      if (
        (not visited[ny][nx])
        and (grid[ny][nx] == ".")
        and (nc <= costLimit)
      ) then
        table.insert(soFar, {
          x = nx,
          y = ny,
          d = nd,
          cost = nc,
        })
        --[[ recurse ]]
        helper(nx, ny, nd, nc, soFar)
        table.remove(soFar)
      end
    end
    visited[y][x] = nil
  end
  local pathSoFar = {
    {
      x = sPos.x,
      y = sPos.y,
      d = 2,
      cost = 0,
    }
  }
  visited[sPos.y][sPos.x] = true
  helper(sPos.x, sPos.y, 2, 0, pathSoFar)
  return foundPaths
end

local function day16Pt2(inputLines)
  local day16Input = parseInput(inputLines)
  local grid = day16Input.grid
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos
  local bestPath = findPath(grid, sPos, ePos)
  if bestPath == nil then
    return -1
  end
  local minCost = bestPath.cost
  if DEBUG then
    printf("min cost: %d\n", minCost)
  end
  local minPaths = findPaths(grid, sPos, ePos, minCost)
  local minPathPtSet = {}
  -- for y = 1, #grid do
  --   minPathPtSet[y] = {}
  -- end
  for i, path in ipairs(minPaths) do
    -- printf(gridStr(grid, path))
    -- printf("%d - cost: %d\n", i, path[#path].cost)
    for _, pathPt in ipairs(path) do
      local ptKey = getPtKey(pathPt.x, pathPt.y)
      if not minPathPtSet[ptKey] then
        minPathPtSet[ptKey] = Point.new(pathPt.x, pathPt.y)
      end
      -- if minPathPtSet[pathPt.y][pathPt.x] == nil then
      --   minPathPtSet[pathPt.y][pathPt.x] = true
      -- end
    end
  end
  local seatCount = 0
  for _ in pairs(minPathPtSet) do
    seatCount = seatCount + 1
  end
  if DEBUG then
    printf(gridSeatStr(grid, minPathPtSet))
    printf("num paths: %d\n", #minPaths)
    printf("num seats: %d\n", seatCount)
  end
  return seatCount
  -- return -1
end

--[[
88472 - incorrect, too high
88471 - too high
88468 - correct
]]
local function day16Pt1(inputLines)
  local day16Input = parseInput(inputLines)
  local grid = day16Input.grid
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos
  if DEBUG then
    printf("\n")
    printf(gridStr(grid))
  end
  local foundPath = findPath(grid, sPos, ePos)
  local cost = (foundPath and foundPath.cost) or -1
  if DEBUG then
    local path = foundPath and foundPath.path
    printf("\n")
    printf(gridStr(grid, path))
  end
  -- printf("cost: %d\n", path[#path].cost)
  return cost
end

local day16MainModule = {
  day16Pt1 = day16Pt1,
  day16Pt2 = day16Pt2,
}

return day16MainModule
