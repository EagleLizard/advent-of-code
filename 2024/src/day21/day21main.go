package day21

import (
	"fmt"
	"math"
	"regexp"
	"slices"
	"strconv"
	"strings"

	"github.com/EagleLizard/advent-of-code/2024/src/util/geom"
)

var keypad = [][]string{
	{"7", "8", "9"},
	{"4", "5", "6"},
	{"1", "2", "3"},
	{" ", "0", "A"},
}
var keypadWidth = len(keypad[0])
var keypadHeight = len(keypad)
var dirpad = [][]string{
	{" ", "^", "A"},
	{"<", "v", ">"},
}
var dirpadWidth = len(dirpad[0])
var dirpadHeight = len(dirpad)

// up,right,down,left
var directions = []geom.Point{
	{X: 0, Y: -1},
	{X: 1, Y: 0},
	{X: 0, Y: 1},
	{X: -1, Y: 0},
}

/*
202648 - correct
*/
func Day21Part1(inputLines []string) int {
	day21Input := parseInput(inputLines)
	complexitySum := 0
	fmt.Printf("%q\n", day21Input)
	for _, keyCode := range day21Input.Keycodes {
		fmt.Printf("%s\n", keyCode)
		keycodePath := strings.Split(keyCode, "")
		keycodePath = slices.Insert(keycodePath, 0, "A")
		// fmt.Printf("kcp: %v\n", strings.Join(keycodePath, " "))
		numpadDirpadSteps := [][][]string{}
		min2ndLvlPaths := [][]string{}
		min2ndLvlPathLen := math.MaxInt

		for k := range len(keycodePath) - 1 {
			from := keycodePath[k]
			to := keycodePath[k+1]
			numpadPaths := getNumpadPaths(from, to)
			// fmt.Printf("%v\n", numpadPaths)
			numpadDirpadSteps = append(numpadDirpadSteps, numpadPaths)
		}
		// fmt.Printf("%v\n", numpadDirpadSteps)
		pNpdPaths := getPossiblePaths(numpadDirpadSteps)
		for _, pNpdPath := range pNpdPaths {
			// fmt.Printf("%v\n", pNpdPath)
			pNpdKeyPath := slices.Insert(slices.Clone(pNpdPath), 0, "A")
			dirpadDirpadSteps := [][][]string{}
			for k := range len(pNpdKeyPath) - 1 {
				from := pNpdKeyPath[k]
				to := pNpdKeyPath[k+1]
				// fmt.Printf("  %q -> %q\n", from, to)
				dirpadPaths := getDirpadPaths(from, to)
				dirpadDirpadSteps = append(dirpadDirpadSteps, dirpadPaths)
			}
			// fmt.Printf("%v\n", len(dirpadDirpadSteps))
			pDpdPaths := getPossiblePaths(dirpadDirpadSteps)
			for _, pDpdPath := range pDpdPaths {
				pDpdKeyPath := slices.Insert(slices.Clone(pDpdPath), 0, "A")
				dpdDirpadSteps := [][][]string{}
				for k := range len(pDpdKeyPath) - 1 {
					from := pDpdKeyPath[k]
					to := pDpdKeyPath[k+1]
					dpdDirpadPaths := getDirpadPaths(from, to)
					dpdDirpadSteps = append(dpdDirpadSteps, dpdDirpadPaths)
				}
				pDpdDpdPaths := getPossiblePaths(dpdDirpadSteps)
				for _, pDpdDpdPath := range pDpdDpdPaths {
					if len(pDpdDpdPath) < min2ndLvlPathLen {
						min2ndLvlPathLen = len(pDpdDpdPath)
						// min2ndLvlPaths = [][]string{}
					}
					if len(pDpdDpdPath) <= min2ndLvlPathLen {
						min2ndLvlPaths = append(min2ndLvlPaths, pDpdDpdPath)
					}
				}
				// fmt.Printf("%v\n", len(pDpdDpdPaths))
			}
		}
		// fmt.Printf("%v\n", len(min2ndLvlPaths))
		fmt.Printf("%v\n", min2ndLvlPathLen)
		// break
		keycodeNumStr := string(regexp.MustCompile(`(\d+)A`).FindSubmatch([]byte(keyCode))[1])
		keycodeNum, err := strconv.Atoi(keycodeNumStr)
		if err != nil {
			panic(err)
		}
		complexityScore := min2ndLvlPathLen * keycodeNum
		// fmt.Printf("%v\n", keycodeNum)
		complexitySum += complexityScore
	}
	return complexitySum
}

func getPossiblePaths(pathSteps [][][]string) [][]string {
	possiblePaths := [][]string{}
	getPossiblePathsHelper(pathSteps, [][]string{}, func(foundPath []string) {
		// fmt.Printf("%v\n", strings.Join(foundPath, ""))
		possiblePaths = append(possiblePaths, foundPath)
	})
	return possiblePaths
}

func getPossiblePathsHelper(pathSteps [][][]string, pathSoFar [][]string, foundFn func([]string)) {
	if len(pathSteps) < 1 {
		foundPath := []string{}
		for _, sfPath := range pathSoFar {
			foundPath = append(append(foundPath, sfPath...), "A")
		}
		foundFn(foundPath)
		return
	}
	currPathSteps := pathSteps[0]
	for _, currPathStep := range currPathSteps {
		nsf := append(pathSoFar, currPathStep)
		getPossiblePathsHelper(pathSteps[1:], nsf, foundFn)
	}
}

