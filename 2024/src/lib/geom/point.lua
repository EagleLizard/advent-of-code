
local Point = {}
Point.__index = Point

function Point.new(x, y)
  ---@class Point
  ---@field x integer
  ---@field y integer
  local self = setmetatable({}, Point)
  self.x = x
  self.y = y
  return self
end

return Point
