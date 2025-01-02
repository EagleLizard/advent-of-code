package day4

import (
	"fmt"
)

type Point struct {
	x int
	y int
}

func Day4Pt1(inputLines []string) int {
	searchChars := []rune{'X', 'M', 'A', 'S'}
	searchStrLen := len(searchChars)
	numLines := len(inputLines)
	fmt.Printf("%q\n", searchChars)
	parsedLines := parseInput(inputLines)
	forwardMatches := []Point{}
	downMatches := []Point{}
	backMatches := []Point{}
	upMatches := []Point{}
	// fmt.Printf("%q\n", parsedLines)
	for y, parsedLine := range parsedLines {
		lineLen := len(parsedLine)
		for x, currChar := range parsedLine {
			var forwardMatch bool
			var downMatch bool
			var backMatch bool
			var upMatch bool
			if currChar != searchChars[0] {
				continue
			}
			lookForward := x+searchStrLen < lineLen
			lookDown := y+searchStrLen < numLines
			lookLeft := x-searchStrLen > 0
			lookUp := y-searchStrLen > 0
			// fmt.Printf("%q,", currChar)
			if lookForward {
				/* look forward */
				forwardMatch = true
				for i := 1; forwardMatch && i < searchStrLen; i++ {
					forwardMatch = parsedLine[x+i] == searchChars[i]
				}
				if forwardMatch {
					forwardMatches = append(forwardMatches, Point{x, y})
				}
			}
			if lookDown {
				/* look down */
				downMatch = true
				for i := 1; downMatch && i < searchStrLen; i++ {
					downMatch = parsedLines[y+i][x] == searchChars[i]
				}
				if downMatch {
					fmt.Printf("%q\n", parsedLine)
					downMatches = append(downMatches, Point{x, y})
				}
			}
			if lookLeft {
				/* look left */
				backMatch = true
				for i := 1; backMatch && i < searchStrLen; i++ {
					backMatch = parsedLine[x-i] == searchChars[i]
				}
				if backMatch {
					backMatches = append(backMatches, Point{x, y})
				}
			}
			if lookUp {
				/* look up */
				upMatch = true
				for i := 1; upMatch && i < searchStrLen; i++ {
					upMatch = parsedLines[y-i][x] == searchChars[i]
				}
				if upMatch {
					upMatches = append(upMatches, Point{x, y})
				}
			}

			if lookForward && lookDown {
				/* look SE */
			}
			if lookForward && lookUp {
				/* look NE */
			}
			if lookLeft && lookDown {
				/* look SW */
			}
			if lookLeft && lookUp {
				/* look NW */
			}
		}
		// fmt.Print("\n")
	}
	fmt.Printf("fwd matches:\n%v\n", forwardMatches)
	fmt.Printf("down matches:\n%v\n", downMatches)
	fmt.Printf("back matches:\n%v\n", backMatches)
	fmt.Printf("up matches:\n%v\n", upMatches)
	return -1
}

func parseInput(inputLines []string) [][]rune {
	parsedLines := [][]rune{}
	for _, inputLine := range inputLines {
		currChars := []rune{}
		for _, currChar := range inputLine {
			currChars = append(currChars, currChar)
		}
		parsedLines = append(parsedLines, currChars)
	}
	return parsedLines
}
