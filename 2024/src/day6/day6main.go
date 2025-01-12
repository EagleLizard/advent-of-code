package day6

import (
	"fmt"
	"strings"

	"github.com/EagleLizard/advent-of-code/2024/src/util/geom"
)

type Day6Input struct {
	Witdh        int
	Height       int
	Obstructions []geom.Point
	Grid         [][]rune
	Guard        *LabGuard
}

/*
clockwise starting w/ up (NESW)
*/
const GUARD_POS = "^>v<"

type VisitedDirection struct {
	Up    bool
	Right bool
	Down  bool
	Left  bool
}

func (vd *VisitedDirection) SetDirection(direction int) {
	switch direction {
	case 0:
		vd.Up = true
	case 1:
		vd.Right = true
	case 2:
		vd.Down = true
	case 3:
		vd.Left = true
	}
}

/*
4890 - correct
*/
func Day6Pt1(inputLines []string) int {
	day6Input := parseInput(inputLines)
	labGuard := day6Input.Guard
	if labGuard == nil {
		panic("missing guard")
	}
	visited := make(map[geom.Point]bool)
	visited[labGuard.Pos] = true
	for labGuard.Step(day6Input.Grid) {
		visited[labGuard.Pos] = true
	}
	return len(visited)
}

/*
4694 - too high
730 - too low
1995 - correct
*/
func Day6Pt2(inputLines []string) int {
	day6Input := parseInput(inputLines)
	sourceLabGuard := day6Input.Guard
	sourceGrid := day6Input.Grid
	if sourceLabGuard == nil {
		panic("missing guard")
	}
	/*
		brute force:
			- find all points that are NOT obstructions
			- try each possible point
			- detect if loop exists
	*/
	testPoints := []geom.Point{}
	/*
		only need to test points that are adjacent to points visited on the path
	*/
	firstGuard := sourceLabGuard.Copy()
	walkedPointsMap := map[geom.Point]*VisitedDirection{}
	walkedPointsMap[firstGuard.Pos] = &VisitedDirection{}
	walkedPointsMap[firstGuard.Pos].SetDirection(firstGuard.Direction)
	for firstGuard.Step(sourceGrid) {
		vp := walkedPointsMap[firstGuard.Pos]
		if vp == nil {
			vp = &VisitedDirection{}
			walkedPointsMap[firstGuard.Pos] = vp
		}
		vp.SetDirection(firstGuard.Direction)
	}
	gridCopy := [][]rune{}
	for y := range sourceGrid {
		gridCopy = append(gridCopy, []rune{})
		gridCopy[y] = append(gridCopy[y], sourceGrid[y]...)
	}

	adjPoints := map[geom.Point]bool{}
	for walkedPt, vd := range walkedPointsMap {
		/* up */
		if vd.Up && walkedPt.Y > 0 {
			upPt := geom.Point{X: walkedPt.X, Y: walkedPt.Y - 1}
			/*
				if the tile above is not visited
					& the tile above is not in adjPoints
					& the tile above is not an obstacle
			*/
			if !adjPoints[upPt] && gridCopy[upPt.Y][upPt.X] != '#' {
				obsIntersect := false
				for _, obsPt := range day6Input.Obstructions {
					if obsPt.Y == walkedPt.Y && obsPt.X > walkedPt.X {
						obsIntersect = true
						break
					}
				}
				if obsIntersect {
					adjPoints[upPt] = true
				}
			}
		}
		/* right */
		if vd.Right && walkedPt.X < day6Input.Witdh-1 {
			rightPt := geom.Point{X: walkedPt.X + 1, Y: walkedPt.Y}
			if !adjPoints[rightPt] && gridCopy[rightPt.Y][rightPt.X] != '#' {
				obsIntersect := false
				for _, obsPt := range day6Input.Obstructions {
					if obsPt.X == walkedPt.X && obsPt.Y > walkedPt.Y {
						obsIntersect = true
						break
					}
				}
				if obsIntersect {
					adjPoints[rightPt] = true
				}
			}
		}
		/* down */
		if vd.Down && walkedPt.Y < day6Input.Height-1 {
			downPt := geom.Point{X: walkedPt.X, Y: walkedPt.Y + 1}
			if !adjPoints[downPt] && gridCopy[downPt.Y][downPt.X] != '#' {
				obsIntersect := false
				for _, obsPt := range day6Input.Obstructions {
					if obsPt.Y == walkedPt.Y && obsPt.X < walkedPt.X {
						obsIntersect = true
						break
					}
				}
				if obsIntersect {
					adjPoints[downPt] = true
				}
			}
		}
		/* left */
		if vd.Left && walkedPt.X > 0 {
			leftPt := geom.Point{X: walkedPt.X - 1, Y: walkedPt.Y}
			if !adjPoints[leftPt] && gridCopy[leftPt.Y][leftPt.X] != '#' {
				obsIntersect := false
				for _, obsPt := range day6Input.Obstructions {
					if obsPt.X == walkedPt.X && obsPt.Y < walkedPt.Y {
						obsIntersect = true
						break
					}
				}
				if obsIntersect {
					adjPoints[leftPt] = true
				}
			}
		}
	}

	for adjPt := range adjPoints {
		gridCopy[adjPt.Y][adjPt.X] = '$'
	}

	// printGrid(gridCopy, map[geom.Point]*VisitedDirection{}, sourceLabGuard.Copy())

	// printGrid(sourceGrid, walkedPointsMap, sourceLabGuard.Copy())
	// printGrid(sourceGrid, map[geom.Point]*VisitedDirection{}, sourceLabGuard.Copy())

	// for y := range sourceGrid {
	// 	for x := range sourceGrid[y] {
	// 		if sourceGrid[y][x] != '#' {
	// 			testPoints = append(testPoints, geom.Point{X: x, Y: y})
	// 		}
	// 	}
	// }

	for adjPt := range adjPoints {
		testPoints = append(testPoints, adjPt)
	}

	possibleObstuctionPoints := []geom.Point{}

	for _, tp := range testPoints {
		grid := [][]rune{}
		for y := range sourceGrid {
			grid = append(grid, []rune{})
			grid[y] = append(grid[y], sourceGrid[y]...)
		}
		grid[tp.Y][tp.X] = '#'

		labGuard := sourceLabGuard.Copy()
		visitedMap := map[geom.Point]*VisitedDirection{}
		hasLoop := false
		for labGuard.Step(grid) {
			// printGrid(grid, visitedMap, labGuard)

			vd := visitedMap[labGuard.Pos]
			if vd == nil {
				vd = &VisitedDirection{}
				visitedMap[labGuard.Pos] = vd
			}
			switch labGuard.Direction {
			case 0: /* up */
				if vd.Up {
					hasLoop = true
				}
			case 1: /* right */
				if vd.Right {
					hasLoop = true
				}
			case 2: /* down */
				if vd.Down {
					hasLoop = true
				}
			case 3: /* left */
				if vd.Left {
					hasLoop = true
				}
			}
			if hasLoop {
				break
			}
			vd.SetDirection(labGuard.Direction)
		}
		if hasLoop {
			possibleObstuctionPoints = append(possibleObstuctionPoints, tp)
			// break
		}
		// fmt.Printf("hasLoop: %v", hasLoop)
	}
	return len(possibleObstuctionPoints)
}

