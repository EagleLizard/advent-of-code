package day4

import (
	"fmt"

	"github.com/EagleLizard/advent-of-code/2024/src/util/geom"
)

func Day4Pt2(inputLines []string) int {
	searchChars := []rune{'M', 'A', 'S'}
	searchStrLen := len(searchChars)
	fmt.Printf("%q\n", searchChars)
	parsedLines := parseInput(inputLines)
	numLines := len(parsedLines)
	matchCount := 0
	pivotIdx := searchStrLen / 2
	pivotChar := searchChars[pivotIdx]

	neMatches := []geom.Point[int]{}
	for y, parsedLine := range parsedLines {
		// fmt.Printf("%q %d\n", parsedLine, y)
		lineLen := len(parsedLine)
		for x := range parsedLine {
			currChar := parsedLines[y][x]
			// if currChar == pivotChar {
			// 	fmt.Printf("%c", pivotChar)
			// } else {
			// 	fmt.Printf(".")
			// }
			if currChar != pivotChar {
				continue
			}
			crossWidth := searchStrLen / 2
			checkCross := ((x+crossWidth < lineLen) &&
				(y+crossWidth < numLines) &&
				(x-crossWidth >= 0) &&
				(y-crossWidth >= 0))
			if checkCross {
				// fmt.Printf("%d, %d\n", x, y)
				/* check SW-> NE */
				var matchUp bool
				// var matchDown bool
				if parsedLines[y+crossWidth][x-crossWidth] == searchChars[0] {
					/* forward */
					matchUp = true
					for i := 0; matchUp && i < searchStrLen; i++ {
						matchUp = parsedLines[(y+crossWidth)-i][(x-crossWidth)+i] == searchChars[i]
					}
				} else if parsedLines[y+crossWidth][x-crossWidth] == searchChars[searchStrLen-1] {
					/* backward */
					matchUp = true
					for i := 0; matchUp && i < searchStrLen; i++ {
						matchUp = parsedLines[(y+crossWidth)-i][(x-crossWidth)+i] == searchChars[searchStrLen-i-1]
					}
					// matchUp = false
				}
				if matchUp {
					neMatches = append(neMatches, geom.Point[int]{X: x, Y: y})
				}
				/* check NW-> SE */
			}
		}
		fmt.Print("\n")
	}
	fmt.Printf("neMatches:\n%v\n", neMatches)
	return matchCount
}

/*
2310 - too low
2336 - correct
*/
func Day4Pt1(inputLines []string) int {
	searchChars := []rune{'X', 'M', 'A', 'S'}
	searchStrLen := len(searchChars)
	numLines := len(inputLines)
	parsedLines := parseInput(inputLines)

	matchCount := 0
	// fmt.Printf("%q\n", parsedLines)
	for y, parsedLine := range parsedLines {
		lineLen := len(parsedLine)
		for x, currChar := range parsedLine {
			var forwardMatch bool
			var downMatch bool
			var backMatch bool
			var upMatch bool
			/* diagonal */
			var seMatch bool
			var neMatch bool
			var swMatch bool
			var nwMatch bool
			if currChar != searchChars[0] {
				continue
			}
			lookForward := x+(searchStrLen-1) < lineLen
			lookDown := y+(searchStrLen-1) < numLines
			lookLeft := x-(searchStrLen-1) >= 0
			lookUp := y-(searchStrLen-1) >= 0
			if lookForward {
				/* look forward */
				forwardMatch = true
				for i := 1; forwardMatch && i < searchStrLen; i++ {
					forwardMatch = parsedLine[x+i] == searchChars[i]
				}
				if forwardMatch {
					matchCount++
				}
			}
			if lookDown {
				/* look down */
				downMatch = true
				for i := 1; downMatch && i < searchStrLen; i++ {
					downMatch = parsedLines[y+i][x] == searchChars[i]
				}
				if downMatch {
					matchCount++
				}
			}
			if lookLeft {
				/* look left */
				backMatch = true
				for i := 1; backMatch && i < searchStrLen; i++ {
					backMatch = parsedLine[x-i] == searchChars[i]
				}
				if backMatch {
					matchCount++
				}
			}
			if lookUp {
				/* look up */
				upMatch = true
				for i := 1; upMatch && i < searchStrLen; i++ {
					upMatch = parsedLines[y-i][x] == searchChars[i]
				}
				if upMatch {
					matchCount++
				}
			}

			if lookForward && lookDown {
				/* look SE */
				seMatch = true
				for i := 1; seMatch && i < searchStrLen; i++ {
					seMatch = parsedLines[y+i][x+i] == searchChars[i]
				}
				if seMatch {
					matchCount++
				}
			}
			if lookForward && lookUp {
				/* look NE */
				neMatch = true
				for i := 1; neMatch && i < searchStrLen; i++ {
					neMatch = parsedLines[y-i][x+i] == searchChars[i]
				}
				if neMatch {
					matchCount++
				}
			}
			if lookLeft && lookDown {
				/* look SW */
				swMatch = true
				for i := 1; swMatch && i < searchStrLen; i++ {
					swMatch = parsedLines[y+i][x-i] == searchChars[i]
				}
				if swMatch {
					matchCount++
				}
			}
			if lookLeft && lookUp {
				/* look NW */
				nwMatch = true
				for i := 1; nwMatch && i < searchStrLen; i++ {
					nwMatch = parsedLines[y-i][x-i] == searchChars[i]
				}
				if nwMatch {
					matchCount++
				}
			}
		}
		// fmt.Print("\n")
	}

	return matchCount
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
