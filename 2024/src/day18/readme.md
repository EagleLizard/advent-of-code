
# 2024 Day 18

## Part 1

Looks like pathfinding.

## Part 2

The brute force is obvious. The better way would be to binary search from the given start in part 1 (1024) and the end of the input.

### `[02/16/2025][js]`

I ended up doing the brute-force solution because there was an issue with my binary search. I will revisit later.

Takes ~1755ms (1.76s)

*<u>*Update:</u>*

I revisited the solution using my original approach with binary search. This is a lot more efficient.

From ~1755ms to ~9.4ms.
