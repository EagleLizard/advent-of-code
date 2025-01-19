# 2024 Day 7

## Part 1
`[01/14/2025][go]` recursive solution

## Part 2
`[01/14/2025][go]` add concat operator to part 1 solution

**Update:*

`[01/14/2025][go]` I was able to optimize from ~750ms to ~400ms by chaning to an iterative solution, and not exploring operators that would result in a number larger than the test val

This works because all of the operators are additive and result in a bigger number.

`[01/19/2025][lua]`
The unoptimized recursive solution was faster than I thought it would be, ~4.9s.

I can apply the same optimizations as the Go implementation.
