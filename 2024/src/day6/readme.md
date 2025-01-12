# 2024 Day 6

## Part 1

`[01/11/2025][go]` Abstracting the guard to a struct with a `Step` function was a good move. Making rotation it's own step in the iteration was also useful.

## Part 2
The initial brute-force implementation tried every possible position on the map, and tested each point by walking the path with that point inserted as a new obstacle.

During the test walk, I could test if a loop had been encountered if at any point the guard was walking on a visited position in the same direction they had previously walked.

In Go, the first initial solution took ~6.9 seconds.

`[01/12/2025][go]` I was able to optimized the original implemenation by restricting the possible points to test to those that are in front of the guard's path; that is, points adjacent to anyh visited point that are one step ahead of the guard.

This works because any points not on the guards path have 0 chance of being hit as an obstacle in this scenario anyway.

In Go, this reduced the solution time from 6.9s to ~1.5s

**update:*
I think I can optimize by restricting the initial points to test further. 

If a point along the guard's path could be an obstacle, I can exclude it if it will not produce a collision in a single rotation.

For example, with the test input, the points marked `$` represent adjacent positions along the path to the first rotation:
```
....#.....
....$....#
....$.....
..#.$.....
....$..#..
....$.....
.#..^.....
........#.
#.........
......#...
```
However, there are only 1 position that could result in the guard colliding with an existing obstruction:
```
....#.....
.........#
..........
..#.$.....
.......#..
..........
.#..^.....
........#.
#.........
......#...
```

So, I could restrict the initial set of obstructions to test by checking if *any* obstructions also exist on the same axis of the guard that they would be travelling on after turning.

**update2:*
This worked, but didn't yield great gains. From 1.5s to ~1.3s
