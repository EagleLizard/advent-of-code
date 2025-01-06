
local sep = package.config:sub(1, 1)

local function check(filePath)
  local f = io.open(filePath, "r")
  if f then
    f:close()
  end
  return f ~= nil
end

local filesModule = {
  sep = sep,
  check = check,
}

return filesModule
