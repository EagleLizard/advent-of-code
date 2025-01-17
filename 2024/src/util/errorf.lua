
local function errorf(s, ...)
  return error(string.format(s, ...))
end

return errorf
