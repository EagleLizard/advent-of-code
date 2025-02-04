# 2024 Day 16

## Part 1

### `[02/03/2025][lua]`

This is a fairly straightforward path-finding algorithm to solve the maze. Initially, I tried to apply a simple heuristic to favor paths that didn't change direction much.

After some time fiddling with implementation details, I decided to forego the premature optimization.

My current solution finds *a path*, but that is not the challenge - I need to find all paths. I use the same visited map while recursing down, and leave those positions visited as I return from traversal; this prevents the traversal from trying different directions if a node was visited.

To generate all paths, I either need to either:

* Mark nodes as not visited when returning from recursive calls
* Keep track of visited during traversal only, instead of a shared visited map in the closure

I think the former will work and perform better. It seems easy to do as well.
