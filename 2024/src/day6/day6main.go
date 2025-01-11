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
*/
func Day6Pt2(inputLines []string) int {
	day6Input := parseInput(inputLines)
	labGuard := day6Input.Guard
	grid := day6Input.Grid
	if labGuard == nil {
		panic("missing guard")
	}
	fmt.Printf("%+v\n", *labGuard)
	// visited := make(map[geom.Point]bool)
	// visited[labGuard.Pos] = true

	visitedMap := make(map[geom.Point]*VisitedDirection)
	visitedMap[labGuard.Pos] = &VisitedDirection{}
	visitedMap[labGuard.Pos].SetDirection(labGuard.Direction)

	newObstructionMap := map[geom.Point]bool{}

	iterCount := 0
	for labGuard.Step(grid) {
		// vd := visitedMap[labGuard.Pos]
		switch labGuard.Direction {
		case 0:
			/*
				find any visited  nodes along the X axis to the right
					of the current labGuard pos where visitedDirection is Right
			*/
			intersections := []geom.Point{}
			for vPt, dir := range visitedMap {
				if vPt.Y == labGuard.Pos.Y && vPt.X > labGuard.Pos.X && dir.Right {
					intersections = append(intersections, vPt)
				}
			}
			if len(intersections) > 0 {
				newObstructionMap[geom.Point{X: labGuard.Pos.X, Y: labGuard.Pos.Y - 1}] = true
			}
			// if vd.Right {
			// 	po := geom.Point{X: labGuard.Pos.X, Y: labGuard.Pos.Y - 1}
			// 	newObstructionMap[po] = true
			// }
		case 1:
			/*
				find any visited nodes along the Y axis below the current
					labGuard pos where visitedDirection is Down
			*/
			intersections := []geom.Point{}
			for vPt, dir := range visitedMap {
				if vPt.X == labGuard.Pos.X && vPt.Y > labGuard.Pos.Y && dir.Down {
					intersections = append(intersections, vPt)
				}
			}
			if len(intersections) > 0 {
				newObstructionMap[geom.Point{X: labGuard.Pos.X + 1, Y: labGuard.Pos.Y}] = true
			}
			// if vd.Down {
			// 	po := geom.Point{X: labGuard.Pos.X + 1, Y: labGuard.Pos.Y}
			// 	newObstructionMap[po] = true
			// }
		case 2: // down
			/*
				find any visited noes along the X axis to the left of the
					current labGuard pos where visitedDirection is Left
			*/
			intersections := []geom.Point{}
			for vPt, dir := range visitedMap {
				if vPt.Y == labGuard.Pos.Y && vPt.X < labGuard.Pos.X && dir.Left {
					intersections = append(intersections, vPt)
				}
			}
			if len(intersections) > 0 {
				newObstructionMap[geom.Point{X: labGuard.Pos.X, Y: labGuard.Pos.Y + 1}] = true
			}
			// fmt.Printf("%+v\n", labGuard.Pos)
			// if vd.Left {
			// 	po := geom.Point{X: labGuard.Pos.X, Y: labGuard.Pos.Y + 1}
			// 	newObstructionMap[po] = true
			// }
		case 3: // left
			/*
				find any visited nodes along the Y axis above the current
					labGuard pos where visitedDirection is Up
			*/
			intersections := []geom.Point{}
			for vPt, dir := range visitedMap {
				if vPt.X == labGuard.Pos.X && vPt.Y < labGuard.Pos.Y && dir.Up {
					intersections = append(intersections, vPt)
				}
			}
			if len(intersections) > 0 {
				// fmt.Printf("%v\n", intersections)
				// fmt.Printf("%v\n", geom.Point{X: labGuard.Pos.X - 1, Y: labGuard.Pos.Y})
				newObstructionMap[geom.Point{X: labGuard.Pos.X - 1, Y: labGuard.Pos.Y}] = true
			}
			// if vd.Up {
			// 	po := geom.Point{X: labGuard.Pos.X - 1, Y: labGuard.Pos.Y}
			// 	// fmt.Printf("%+v\n", geom.Point{X: labGuard.Pos.X - 1, Y: labGuard.Pos.Y})
			// 	// fmt.Printf("%+v\n", *vd)
			// 	newObstructionMap[po] = true
			// }
		}

		/* --------- */

		var nVd *VisitedDirection
		if visitedMap[labGuard.Pos] == nil {
			visitedMap[labGuard.Pos] = &VisitedDirection{}
		}
		nVd = visitedMap[labGuard.Pos]
		nVd.SetDirection(labGuard.Direction)

		// fmt.Printf("\n%s %d\n\n", strings.Repeat("_", 6), iterCount)
		// printGrid(day6Input.Grid, visitedMap, *labGuard)
		iterCount++
	}
	newObstructions := []geom.Point{}
	for noPt := range newObstructionMap {
		newObstructions = append(newObstructions, noPt)
	}
	// fmt.Printf("%v\n", newObstructions)
	return len(newObstructions)
}

func printGrid(grid [][]rune, visitedMap map[geom.Point]*VisitedDirection, labGuard LabGuard) {
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
