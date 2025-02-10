
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

local directions = {1, 2, 3, 4,}
local directionPoints = {
  Point.new(0, -1), --[[ up ]]
  Point.new(1, 0), --[[ right ]]
  Point.new(0, 1), --[[ down ]]
  Point.new(-1, 0), --[[ left ]]
}

local function gridVisitedStr(srcGrid, visited)
  local grid = {}
  for y in ipairs(srcGrid) do
    local row = {}
    for x, v in ipairs(srcGrid[y]) do
      row[x] = v
    end
    grid[y] = row
  end

  for y in pairs(visited) do
    for x in pairs(visited[y]) do
      grid[y][x] = "o"
    end
  end

  local gridStr = ""
  for y in ipairs(grid) do
    for _, c in ipairs(grid[y]) do
      gridStr = gridStr..c
    end
    gridStr = gridStr.."\n"
  end
  return gridStr
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

---@param grid string[][]
---@param sPos Point
---@param ePos Point
---@return nil|{ path: {x: integer, y: integer, d: integer}[], cost: integer, seats: {[integer]: boolean}[] }
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
  local minCost = math.huge
  local minPath = {}
  local seats = {}
  while not pq:empty() do
    local curr = pq:pullMin()
    local cost = curr.p
    local x = curr.val.x
    local y = curr.val.y
    local d = curr.val.d
    local soFar = curr.val.soFar
    if (x == ePos.x) and (y == ePos.y) and cost <= minCost then
      --[[ found end ]]
      minCost = cost
      minPath = soFar
      for _, sfPt in ipairs(soFar) do
        if seats[sfPt.y] == nil then
          seats[sfPt.y] = {}
        end
        seats[sfPt.y][sfPt.x] = true
      end
    end
    local visitedCost = visited[y] and visited[y][x] and visited[y][x][d]
    --[[ If not already visited with a lower cost ]]
    if visitedCost == nil or (visitedCost >= cost) then
      if visited[y] == nil then
        visited[y] = {}
      end
      if visited[y][x] == nil then
        visited[y][x] = {}
      end
      visited[y][x][d] = cost
      for nd, ndp in ipairs(directionPoints) do
        local nx = x + ndp.x
        local ny = y + ndp.y
        if grid[ny][nx] == "." then
          local nCost = cost + 1
          local nSoFar = arr.copy(soFar)
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
  local res = {
    path = minPath,
    cost = minCost,
    seats = seats,
  }
  return res
end

--[[ 
616 - correct
]]
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
  local seatCount = 0
  for y in pairs(bestPath.seats) do
    for _ in pairs(bestPath.seats[y]) do
      seatCount = seatCount + 1
    end
  end
  if DEBUG then
    printf(gridVisitedStr(grid, bestPath.seats))
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
