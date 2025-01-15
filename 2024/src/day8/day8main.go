package day8

import (
	"regexp"
	"strings"

	"github.com/EagleLizard/advent-of-code/2024/src/util/geom"
)

type Day8Input struct {
	Width  int
	Height int
	Freqs  map[string][]geom.Point
}

/*
301 - correct
*/
func Day8Pt1(inputLines []string) int {
	day8Input := parseInput(inputLines)
	width := day8Input.Width
	height := day8Input.Height
	antinodeMap := map[geom.Point]bool{}
	for _, freqPts := range day8Input.Freqs {
		currAntinodes := getAntinodes(freqPts)
		for _, antinode := range currAntinodes {
			if antinode.X >= 0 && antinode.X < width && antinode.Y >= 0 && antinode.Y < height {
				antinodeMap[antinode] = true
			}
		}
	}
	return len(antinodeMap)
}

func getAntinodes(freqPts []geom.Point) []geom.Point {
	antinodes := []geom.Point{}
	for i := 0; i < len(freqPts)-1; i++ {
		currPt := freqPts[i]
		for k := i + 1; k < len(freqPts); k++ {
			nextPt := freqPts[k]
			a1 := getAntinode(currPt, nextPt)
			a2 := getAntinode(nextPt, currPt)
			antinodes = append(antinodes, a1, a2)
		}
	}
	return antinodes
}

func getAntinode(p1 geom.Point, p2 geom.Point) geom.Point {
	dx := p2.X - p1.X
	dy := p2.Y - p1.Y
	antinode := geom.Point{
		X: p1.X + dx*2,
		Y: p1.Y + dy*2,
	}
	return antinode
}

func parseInput(inputLines []string) Day8Input {
	w := 0
	h := 0
	freqRx := regexp.MustCompile("[a-zA-Z0-9]")
	freqs := map[string][]geom.Point{}
	for y, inputLine := range inputLines {
		inputLine = strings.TrimSpace(inputLine)
		if len(inputLine) > 0 {
			h++
			if w == 0 {
				w = len(inputLine)
			}
		}
		for x, c := range inputLine {
			charStr := string(c)
			if freqRx.MatchString(charStr) {
				freqs[charStr] = append(freqs[charStr], geom.Point{X: x, Y: y})
			}
		}
	}

	res := Day8Input{
		Width:  w,
		Height: h,
		Freqs:  freqs,
	}
	return res
}
