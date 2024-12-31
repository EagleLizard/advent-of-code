package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"

	"github.com/EagleLizard/advent-of-code/2024/src/day1"
	"github.com/EagleLizard/advent-of-code/2024/src/day2"
)

type DayPartFn func([]string) int

const (
	// day1InputFileName = "day1_test1.txt"
	day1InputFileName = "day1.txt"
)

func main() {
	aocBanner()

	fmt.Println("~ Day 2 ~")
	fmt.Println("Part 1:")
	day2.Day2Pt1()
	fmt.Println("Part 2:")
	day2.Day2Pt2()

	fmt.Print("\n")
	// runDay(1, "day1.txt", day1.Day1Pt1, day1.Day1Pt2)
	runDay(1, day1InputFileName, day1.Day1Pt1, day1.Day1Pt2)
}

func runDay(day int, inputFileName string, pt1Fn DayPartFn, pt2Fn DayPartFn) {
	fmt.Printf("~ Day %d ~\n", day)
	inputLines := getInputLines(inputFileName)

	if pt1Fn != nil {
		fmt.Print("Part 1:\n")
		pt1Res := pt1Fn(inputLines)
		fmt.Printf("%d\n", pt1Res)
	}
	if pt2Fn != nil {
		fmt.Print("Part 2:\n")
		pt2Res := pt2Fn(inputLines)
		fmt.Printf("%v\n", pt2Res)
	}
}

func getInputLines(inputFileName string) []string {
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
	inputLines := []string{}
	for sc.Scan() {
		currLine := sc.Text()
		inputLines = append(inputLines, currLine)
	}
	return inputLines
}

func aocBanner() {
	padStr := "*"
	pre := padStr
	post := padStr
	bannerTxt := "Advent of Code 2024 [go]"
	fmt.Printf("%s %s %s\n", pre, bannerTxt, post)
}
