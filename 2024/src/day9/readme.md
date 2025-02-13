# 2024 Day 9

## Part 1

`[01/17/2025][lua]` Correct answer, but solution took ~1.9 minutes. I will try to optimize

**Update1:*
I was able to reduce runtime from 1.9 minutes to ~0.33 seconds by using two pointers:

1. start of comapct disk, looking for gap chars
2. end of compact disk, looking backwards for block chars

I also updated how I checked for gaps in the remaining compact disk by updating the remaining gaps each time I swapped to only check the disk only between those two pointers.

**Update2*:
I optimized compactDisk function further after looking at some solutions on the AoC subreddit.

My 2-pointer method was correct but performed many unnecessary iterations - I simplified it to loop until it finds the next empty gap, then loop until it finds the next block (reverse). Loop condition is simple, `blockPtr < gapPtr`.

From ~30s to ~16ms (damn!)

## Part 2

`[01/18/2025][lua]`:
My approach was similar to the 2 pointer approach, but I saw an immediate optimization - instead of keeping a pointer from the start to look for gaps, I could pre-calculate the gaps.

This works because each gap can only ever be filled - new gaps won't be created in this process. They are either eliminated by the fileId block if the gap is the exact same size, or it shrinks by the size of the block minus the size of the gap.

I initially got a wrong answer. This was because as I moved from the back of the disk, I would look for open gaps even if the gap started after the reverse pointer. Once I fixed that, the correct solution presented itself.

The solution takes ~1.2s, which is not bad but also not great. I can't think of any obvious optimizations right now.

### `[02/12/2025][js]`

The current naive implementation takes ~305ms.