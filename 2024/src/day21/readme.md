 
# 2024 Day 21

## Part 1

### `[03/01/2025][js]`

My initial solution is working well. I thought the OOP approach would be overkill, but it has been helpful in organizing things in a logical way.

Currently the key sequence is not optimal, but it is correct. When finding each sequence of direction keys to push, there is no "best path" that I can discern - there may be multiple keypress combinations, but they all have equal cost.

This makes me think that the sequence of keys pressed at one level may have varying results at the next level robot.

If that is the case I could try:

1. Generate all possible key combinations that could produce the initial keypad sequence
1. For each combination, do the same for the first robot keypad
1. continue for all of the robots
1. When finished, I should have all possible key press combinations for the outermost dirpad. Select the shortest (or one of them, if there are multiple)

### `[03/03/2025][js]`

I went through several different strategies. I landed on a solution that goes through all possible paths, memoizing the `getKeyPaths` function for each robot.

While I am not leveraging the OOP patterns in the way I thought initially, but I don't think it was a bad idea. It helped me reason about things, it was fun, and in the end it was convenient for storing cache state on the robot instance so it can be reused across codes.

There are many optimizations left to try. 

The solution took ~8000ms (~8s)

### `[03/03/2025][js]`

**Update:*
 
I'm going to restart with a fresh approach. My thinking is getting mired in the original structure.

### `[03/04/2025][js]`

It could be useful to find paths to keys one-by-one, instead of trying to find every minimum path all at once.

**Update:*

Packing bits had the opposite effect in this case, making it slower. This is probably a JS thing where string keys are cheaper here.
