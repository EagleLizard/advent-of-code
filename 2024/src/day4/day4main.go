package day4

import (
	"fmt"
)

func Day4Pt1(inputLines []string) int {
	searchChars := []rune{'X', 'M', 'A', 'S'}
	searchStrLen := len(searchChars)
	numLines := len(inputLines)
	fmt.Printf("%q\n", searchChars)
	parsedLines := parseInput(inputLines)
	// fmt.Printf("%q\n", parsedLines)
	for y, parsedLine := range parsedLines {
		lineLen := len(parsedLine)
		for x, currChar := range parsedLine {
			// if currChar == searchChars[0] {
			// 	fmt.Printf("%q ", currChar)
			// } else {
			// 	fmt.Print("' ' ")
			// }
			if currChar != searchChars[0] {
				continue
			}
			// fmt.Printf("%q,", currChar)
			if x+searchStrLen < lineLen {
				/* look forward */
			}
			if y+searchStrLen < numLines {
				/* look down */
			}
			if x-searchStrLen > 0 {
				/* look left */
			}
			if y-searchStrLen > 0 {
				/* look up */
			}
		}
		// fmt.Print("\n")
	}
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
