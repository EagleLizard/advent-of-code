
---@class Point
---@field x integer
---@field y integer
local Point = {}
Point.__index = Point

---@param x integer
---@param y integer
function Point.new(x, y)
  local self = setmetatable({}, Point)
  self.x = x
  self.y = y
  return self
end

return Point
