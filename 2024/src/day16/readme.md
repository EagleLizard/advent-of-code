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

`[02/04/2025][lua]`

*<u>*Update:</u>*

The naive algorithm takes too long. The obvious solution is BFS via Dijkstra's.

~~`[02/05/2025[lua]`~~

`[02/09/2025][lua]`

I overcomplicated the obvious solution, which was not correct.

The working solution is Dijkstra's with a priority queue.

## Part 2

### `[02/09/2025][lua]`

The task is to find all tiles that are along a "best path". A best path is a shortest path, of which there can be many.

My initial inclination is to use the function from part 1 to find the cost of the best path, and then implement DFS with a cost limit to short-circuit if it is ever traversing a path longer than the best path.
