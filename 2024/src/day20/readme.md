
# 2024 Day 20

## Part 1

### `[02/25/2025][js]`

This took me longer than I thought. My initial solution was to try the most naive approach to finding all paths for a given grid, and brute-force the solution by re-applying it to every possible cheat path. This took too long so I tried to be clever.

The better solution I thought of was to find the initial path, then for every piece of wall that could be a cheat:

1. find the first point along the initial path that is adjacent to the cheat
2. determine the x,y coordinates of the next point along the initial path where the cheat _would_ be
3. keep iterate from the first adjacent point, skipping subsequent points along the path until the x,y value from the prev. step is encountered.

My first attempt was too low, so I made a slightly more efficient naive implementation and let it run. It took 6 minutes and produced the right answer. My clever solution was off by one. Smh.

Current solution (not smart) took ~331500ms (~5.5m)
