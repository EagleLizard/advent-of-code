
# AoC 2025 Day 4

## Part 2

### `[12/04/2025][ts]` - make it faster

Removed ES iterable funcs (`.filter`), inverted some boolean checks `&&`, and made some other quick perf improvements to the current solution.

||pre|post|
|-|-|-|
|time|~`39ms`|~`30ms`|

So ~`23%` reduction in run time. Not bad since low-effort.

#### **Update:*

The previous times were with node `22.20.0`. Retaking them since this project should be node `24.11.1`.

||pre|post|
|-|-|-|
|time|~`36ms`|~`26ms`|

So ~`28%` decrease in run time. 
