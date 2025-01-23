# 2024 Day 11

## Part 1
`[01/22/2025][lua]` naive recursive implementation

## Part 2
`[01/23/2025][lua]` reusing the solution from part 1 took too much memory and time, I didn't let it finish.

Because the stones don't move position, I realized I didn't need to construct the new array of stones at all - instead I could recurse per stone and count the blinks as the base case.
 
This took almost no memory but took forever. I decided to try memoizing the recursive function, and that reduced the Part 1 runtime from ~100ms to ~2.5ms.

Part 2 ran in ~100ms
