package day21

import "fmt"

func Day21Part1(inputLines []string) int {
	day21Input := parseInput(inputLines)

	fmt.Printf("%q\n", day21Input)
	return -1
}

type Day21Input struct{}

func parseInput(inputLines []string) Day21Input {
	res := Day21Input{}
	return res
}
