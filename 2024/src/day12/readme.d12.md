# 2024 Day 12

## Part 1

### `[01/23/2025][lua]`
Recursive grid traversal, consuming each region entirely upon encountering it.

Treating graph points as nodes was convenient; once all of the nodes of a region are connected, getting the perimeter is simple. I only need to iterate over every plant node of the region, and any unconnected direction pointer is +1 perimeter.
