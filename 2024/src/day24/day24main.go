package day24

import (
	"fmt"
	"regexp"
	"strconv"
)

func Day24Part1(inputLines []string) int {
	day24Input := parseInput(inputLines)
	fmt.Printf("%s\n", day24Input)
	return -1
}

type Day24Input struct {
}

func parseInput(inputLines []string) Day24Input {
	parseInputWires := true
	inputWireRx := regexp.MustCompile(`(\S+): (0|1)`)
	gateRx := regexp.MustCompile(`(\S+) (\S+) (\S+) -> (\S+)`)
	for _, inputLine := range inputLines {
		if parseInputWires {
			match := inputWireRx.FindSubmatch([]byte(inputLine))
			if len(match) > 0 {
				wire := match[1]
				val, err := strconv.Atoi(string(match[2]))
				fmt.Printf("w: %s: %d\n", wire, val)
				if err != nil {
					panic(err)
				}
			} else {
				parseInputWires = false
			}
		} else {
			/* parse gates */
			match := gateRx.FindSubmatch([]byte(inputLine))
			lhs := match[1]
			op := match[2]
			rhs := match[3]
			outWire := match[4]
			fmt.Printf("g: %s %s %s -> %s\n", lhs, op, rhs, outWire)
		}
		// match := rx.FindSubmatch([]byte(inputLine))
		// fmt.Printf("%q\n", match)
		// fmt.Printf("%s\n", inputLine)
	}
	res := Day24Input{}
	return res
}
