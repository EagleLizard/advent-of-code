 
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
