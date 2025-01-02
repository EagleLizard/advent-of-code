package day4

import (
	"fmt"
)

type Point struct {
	x int
	y int
}

/*
2310 - too low
*/

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
	/* diagonal */
	seMatches := []Point{}
	neMatches := []Point{}
	swMatches := []Point{}
	nwMatches := []Point{}

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
			// if currChar == 'X' {
			// 	fmt.Print("X")
			// } else {
			// 	fmt.Print(".")
			// }
			if currChar != searchChars[0] {
				continue
			}
			lookForward := x+searchStrLen < lineLen
			lookDown := y+searchStrLen < numLines
			lookLeft := x-(searchStrLen-1) >= 0
			lookUp := y-(searchStrLen-1) >= 0
			// fmt.Printf("%q,", currChar)
			if lookForward {
				/* look forward */
				forwardMatch = true
				for i := 1; forwardMatch && i < searchStrLen; i++ {
					forwardMatch = parsedLine[x+i] == searchChars[i]
				}
				if forwardMatch {
					matchCount++
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
					matchCount++
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
					matchCount++
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
					matchCount++
					upMatches = append(upMatches, Point{x, y})
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
					seMatches = append(seMatches, Point{x, y})
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
					neMatches = append(neMatches, Point{x, y})
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
					swMatches = append(swMatches, Point{x, y})
				}
			}
			if lookLeft && lookUp {
				/* look NW */
				nwMatch = true
				for i := 1; nwMatch && i < searchStrLen; i++ {
					// if x == 4 && y == 9 {
					// 	fmt.Printf("%v\n", parsedLines[y-i][x-i])
					// }
					nwMatch = parsedLines[y-i][x-i] == searchChars[i]
				}
				if nwMatch {
					matchCount++
					nwMatches = append(nwMatches, Point{x, y})
				}
			}
			// if x == 3 && y == 9 {
			// 	fmt.Printf("up: %v,\n down: %v,\n left: %v,\n right: %v,\n ", lookUp, lookDown, lookLeft, lookForward)
			// }
		}
		// fmt.Print("\n")
	}
	// fmt.Printf("fwd matches:\n%v\n", forwardMatches)
	// fmt.Printf("down matches:\n%v\n", downMatches)
	// fmt.Printf("back matches:\n%v\n", backMatches)
	// fmt.Printf("up matches:\n%v\n", upMatches)
	// /* diagonal */
	// fmt.Printf("SE matches:\n%v\n", seMatches)
	// fmt.Printf("NE matches:\n%v\n", neMatches)
	// fmt.Printf("SW matches:\n%v\n", swMatches)
	// fmt.Printf("NW matches:\n%v\n", nwMatches)

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
