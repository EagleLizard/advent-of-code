# 2024 Day 14

## Part 1
### `[01/26/2025][lua]`

Fairly straightforward modulo logic.

I could optimize this part by advancing all of the seconds per bot at one time, but the current solution runs quickly enough, ~5.9ms

## Part 2

### `[01/26/2025][lua]`

After applying some heuristics, I realize all of my assumptions below are likely wrong.

My next approach will be instead to look for when a bunch of points are clustered together.

*<u>*update:</u>*

I came up with a fairly basic heuristic and search method. The general idea is:

1. Every second, plot the points on a grid
2. Search subsections of the grid, and count the number of occupied spaces
3. Measure the percentage of occupied space in each section. If the percentage is above some threshold, a cluster of points exists and could be a tree

I started off with a threshold of `0.05` (5%), and noticed the resulting frames often created horizontal or vertical bands of bots. The horizontal bands appeared to have a more cogent pattern, resembling something inside of a frame.

I tuned the threshold progressively up to `0.2` (20%) and voila, the only resulting frame was an xmas tree. It was also the correct number of seconds.

The box size I chose was 1/6 of the width & height. I chose it arbitrarily, assuming the xmas tree would take up anywhere from 30-50% of the grid. 1/6 meant I would have some overlap in case I missed it. The tree was smaller than that I think, but the approach still worked. 

It would segment like so (using 1/3 instead of 1/6 here):

```
...o...oo...
............
........o...
........o...
........o...
........o...
........o...
............
............
..oooooooo..
............
............

...o ...o o...
.... .... ....
.... .... o...
.... .... o...

.... .... o...
.... .... o...
.... .... o...
.... .... ....

.... .... ....
..oo oooo oo..
.... .... ....
.... .... ....
```

#### Issues with Current Impl.

The smaller box doesn't correctly cover the entire grid - there is some remainder on the right and bottom. Would be an easy fix, but the heuristic works anyway.

It's pretty slow. 6.1s.

### `[01/27/2025][lua]`

*<u>*update2:</u>*

I was able to optimize in various spots to get the running time of part 2 down.

There is probably more I could do to  optimize the current algorithm; however, I think a different heuristic would be necessary to realize significant performance improvements.

From ~6.1s to ~3.1s

---

---

`01/26/2025`

I was initially frustrated by the prompt. Now I can appreciate the humor of the ambiguity.

My first inclination was to print the entire grid, second-by-second, and visually observe when the christmas tree appears.

This *might* work, but it could also be prohibitively difficult - what if the tree only appears after 1e14 seconds?

Instead, I will attempt to do this algorithmically by defining some properties of a christmas tree in this context.

### Properties of an xmas tree:

1. Central tip
2. Symmetrical edges
3. A trunk (?)


#### 1. Central tip

The tip if the tree should be a single point. My initial assumption is this will be in the middle of the grid horizontally.

e.g.:

```
.....o.....
```

#### 2. Symmetrical edges

At any edge of the tree below the tip, there should be a corresponding edge across the center.

e.g.:

```
....o.o....
...o...o...
```

This rule should automatically account for a tree that is filled and not an outline:
```
....ooo....
...ooooo...
```

#### 3. The trunk...

In the case a tree has a trunk, it should either be a single character, or be an odd number of characters wide around the center.

The rule that it should be symmetrical and vertically uniform should account for all cases.

A trunk should also have a width less than the base of the tree.

A trunk then should satisfy the following:

1. below the base of the tree
2. in the center of the tre
3. uniform in width vertically
4. symmetrical about the middle
5. not exist
    * an abstract representation of an xmas tree doesn't *need* a trunk...

e.g.:
```
...o...o... ...ooooo...
..o.....o.. ..ooooooo..
.....o..... .....o.....

..o.....o.. ..ooooooo..
.o.......o. .ooooooooo.
.....o..... .....o.....
.....o..... .....o.....

...o...o... ...ooooo... ...ooooo...
..o.....o.. ..ooooooo.. ..ooooooo..
.o.......o. .ooooooooo. .ooooooooo.
....o.o.... ....o.o.... ....ooo....
....o.o.... ....o.o.... ....ooo....

```


I will assume the tree will be one of a few variants. 

##### 1. Outline
```
.....o.....
....o.o....
...o...o...
..o.....o..
...........

.....o.....
....o.o....
...o...o...
..ooooooo..
...........
```

##### 2. Filled

```
.....o.....
....ooo....
...ooooo...
..ooooooo..
...........
```

#### Potential Wildcards

It occurs to me that a tree could be a different shape, have different features, or violate the constraints I defined, but still be valid. 

For example, a tree can descend in jagged sections:
```
.......o.......
......ooo......
.....ooooo.....
......ooo......
.....ooooo.....
....ooooooo....
```

It could be off-center:
```
.......o...
......ooo..
.....ooooo.
....ooooooo
...........
```

For the sake of simplicity, I won't consider these.
