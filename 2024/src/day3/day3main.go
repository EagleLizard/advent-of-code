package day3

import (
	"regexp"
	"strconv"
)

type MulInstruction struct {
	Lhs int
	Rhs int
}

func Day3Pt1(inputLines []string) int {
	mulInstructions := parseInput(inputLines)
	mulSum := 0
	for _, mulInstruction := range mulInstructions {
		mulSum += mulInstruction.Lhs * mulInstruction.Rhs
	}
	return mulSum
}

func parseInput(inputLines []string) []MulInstruction {
	mulInstructions := []MulInstruction{}
	for _, inputLine := range inputLines {
		mulRx := regexp.MustCompile(`mul\(([0-9]{1,3}),([0-9]{1,3})\)`)
		lineLen := len(inputLine)
		for cursorPos := 0; cursorPos < lineLen; {
			match := mulRx.FindStringSubmatchIndex(inputLine[cursorPos:])
			if match == nil {
				// no more matches
				break
			}
			lhsStart := cursorPos + match[2]
			lhsEnd := cursorPos + match[3]
			rhsStart := cursorPos + match[4]
			rhsEnd := cursorPos + match[5]
			lhsMatch := inputLine[lhsStart:lhsEnd]
			rhsMatch := inputLine[rhsStart:rhsEnd]
			cursorPos = cursorPos + match[1]
			lhs, err := strconv.Atoi(lhsMatch)
			if err != nil {
				panic(err)
			}
			rhs, err := strconv.Atoi(rhsMatch)
			if err != nil {
				panic(err)
			}
			mulInstruction := MulInstruction{
				Lhs: lhs,
				Rhs: rhs,
			}
			mulInstructions = append(mulInstructions, mulInstruction)
		}
	}

	return mulInstructions
}
