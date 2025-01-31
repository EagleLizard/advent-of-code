
# 2024 Day 15

## Part 1

### `[01/31/2025][lua]`

Currently runs in ~571ms. There is some low hanging fruit.

*<u>*Update</u>*

I replaced the `arr-util` convenience methods. From ~571ms to ~320ms.

## Part 2

### `[01/31/2025][lua]`

The issue with my 2nd attempt at this was difficult to find, so I set up logs to print the state of the map at each collision. This narrowed down the number of moves I needed to look at to just those resulting in a box collision.

This isn't exhaustive - it would not show collisions that didn't happen but should have. I was able to find some issues, though.

When moving down, it's possible a box is moved twice. The test case in the example input file `day15_test-e2.txt` reproduces the issue. The result:

```
##########################
##......................##
##......................##
##...........@..........##
##..........[]..........##
##.........[][].........##
##........[]..[]........##
##.......[].[].[].......##
##......................##
##.........[][].........##
##......................##
##########################
```

The *expected* outcome is that the whole triangle moves down. What's happening is the moves that jump down are getting counted twice in the recursive function that checks if a move can happen. The fix seems obvious.

*<u>*Update</u>*

This was correct, the issues was counting boxes that should move transitively twice in the branching logic. Solved with some naive duplication prevention.

*<u>*Update2</u>*

Currently runs in ~615ms.

Replaced `filter` with a loop, ~615ms to ~355ms.
