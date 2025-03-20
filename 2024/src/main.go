package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	"github.com/EagleLizard/advent-of-code/2024/src/day1"
	"github.com/EagleLizard/advent-of-code/2024/src/day2"
	"github.com/EagleLizard/advent-of-code/2024/src/day21"
	"github.com/EagleLizard/advent-of-code/2024/src/day24"
	"github.com/EagleLizard/advent-of-code/2024/src/day3"
	"github.com/EagleLizard/advent-of-code/2024/src/day4"
	"github.com/EagleLizard/advent-of-code/2024/src/day5"
	"github.com/EagleLizard/advent-of-code/2024/src/day6"
	"github.com/EagleLizard/advent-of-code/2024/src/day7"
	"github.com/EagleLizard/advent-of-code/2024/src/day8"
	"github.com/EagleLizard/advent-of-code/2024/src/util/clicolors"
)

type CliOpts struct {
	Day int
}

type DayPartFn func([]string) int

type RunPartRes struct {
	PartNum  int
	FnTime   time.Duration
	Solution int
}

type RunDayOpts struct {
	Day           int
	InputFileName string
	Part1Fn       DayPartFn
	Part2Fn       DayPartFn
}

const (
	// day1InputFileName = "day1_test1.txt"
	day1InputFileName = "day1.txt"
	// day2InputFileName = "day2_test.txt"
	day2InputFileName = "day2.txt"
	// day3InputFileName = "day3_test.txt"
	// day3InputFileName = "day3_test2.txt"
	day3InputFileName = "day3.txt"
	// day4InputFileName = "day4_test.txt"
	day4InputFileName = "day4.txt"
	// day5InputFileName = "day5_test.txt"
	day5InputFileName = "day5.txt"
	// day6InputFileName = "day6_test.txt"
	day6InputFileName = "day6.txt"
	// day7InputFileName = "day7_test.txt"
	day7InputFileName = "day7.txt"
	// day8InputFileName = "day8_test.txt"
	day8InputFileName  = "day8.txt"
	day21InputFileName = "day21_test.txt"
	day24InputFileName = "day24_test1.txt"
)

var dayOptsArr = []RunDayOpts{
	{1, day1InputFileName, day1.Day1Pt1, day1.Day1Pt2},
	{2, day2InputFileName, day2.Day2Pt1, day2.Day2Pt2},
	{3, day3InputFileName, day3.Day3Pt1, day3.Day3Pt2},
	{4, day4InputFileName, day4.Day4Pt1, day4.Day4Pt2},
	{5, day5InputFileName, day5.Day5Pt1, day5.Day5Pt2},
	{6, day6InputFileName, day6.Day6Pt1, day6.Day6Pt2},
	{7, day7InputFileName, day7.Day7Pt1, day7.Day7Pt2},
	{8, day8InputFileName, day8.Day8Pt1, day8.Day8Pt2},
	{21, day21InputFileName, day21.Day21Part1, nil},
	{24, day24InputFileName, day24.Day24Part1, nil},
}

var theme = clicolors.NewTheme(
	clicolors.ChartreuseLight,
	clicolors.Cyan,
	clicolors.Pear,
	clicolors.WhiteBright,
)

func main() {
	cliOpts := initCli()
	// fmt.Printf("%+v\n", cliOpts)
	aocBanner(theme)

	fmt.Print("\n")
	daysToRun := []RunDayOpts{}

	if cliOpts.Day == 0 {
		daysToRun = dayOptsArr[:]
	} else {
		foundIdx := slices.IndexFunc(dayOptsArr, func(dayOpts RunDayOpts) bool {
			return dayOpts.Day == cliOpts.Day
		})
		if foundIdx == -1 {
			panic(fmt.Sprintf("Day not found: %d", cliOpts.Day))
		}
		daysToRun = append(daysToRun, dayOptsArr[foundIdx])
	}

	for _, dayOpts := range daysToRun {
		runDay(theme, dayOpts.Day, dayOpts.InputFileName, dayOpts.Part1Fn, dayOpts.Part2Fn)
	}
}

func initCli() CliOpts {
	dayFlag := flag.Int("d", 0, "aoc2024 day to run")
	flag.Parse()
	res := CliOpts{
		Day: *dayFlag,
	}
	return res
}

func runDay(t clicolors.Theme, day int, inputFileName string, pt1Fn DayPartFn, pt2Fn DayPartFn) {
	dayBannerTxt := fmt.Sprintf("~ Day %d ~\n", day)
	dayBanner := t.C1(dayBannerTxt)
	fmt.Printf("%s\n", dayBanner)
	inputLines := getInputLines(inputFileName)

	totalStart := time.Now()
	if pt1Fn != nil {
		pt1Res := runPart(1, inputLines, pt1Fn)
		printPart(t, pt1Res)
	}
	if pt2Fn != nil {
		pt2Res := runPart(2, inputLines, pt2Fn)
		printPart(t, pt2Res)
	}
	totalElapsedTime := time.Since(totalStart)

	divWidth := 6
	divStr := strings.Repeat("-", divWidth)

	totalTxt := t.C1("total")
	totalTimeStr := t.C2(totalElapsedTime)
	totalStr := t.Italic(fmt.Sprintf("%s: %s", totalTxt, totalTimeStr))
	fmt.Printf("%s\n%s\n", totalStr, divStr)
	// fmt.Printf("total: %v\n", totalElapsedTime)
	// fmt.Printf("%s\n", divStr)
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

func printPart(t clicolors.Theme, ptRes RunPartRes) {
	solutionStr := t.C3(ptRes.Solution)
	timeStr := t.C2(ptRes.FnTime)
	partTxt := t.C1(fmt.Sprintf("Part %d", ptRes.PartNum))
	partStr := fmt.Sprintf("%s: %s | %s", partTxt, solutionStr, timeStr)
	fmt.Println(partStr)
	// fmt.Printf("Part %d: %d | %v\n", ptRes.PartNum, ptRes.Solution, ptRes.FnTime)
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

func aocBanner(t clicolors.Theme) {
	// ¡™£¢∞§¶•ªª œ∑´®†¥¨ˆøπ åß∂ƒ©˙∆˚¬… ≈ç√∫˜µ≤≥÷
	padStr := "÷"
	left := t.C1(padStr)
	right := t.C1(padStr)
	bannerTxt := " Advent of Code 2024 [go] "
	bannerTxtStr := t.C4(bannerTxt)
	topTxt := strings.Repeat(padStr, len(bannerTxt)+(len(padStr)*2))
	bottomText := topTxt
	top := t.C1(topTxt)
	bottom := t.Underline(t.C1(bottomText))
	fmt.Printf("%s\n", top)
	fmt.Printf("%s %s %s\n", left, bannerTxtStr, right)
	fmt.Printf("%s\n", bottom)
}
