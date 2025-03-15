# 2024 Day 24

## Part 2

### `[03/14/2025][js]`

the target number of the initial inputs, to binary (least-most significant):

```
0110011101100000001001111110101000000010000011
```

Fundamentally the problem is that the machine is wired incorrectly - a generic approach ignoring that it's a circuit, or brute force, won't work because the system is too complex removed of its context.

Since this is an adding machine, I'll need to look at it as an adding circuit and identify what parts of it differ from what an adding machine should be.

To do this, I'll need to analyze the circuit structurally. Doing this procedurally has been difficult, I need some what to visualize the circuits that feed into a given output wire.
