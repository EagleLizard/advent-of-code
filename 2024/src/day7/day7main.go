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

/*
5540634308465 - too high
5540634308362 - correct
*/
func Day7Pt1(inputLines []string) int {
	day7Inputs := parseInput(inputLines)
	calibrationResult := 0
	for _, currInput := range day7Inputs {
		// fmt.Printf("%d: ", currInput.TestVal)
		// for _, currNum := range currInput.Nums {
		// 	fmt.Printf("%d ", currNum)
		// }
		// fmt.Print("\n")
		ops := []string{"+", "*"}
		validEq := checkEquation(currInput.TestVal, currInput.Nums[1:], ops, currInput.Nums[0])
		if validEq {
			calibrationResult += currInput.TestVal
		}
		// fmt.Printf("%v\n", validEq)
	}
	return calibrationResult
}

func Day7Pt2(inputLines []string) int {
	// day7Inputs := parseInput(inputLines)
	return -1
}

func checkEquation(testVal int, nums []int, ops []string, res int) bool {
	if len(nums) == 0 {
		return res == testVal
	}
	/*
		try different combinations
		1 2 3 4
	*/
	for _, op := range ops {
		currRes := doOp(op, res, nums[0])
		isValid := checkEquation(testVal, nums[1:], ops, currRes)
		if isValid {
			return true
		}
	}
	return false
}

func doOp(op string, a int, b int) int {
	switch op {
	case "+":
		return a + b
	case "*":
		return a * b
	case "||":
		res, err := strconv.Atoi(fmt.Sprintf("%d%d", a, b))
		if err != nil {
			panic(err)
		}
		return res
	}
	panic(fmt.Sprintf("invalid op: %s", op))
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
