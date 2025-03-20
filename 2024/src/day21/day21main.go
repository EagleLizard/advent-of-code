package day21

import (
	"fmt"
	"regexp"
)

func Day21Part1(inputLines []string) int {
	day21Input := parseInput(inputLines)

	fmt.Printf("%q\n", day21Input)
	return -1
}

type Day21Input struct {
	Keycodes []string
}

func parseInput(inputLines []string) Day21Input {
	keycodeRx := regexp.MustCompile(`\d+A`)
	keycodes := []string{}
	for _, inputLine := range inputLines {
		rxMatch := keycodeRx.FindString(inputLine)
		if len(rxMatch) > 0 {
			keycodes = append(keycodes, rxMatch)
		}
	}
	res := Day21Input{
		Keycodes: keycodes,
	}
	return res
}