func getDirpadPaths(from string, to string) [][]string {
	fromPos := getDirpadKeyPos(from)
	toPos := getDirpadKeyPos(to)
	foundPaths := [][]int{}
	getDirpadPathsHelper(fromPos, toPos, make(map[geom.Point]bool), []int{}, func(foundPath []int) {
		foundPaths = append(foundPaths, foundPath)
	})
	minPathLen := math.MaxInt
	for _, foundPath := range foundPaths {
		if len(foundPath) < minPathLen {
			minPathLen = len(foundPath)
		}
	}
	minPaths := [][]string{}
	for _, foundPath := range foundPaths {
		if len(foundPath) <= minPathLen {
			strPath := []string{}
			for _, dir := range foundPath {
				strPath = append(strPath, dirItoa(dir))
			}
			minPaths = append(minPaths, strPath)
		}
	}
	return minPaths
}

func getDirpadPathsHelper(currPos geom.Point, ePos geom.Point, visited map[geom.Point]bool, soFar []int, foundFn func([]int)) {
	if currPos == ePos {
		// found
		foundFn(slices.Clone(soFar))
		return
	}
	for d, dPt := range directions {
		nx := currPos.X + dPt.X
		ny := currPos.Y + dPt.Y
		nextPt := geom.Point{X: nx, Y: ny}
		if nx >= 0 && nx < dirpadWidth && ny >= 0 && ny < dirpadHeight && dirpad[ny][nx] != " " && !visited[nextPt] {
			visited[nextPt] = true
			soFar = append(soFar, d)
			getDirpadPathsHelper(nextPt, ePos, visited, soFar, foundFn)
			soFar = soFar[:len(soFar)-1]
			delete(visited, nextPt)
		}
	}
}

func getNumpadPaths(from string, to string) [][]string {
	fromPos := getNumpadKeyPos(from)
	toPos := getNumpadKeyPos(to)
	foundPaths := [][]int{}
	getNumpadPathsHelper(fromPos, toPos, make(map[geom.Point]bool), []int{}, func(foundPath []int) {
		foundPaths = append(foundPaths, foundPath)
	})
	minPathLen := math.MaxInt
	for _, foundPath := range foundPaths {
		if len(foundPath) < minPathLen {
			minPathLen = len(foundPath)
		}
	}
	minPaths := [][]string{}
	for _, foundPath := range foundPaths {
		if len(foundPath) <= minPathLen {
			strPath := []string{}
			for _, dir := range foundPath {
				strPath = append(strPath, dirItoa(dir))
			}
			// strPath = append(strPath, "A")
			minPaths = append(minPaths, strPath)
		}
	}
	return minPaths
}

func getNumpadPathsHelper(currPos geom.Point, ePos geom.Point, visited map[geom.Point]bool, soFar []int, foundFn func([]int)) {
	if currPos == ePos {
		// path found
		// foundFn(soFar[:])
		foundFn(slices.Clone(soFar))
		return
	}
	for d, dPt := range directions {
		nx := currPos.X + dPt.X
		ny := currPos.Y + dPt.Y
		nextPt := geom.Point{X: currPos.X + dPt.X, Y: currPos.Y + dPt.Y}
		if nx >= 0 && nx < keypadWidth && ny >= 0 && ny < keypadHeight && keypad[ny][nx] != " " && !visited[nextPt] {
			// fmt.Printf("%s", keypad[ny][nx])
			visited[nextPt] = true
			soFar = append(soFar, d)
			getNumpadPathsHelper(nextPt, ePos, visited, soFar, foundFn)
			soFar = soFar[:len(soFar)-1]
			delete(visited, nextPt)
		}
	}
}

func getDirpadKeyPos(dirpadKey string) geom.Point {
	for y, row := range dirpad {
		for x, key := range row {
			if key == dirpadKey {
				return geom.Point{X: x, Y: y}
			}
		}
	}
	panic(fmt.Sprintf("invalid dirpad key %v", dirpadKey))
}
func getNumpadKeyPos(numpadKey string) geom.Point {
	for y, row := range keypad {
		for x, key := range row {
			if key == numpadKey {
				return geom.Point{X: x, Y: y}
			}
		}
	}
	panic(fmt.Sprintf("invalid numpad key %v", numpadKey))
}

func dirItoa(dir int) string {
	return []string{"^", ">", "v", "<"}[dir]
}

func dirpathToStrs(dirpath []int) []string {
	dirpathStrs := []string{}
	for _, d := range dirpath {
		dirpathStrs = append(dirpathStrs, dirItoa(d))
	}
	return dirpathStrs
}

type Day21Input struct {
	Keycodes []string
}

func parseInput(inputLines []string) Day21Input {
	keycodeRx := regexp.MustCompile(`\d+A`)
	keycodes := []string{}
	for _, inputLine := range inputLines {
		rxMatch := keycodeRx.FindString(inputLine)
		if len(rxMatch) > 0 {
			keycodes = append(keycodes, rxMatch)
		}
	}
	res := Day21Input{
		Keycodes: keycodes,
	}
	return res
}
