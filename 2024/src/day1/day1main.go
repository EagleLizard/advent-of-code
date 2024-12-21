package day1

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
)

func Day1Pt2() {
	// list1, list2 := parseInput("day1_test1.txt")
	list1, list2 := parseInput("day1.txt")
	scores := []int{}
	for _, l := range list1 {
		rCount := 0
		for _, r := range list2 {
			if l == r {
				rCount++
			}
		}
		score := l * rCount
		scores = append(scores, score)
	}
	scoreSum := 0
	for _, score := range scores {
		scoreSum += score
	}
	fmt.Printf("%d\n", scoreSum)
}

func Day1Pt1() {
	// list1, list2 := parseInput("day1_test1.txt")
	list1, list2 := parseInput("day1.txt")
	cmpFn := func(i int, j int) int {
		return i - j
	}
	slices.SortStableFunc(list1, cmpFn)
	slices.SortStableFunc(list2, cmpFn)

	listDiffs := []int{}
	for i := range list1 {
		diff := list1[i] - list2[i]
		if diff < 0 {
			diff = -diff
		}
		listDiffs = append(listDiffs, diff)
	}
	diffSum := 0
	for _, n := range listDiffs {
		diffSum += n
	}
	fmt.Printf("%d\n", diffSum)
}

func parseInput(inputFileName string) ([]int, []int) {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	inputFilePath := filepath.Join(wd, "input", inputFileName)
	f, err := os.Open(inputFilePath)
	if err != nil {
		panic(err)
	}
	sc := bufio.NewScanner(f)
	list1 := []int{}
	list2 := []int{}
	rx := regexp.MustCompile(`^(\d+)\s+(\d+)$`)
	for sc.Scan() {
		currLine := sc.Text()
		rxMatch := rx.FindStringSubmatch(currLine)
		n1, err := strconv.Atoi(rxMatch[1])
		if err != nil {
			panic(err)
		}
		n2, err := strconv.Atoi(rxMatch[2])
		if err != nil {
			panic(err)
		}
		list1 = append(list1, n1)
		list2 = append(list2, n2)
	}
	return list1, list2
}
