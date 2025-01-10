
local function sToMs(s)
  local ms = s * 1e3
  return ms
end

local dateTimeUtilModule = {
  sToMs = sToMs,
}

return dateTimeUtilModule

