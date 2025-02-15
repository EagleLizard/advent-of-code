
# 2024 Day 17

## Part 1

In it's face this will be a simple VM.

## Part 2

### `[02/14/2025][js]`

I am on the right track. I figured out the methodology for solving via incrementally trying out different octals, and the repetitive behaviors of the instruction set made sense.

I reproduced the last 9 digits of the program vie incrementally testing octals at different magnitudes. I was caught up for a while on some bad output, which was due to JS overflowing ints greater than 32 bits - this was easy to solve, I made everything a `BigInt` in the VM.

Retrofitting the algorithm I have to do backtracking is not trivial, so I am going to take a shot at rewriting it with backtracking in mind.

*<u>*Update:</u>*

Wow I got it. The solution doesn't seem super complicated, but it's all fresh in my head. Backtracking was the correct approach. I could have tracked state more gracefully.
