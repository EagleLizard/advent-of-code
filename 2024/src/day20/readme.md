
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

*<u>*Update:</u>*

Making the naive solution faster.

From ~331500ms (~5.5m) to ~22100ms (~22.1s)

*<u>*Update2:</u>*

Making the naive solution faster. Using an array of maps instead of strings for tracking visited nodes.

From ~22100ms (22.1s) to ~3100ms (3.1s)

*<u>*Update3:</u>*

Making the naive solution faster.

From ~3100ms (3.1s) to ~2800ms (2.8s)

### `[02/27/2025][js]`

*<u>*Update4:</u>*

I applied some of the optimization concepts from part 2.

From ~2800ms (2.8s) to ~71ms

## Part 2

I should be able to scan from any point on the original path outward.

I should only explore paths that are actual cheats that phase through walls.
```
0123

  3
012

 3
 2
01
```

I could find all of the points within the cheat distance as candidates. Only including paths that would pass through a wall, avoiding traveling exactly on the original path.

So for a cheat path to be considered:

1. it must pass through a wall
2. it must end on an empty tile
