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
			// if currChar == searchChars[0] {
			// 	fmt.Printf("%q ", currChar)
			// } else {
			// 	fmt.Print("' ' ")
			// }
			var forwardMatch bool
			var downMatch bool
			var backMatch bool
			var upMatch bool
			if currChar != searchChars[0] {
				continue
			}
			// fmt.Printf("%q,", currChar)
			if x+searchStrLen < lineLen {
				/* look forward */
				forwardMatch = true
				for i := 1; i < searchStrLen; i++ {
					forwardMatch = parsedLine[x+i] == searchChars[i]
					if !forwardMatch {
						break
					}
				}
				if forwardMatch {
					forwardMatches = append(forwardMatches, Point{
						x: x,
						y: y,
					})
				}
			}
			if y+searchStrLen < numLines {
				/* look down */
				downMatch = true
				for i := 1; i < searchStrLen; i++ {
					downMatch = parsedLines[y+i][x] == searchChars[i]
					if !downMatch {
						break
					}
				}
				if downMatch {
					fmt.Printf("%q\n", parsedLine)
					downMatches = append(downMatches, Point{
						x: x,
						y: y,
					})
				}
			}
			if x-searchStrLen > 0 {
				/* look left */
				backMatch = true
				for i := 1; i < searchStrLen; i++ {
					backMatch = parsedLine[x-i] == searchChars[i]
					if !backMatch {
						break
					}
				}
				if backMatch {
					backMatches = append(backMatches, Point{
						x: x,
						y: y,
					})
				}
			}
			if y-searchStrLen > 0 {
				/* look up */
				upMatch = true
				for i := 1; i < searchStrLen; i++ {
					upMatch = parsedLines[y-i][x] == searchChars[i]
					if !upMatch {
						break
					}
				}
				if upMatch {
					upMatches = append(upMatches, Point{
						x: x,
						y: y,
					})
				}
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
