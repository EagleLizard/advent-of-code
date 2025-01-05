
local function split(s, delim)
  local i = 1
  local strLen = string.len(s)
  local subStrs = {}
  while i < strLen do
    local subStr
    local startIdx, endIdx = string.find(s, delim, i)
    if startIdx == nil or endIdx == nil then
      break
    end
    subStr = string.sub(s, i, startIdx - 1)
    table.insert(subStrs, subStr)
    i = i + endIdx
  end
  if i < strLen then
    -- get remainder
    local subStr = string.sub(s, i, strLen)
    table.insert(subStrs, subStr)
  end
  return subStrs
end

local function join(strs, delim)
  local res = ""
  for i, s in ipairs(strs) do
    local nextStr
    if i == 1 then
      nextStr = s
    else
      nextStr = delim..s
    end
    res = res..nextStr
  end
  return res
end

local strUtilModule = {
  split = split,
  join = join,
}

return strUtilModule
