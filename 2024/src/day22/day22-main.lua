
local printf = require("util.printf")

local function parseInput(inputLines)
  local secrets = {}
  for _, inputLine in ipairs(inputLines) do
    local numStr = string.match(inputLine, "%d+")
    local num = tonumber(numStr)
    if num ~= nil then
      table.insert(secrets, num)
    end
  end
  local res = {
    secrets = secrets,
  }
  return res
end

local function mix(secret, val)
  -- printf("mix: %s ~ %s\n", val, secret)
  return secret ~ val
end

local function prune(val)
  return val % 16777216
end

local function div32(secret)
  local res = math.floor(secret / 32)
  -- local remainder = divRes % 1
  -- local res
  -- if(remainder < 0.5) then
  --   res = math.floor(divRes)
  -- else
  --   res = math.floor(divRes + 1)
  -- end
  -- printf("%s, %d\n", divRes, res)
  return res
end

local function mul64(secret)
  return secret * 64
end

local function op1(secret)
  local mul = mul64(secret)
  secret = mix(secret, mul)
  return prune(secret)
end
local function op2(secret)
  local div = div32(secret)
  secret = mix(secret, div)
  return prune(secret)
end
local function op3(secret)
  local mul = secret * 2048
  secret = mix(secret, mul)
  return prune(secret)
end

local function getNextSecret(secret)
  secret = op1(secret)
  secret = op2(secret)
  secret = op3(secret)
  return secret
end

local function getSecretN(secret, n)
  for i=1, n do
    secret = getNextSecret(secret)
  end
  return secret
end

--[[ 
  14180628689 - correct
]]
local function day22Part1(inputLines)
  local day22Input = parseInput(inputLines)
  local secrets = day22Input.secrets
  local secretSum = 0
  for i, secret in ipairs(secrets) do
    -- printf("%d: %d :\n", i, secret)
    -- local nextSecret = secret
    local nextSecret = getSecretN(secret, 2000)
    -- printf("%s\n", nextSecret)
    secretSum = secretSum + nextSecret
  end
  return secretSum
end

local day22MainModule = {
  day22Part1 = day22Part1,
}

return day22MainModule
