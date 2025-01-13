package day7

import (
	"fmt"
	"strconv"
	"strings"
)

type Day7Input struct {
	TestVal int
	Nums    []int
}

func Day7Pt1(inputLines []string) int {
	day7Inputs := parseInput(inputLines)
	for _, currInput := range day7Inputs {
		fmt.Printf("%d: ", currInput.TestVal)
		for _, currNum := range currInput.Nums {
			fmt.Printf("%d ", currNum)
		}
		fmt.Print("\n")
	}
	return -1
}

func parseInput(inputLines []string) []Day7Input {
	res := []Day7Input{}
	for _, inputLine := range inputLines {
		inputParts := strings.Split(inputLine, ": ")
		testValPart := inputParts[0]
		testVal, err := strconv.Atoi(testValPart)
		if err != nil {
			panic(err)
		}
		numsPart := inputParts[1]
		numStrs := strings.Split(numsPart, " ")
		nums := []int{}
		for _, numStr := range numStrs {
			num, err := strconv.Atoi(numStr)
			if err != nil {
				panic(err)
			}
			nums = append(nums, num)
		}
		currInput := Day7Input{
			TestVal: testVal,
			Nums:    nums,
		}
		res = append(res, currInput)
	}
	return res
}
