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
