
local errorf = require("../util/errorf")

local function tokenize(argv)
  local argTokens = {}
  for i, v in ipairs(argv) do
    if string.match(v, "-%w=.+") then
      local eqIdx, eqEndIdx = string.find(v, "=")
      if eqIdx == nil or eqEndIdx == nil then
        --[[ 
          This condition should be impossible to reach
        ]]
        errorf("Invalid flag: %s", v)
      end
      local lhs = string.sub(v, 1, eqIdx - 1)
      local rhs = string.sub(v, eqEndIdx + 1, #v)
      table.insert(argTokens, lhs)
      table.insert(argTokens, rhs)
    else
      table.insert(argTokens, v)
    end
  end
  return argTokens
end

--[[ 
  Do something simple for now.
  If needed, can write a proper tokenizer based on:
    - ts: https://github.com/EagleLizard/sysmon-ts/blob/4c5960f531d834a6c5cbf2a79c6a53d6d6b3e7ed/src/lib/cmd/parse-argv.ts
    - go: https://github.com/EagleLizard/sysmon-go/blob/671663278c4d62873a37c5bf169578bbdba150b6/src/lib/argv/argv.go
]]
local function parse(argv)
  local args = {
    day = 0,
  }
  local tokens = tokenize(argv)
  local parseDay = false
  local dayFlagVal = nil
  for _, token in ipairs(tokens) do
    if not parseDay and token == "-d" then
      parseDay = true
    elseif parseDay then
      dayFlagVal = tonumber(token)
      if dayFlagVal == nil then
        errorf("invalid day flag value: %s", token)
      end
      parseDay = false
    end
  end
  if dayFlagVal ~= nil then
    args.day = dayFlagVal
  end

  return args
end

local parseArgsModule = {
  parse = parse,
}

return parseArgsModule
