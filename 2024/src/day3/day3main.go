package day3

import (
	"regexp"
	"strconv"
	"strings"
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

func Day3Pt2(inputLines []string) int {
	rx := regexp.MustCompile(`(do\(\)|don't\(\))|mul\(([0-9]{1,3}),([0-9]{1,3})\)`)
	doMul := true
	mulSum := 0
	for _, inputLine := range inputLines {
		lineLen := len(inputLine)
		for cursorPos := 0; cursorPos < lineLen; {
			match := rx.FindStringSubmatchIndex(inputLine[cursorPos:])
			if match == nil {
				// no more matches
				break
			}
			var fullMatchStart int
			var fullMatchEnd int
			if match[0] != -1 {
				fullMatchStart = cursorPos + match[0]
			}
			if match[1] != -1 {
				fullMatchEnd = cursorPos + match[1]
			}
			fullMatchStr := inputLine[fullMatchStart:fullMatchEnd]
			if fullMatchStr == "do()" {
				doMul = true
			} else if fullMatchStr == "don't()" {
				doMul = false
			} else if doMul && strings.HasPrefix(fullMatchStr, "mul") {
				lhsStart := cursorPos + match[4]
				lhsEnd := cursorPos + match[5]
				rhsStart := cursorPos + match[6]
				rhsEnd := cursorPos + match[7]
				lhsStr := inputLine[lhsStart:lhsEnd]
				rhsStr := inputLine[rhsStart:rhsEnd]
				lhs, err := strconv.Atoi(lhsStr)
				if err != nil {
					panic(err)
				}
				rhs, err := strconv.Atoi(rhsStr)
				if err != nil {
					panic(err)
				}
				mulSum += lhs * rhs
			}
			cursorPos += match[1]
		}
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