func printGrid(grid [][]rune, visitedMap map[geom.Point]*VisitedDirection, labGuard LabGuard) {
	fmt.Print("\n")
	for y := range grid {
		for x := range grid[y] {
			if x == labGuard.Pos.X && y == labGuard.Pos.Y {
				fmt.Printf("%c", GUARD_POS[labGuard.Direction])
			} else {
				vd := visitedMap[geom.Point{X: x, Y: y}]
				if vd == nil {
					fmt.Printf("%c", grid[y][x])
				} else {
					if (vd.Up || vd.Down) && (vd.Right || vd.Left) {
						fmt.Print("+")
					} else if vd.Up || vd.Down {
						fmt.Print("|")
					} else if vd.Right || vd.Left {
						fmt.Print("-")
					} else {
						fmt.Print(" ")
					}
				}
			}
		}
		fmt.Print("\n")
	}
}

func parseInput(inputLines []string) Day6Input {
	res := Day6Input{}
	for y, currLine := range inputLines {
		if len(strings.TrimSpace(currLine)) > 0 {
			res.Height++
			if res.Witdh == 0 {
				res.Witdh = len(currLine)
			}
		}
		res.Grid = append(res.Grid, []rune{})
		for x, c := range currLine {
			if strings.ContainsRune(GUARD_POS, c) {
				direction := strings.IndexRune(GUARD_POS, c)
				guard := LabGuard{
					Pos:       geom.Point{X: x, Y: y},
					Direction: direction,
				}
				res.Guard = &guard
			}
			if c == '#' {
				res.Obstructions = append(res.Obstructions, geom.Point{X: x, Y: y})
				res.Grid[y] = append(res.Grid[y], '#')
			} else {
				res.Grid[y] = append(res.Grid[y], '.')
			}
		}
	}
	return res
}
