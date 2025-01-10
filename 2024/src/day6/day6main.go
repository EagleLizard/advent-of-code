package day6

import (
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
