
local mazeModule = require("day16.maze")
local mazeEnum = mazeModule.mazeEnum

local printf = require("util.printf")

local MazeNode = (function ()
  ---@class MazeNode
  ---@field x integer
  ---@field y integer
  ---@field id integer
  ---@field up MazeNode|nil
  ---@field right MazeNode|nil
  ---@field down MazeNode|nil
  ---@field left MazeNode|nil
  local MazeNode = {}
  MazeNode.__index = MazeNode

  local idCounter = 1

  ---@param x integer
  ---@param y integer
  function MazeNode.new(x, y)
    local self = setmetatable({}, MazeNode)
    self.x = x
    self.y = y
    self.id = idCounter
    idCounter = idCounter + 1
    return self
  end

  return MazeNode
end)()

local function getNodeGrid(grid)
  local nodeGrid = {}
  for y in ipairs(grid) do
    local row = {}
    for x in ipairs(grid[y]) do
      local val = grid[y][x]
      if val == mazeEnum.tile then
        row[x] = MazeNode.new(x, y)
      end
      -- printf("%d%s", grid[y][x], (x == #grid[y] and "\n") or "")
    end
    nodeGrid[y] = row
  end
  --[[ connect nodes ]]
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      local node = nodeGrid[y][x]
      if node ~= nil then
        --[[ connect to adjacent nodes ]]
        if grid[y - 1][x] == mazeEnum.tile then
          node.up = nodeGrid[y - 1][x]
        elseif grid[y][x + 1] == mazeEnum.tile then
          node.right = nodeGrid[y][x + 1]
        elseif grid[y + 1][x] == mazeEnum.tile then
          node.down = nodeGrid[y + 1][x]
        elseif grid[y][x - 1] == mazeEnum.tile then
          node.left = nodeGrid[y][x - 1]
        end
      end
    end
  end
  return nodeGrid
end

local MazeGraph = (function ()
  ---@class MazeGraph
  ---@field grid integer[][]
  ---@field nodeGrid MazeNode[][]
  local MazeGraph = {}
  MazeGraph.__index = MazeGraph

  function MazeGraph.new(grid, sPos, ePos)
    local self = setmetatable({}, MazeGraph)
    self.grid = grid
    self.nodeGrid = getNodeGrid(self.grid)
    return self
  end

  return MazeGraph
end)()

local mazeGraphModule = {
  MazeGraph = MazeGraph,
  MazeNode = MazeNode,
}

return mazeGraphModule
