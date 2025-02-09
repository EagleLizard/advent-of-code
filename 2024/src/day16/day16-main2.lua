
local Point = require("geom.point")
local priorityQueueModule = require("util.priority-queue")
local PriorityQueue = priorityQueueModule.PriorityQueue

local printf = require("util.printf")

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

local function day16Pt1(inputLines)
  local day16Input = parseInput(inputLines)
  local grid = day16Input.grid
  local sPos = day16Input.sPos
  local ePos = day16Input.ePos
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      printf("%s%s", grid[y][x], (x == #grid[y] and "\n") or "")
    end
  end
  local pq = PriorityQueue.new()
  pq:insert(2, "b")
  pq:insert(1, "a")
  pq:insert(3, "c")
  while pq:peekMin() do
    local val = pq:pullMin();
    printf("%s\n", val)
  end
  return -1
end

local day16Main2Module = {
  day16Pt1 = day16Pt1,
}

return day16Main2Module
