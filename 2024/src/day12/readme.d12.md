# 2024 Day 12

## Part 1

### `[01/23/2025][lua]`
Recursive grid traversal, consuming each region entirely upon encountering it.

Treating graph points as nodes was convenient; once all of the nodes of a region are connected, getting the perimeter is simple. I only need to iterate over every plant node of the region, and any unconnected direction pointer is +1 perimeter.

## Part 2

### `[01/24/2025][lua]`

This one took me a while initially to come up with a strategy. I decided the problem was easiest to reason about if I scanned the grid row-by-row first to get the top and bottom side count, and then scanned the grid column-by-column to get the left and right side count.

This ended up being the correct solution, however I was off by a very small amount in my initial implementation. The E example from the problem statement provided clarity, after I printed the right side while counting the cols:

```
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
```
I wasn't correctly switching a bool on/off when the sides alternated, so for the `E` region, the entire right side counted as one:
```
EEEEE|
E|   |
EEEEE|
E|   |
EEEEE|
```

After fixing this for all directions (up, right, down, left) I got the right answer.

The solution is a bit ugly, I could tidy it up a bit. There is also a lot of room for optimization.