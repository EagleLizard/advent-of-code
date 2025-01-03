package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/EagleLizard/advent-of-code/2024/src/day1"
	"github.com/EagleLizard/advent-of-code/2024/src/day2"
	"github.com/EagleLizard/advent-of-code/2024/src/day3"
	"github.com/EagleLizard/advent-of-code/2024/src/day4"
)

type DayPartFn func([]string) int

type RunPartRes struct {
	PartNum  int
	FnTime   time.Duration
	Solution int
}

const (
	// day1InputFileName = "day1_test1.txt"
	day1InputFileName = "day1.txt"
	// day2InputFileName = "day2_test.txt"
	day2InputFileName = "day2.txt"
	// day3InputFileName = "day3_test.txt"
	// day3InputFileName = "day3_test2.txt"
	day3InputFileName = "day3.txt"
	day4InputFileName = "day4_test.txt"
	// day4InputFileName = "day4.txt"
)

func main() {
	aocBanner()

	fmt.Print("\n")
	runDay(1, day1InputFileName, day1.Day1Pt1, day1.Day1Pt2)
	runDay(2, day2InputFileName, day2.Day2Pt1, day2.Day2Pt2)
	runDay(3, day3InputFileName, day3.Day3Pt1, day3.Day3Pt2)
	runDay(4, day4InputFileName, day4.Day4Pt1, day4.Day4Pt2)
}

func runDay(day int, inputFileName string, pt1Fn DayPartFn, pt2Fn DayPartFn) {
	fmt.Printf("~ Day %d ~\n", day)
	inputLines := getInputLines(inputFileName)

	totalStart := time.Now()
	if pt1Fn != nil {
		pt1Res := runPart(1, inputLines, pt1Fn)
		printPart(pt1Res)
	}
	if pt2Fn != nil {
		pt2Res := runPart(2, inputLines, pt2Fn)
		printPart(pt2Res)
	}
	totalElapsedTime := time.Since(totalStart)

	divWidth := 6
	divStr := strings.Repeat("-", divWidth)
	fmt.Printf("total: %v\n", totalElapsedTime)
	fmt.Printf("%s\n", divStr)
}

func runPart(ptNum int, inputLines []string, ptFn DayPartFn) RunPartRes {
	startTime := time.Now()
	ptSolution := ptFn(inputLines)
	elapsed := time.Since(startTime)
	partRes := RunPartRes{
		PartNum:  ptNum,
		FnTime:   elapsed,
		Solution: ptSolution,
	}
	return partRes
}

func printPart(ptRes RunPartRes) {
	fmt.Printf("Part %d: %d | %v\n", ptRes.PartNum, ptRes.Solution, ptRes.FnTime)
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
