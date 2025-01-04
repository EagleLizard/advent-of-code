
local function day5Pt1(inputLines)
  for i, currLine in pairs(inputLines) do
    io.write(string.format("%s\n", currLine))
  end
  return -1
end

local day5MainModule = {
  day5pt1 = day5Pt1
}

return day5MainModule
