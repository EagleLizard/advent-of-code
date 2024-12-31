package day2

import (
	"regexp"
	"slices"
	"strconv"
)

/*
part1:
	318 - too high
	223 - too low
part2:
*/

func Day2Pt1(inputLines []string) int {
	// reports := parseInput("day2_test.txt")
	// reports := parseInput("day2.txt")
	reports := parseInput(inputLines)
	safeReportCount := 0
	for _, report := range reports {
		reportSafe := checkReportSafe(report)
		if reportSafe {
			safeReportCount++
		}
	}
	return safeReportCount
}

func Day2Pt2(inputLines []string) int {
	// reports := parseInput("day2_test.txt")
	// reports := parseInput("day2.txt")
	reports := parseInput(inputLines)
	safeReportCount := 0
	for i := 0; i < len(reports); i++ {
		reportSafe := checkReportSafe2(reports[i])
		if reportSafe {
			safeReportCount++
		}
	}
	return safeReportCount
}

func checkReportSafe2(report []int) bool {
	reportSafe := checkReportSafe(report)
	for i := 0; !reportSafe && i < len(report); i++ {
		/*
			Remove every level and retest
				(brute force)
		*/
		dampReport := slices.Delete(slices.Clone(report), i, i+1)
		reportSafe = checkReportSafe(dampReport)
		if reportSafe {
			break
		}
	}
	return reportSafe
}

func checkReportSafe(report []int) bool {
	diffs := []int{}
	prevLvl := report[0]
	for i := 1; i < len(report); i++ {
		currDiff := prevLvl - report[i]
		diffs = append(diffs, currDiff)
		prevLvl = report[i]
	}

	reportSafe := true
	for i := 0; i < len(diffs); i++ {
		currDiff := diffs[i]
		if currDiff == 0 {
			reportSafe = false
		} else if i > 0 {
			prevDiff := diffs[i-1]
			if currDiff > 0 && prevDiff < 0 {
				reportSafe = false // down to up
			} else if currDiff < 0 && prevDiff > 0 {
				reportSafe = false // up to down
			}
		}
		if currDiff < 0 {
			currDiff = -currDiff
		}
		if currDiff > 3 {
			reportSafe = false
		}
		if !reportSafe {
			break
		}
	}
	return reportSafe
}

func parseInput(inputLines []string) [][]int {
	levelRx := regexp.MustCompile(`\d+`)
	reports := [][]int{}
	for _, currLine := range inputLines {
		lvlStrs := levelRx.FindAllString(currLine, -1)
		currLvls := []int{}
		for _, lvlStr := range lvlStrs {
			lvl, err := strconv.Atoi(lvlStr)
			if err != nil {
				panic(err)
			}
			currLvls = append(currLvls, lvl)
		}
		reports = append(reports, currLvls)
	}
	return reports
}
