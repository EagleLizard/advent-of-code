package day5

import (
	"fmt"
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
4507 - correct
*/
func Day5Pt2(inputLines []string) int {
	parsedInput := parseInput(inputLines)
	rules := parsedInput.Rules
	updates := parsedInput.Updates
	invalidUpdates := [][]int{}
	for _, update := range updates {
		invalidUpdate := !checkUpdate(update, rules)
		if invalidUpdate {
			invalidUpdates = append(invalidUpdates, update)
		}
	}
	sortedUpdates := [][]int{}
	for _, update := range invalidUpdates {
		sortedUpdate := sortUpdate(update, rules)
		sortedUpdates = append(sortedUpdates, sortedUpdate)
	}
	midPageSum := 0
	for _, sortedUpdate := range sortedUpdates {
		midIdx := len(sortedUpdate) / 2
		midPageSum += sortedUpdate[midIdx]
	}
	return midPageSum
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

func sortUpdate(update []int, allRules []Rule) []int {
	rules := getRelevantRules(update, allRules)
	sortedUpdate := update[:]
	ruleBroken := getBrokenRule(sortedUpdate, rules)
	for ruleBroken != nil {
		lhsIdx := slices.Index(sortedUpdate, ruleBroken.Lhs)
		if lhsIdx == -1 {
			panic(fmt.Sprintf("page not found: %d", ruleBroken.Lhs))
		}
		rhsIdx := slices.Index(sortedUpdate, ruleBroken.Rhs)
		if rhsIdx == -1 {
			panic(fmt.Sprintf("page not found: %d", ruleBroken.Rhs))
		}

		sortedUpdate[lhsIdx] = ruleBroken.Rhs
		sortedUpdate[rhsIdx] = ruleBroken.Lhs
		ruleBroken = getBrokenRule(sortedUpdate, rules)
	}
	return sortedUpdate
}

func getBrokenRule(update []int, rules []Rule) *Rule {
	visitedPages := make(map[int]bool)
	for _, currPage := range update {
		for _, rule := range rules {
			if rule.Rhs == currPage && !visitedPages[rule.Lhs] {
				return &rule
			}
		}
		visitedPages[currPage] = true
	}
	return nil
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
