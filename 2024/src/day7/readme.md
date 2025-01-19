# 2024 Day 7

## Part 1
`[01/14/2025][go]` recursive solution

## Part 2
`[01/14/2025][go]` add concat operator to part 1 solution

**Update:*

`[01/14/2025][go]` I was able to optimize from ~750ms to ~400ms by chaning to an iterative solution, and not exploring operators that would result in a number larger than the test val

This works because all of the operators are additive and result in a bigger number.

`[01/19/2025][lua]`
The unoptimized recursive solution was faster than I thought it would be, ~4.9s.

I can apply the same optimizations as the Go implementation.

**Update:*

I was able to optimize to ~3.2s by adding the check to skip further equations if the current result is larger than the testVal (same reason as for the Go impl.)

I then changed the recursive algorithm to pass the current index as a parameter instead of a slice of the table. From ~3.2s to ~2.1s.

I was able to optimize further by changing the `concatOp` function from:
```lua
local function concatOp(a, b)
  return tonumber(a..b)
end
```

to:
```lua
local function concatOp2(a, b)
  return (a * (10 ^ #(""..b))) + b
end
```

This calculates `b`'s power of 10 by converting it to a string and taking the length, and then creating the concatenation directly using arithmetic instead of type conversion.

Surprisingly this optimization reduced the runtime from ~2.1s to ~1.4s.
