package day5

import (
	"slices"
	"strconv"
	"strings"
)

type Rule struct {
	Lhs int
	Rhs int
}

type Day5Input struct {
	Rules   []Rule
	Updates [][]int
}

/*
5248 - correct
*/
func Day5Pt1(inputLines []string) int {
	parsedInput := parseInput(inputLines)
	rules := parsedInput.Rules
	updates := parsedInput.Updates
	validUpdates := [][]int{}
	for _, update := range updates {
		validUpdate := checkUpdate(update, rules)
		if validUpdate {
			validUpdates = append(validUpdates, update)
		}
	}
	midPageSum := 0
	for _, validUpdate := range validUpdates {
		midIdx := len(validUpdate) / 2
		midPageSum += validUpdate[midIdx]
	}
	return midPageSum
}

func checkUpdate(update []int, allRules []Rule) bool {
	rules := getRelevantRules(update, allRules)
	visitedPages := make(map[int]bool)
	for _, currPageNum := range update {
		for _, rule := range rules {
			if rule.Rhs == currPageNum && !visitedPages[rule.Lhs] {
				return false
			}
		}
		visitedPages[currPageNum] = true
	}
	return true
}

func getRelevantRules(update []int, allRules []Rule) []Rule {
	rules := []Rule{}
	for _, rule := range allRules {
		if slices.Contains(update, rule.Lhs) && slices.Contains(update, rule.Rhs) {
			rules = append(rules, rule)
		}
	}
	return rules
}

func parseInput(inputLines []string) Day5Input {
	parseRules := true
	rules := []Rule{}
	updates := [][]int{}
	for _, inputLine := range inputLines {
		if parseRules {
			pipeIdx := strings.Index(inputLine, "|")
			if pipeIdx == -1 {
				parseRules = false
			} else {
				ruleParts := strings.Split(inputLine, "|")
				lhs, err := strconv.Atoi(ruleParts[0])
				if err != nil {
					panic(err)
				}
				rhs, err := strconv.Atoi(ruleParts[1])
				if err != nil {
					panic(err)
				}
				rule := Rule{lhs, rhs}
				rules = append(rules, rule)
			}
		} else {
			updateParts := strings.Split(inputLine, ",")
			pageNums := []int{}
			for _, updatePart := range updateParts {
				pageNum, err := strconv.Atoi(updatePart)
				if err != nil {
					panic(err)
				}
				pageNums = append(pageNums, pageNum)
			}
			updates = append(updates, pageNums)
		}
	}
	res := Day5Input{
		Rules:   rules,
		Updates: updates,
	}
	return res
}
