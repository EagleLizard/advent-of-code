package day21

import (
	"fmt"
	"math"
	"regexp"
	"slices"
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

func Day21Part1(inputLines []string) int {
	day21Input := parseInput(inputLines)
	fmt.Printf("%q\n", day21Input)
	for _, keyCode := range day21Input.Keycodes {
		fmt.Printf("%s\n", keyCode)
		keycodePath := strings.Split(keyCode, "")
		keycodePath = slices.Insert(keycodePath, 0, "A")
		fmt.Printf("kcp: %v\n", strings.Join(keycodePath, " "))
		for k := range len(keycodePath) - 1 {
			from := keycodePath[k]
			to := keycodePath[k+1]
			getDirpadNumpadPaths(from, to)
		}
		break
	}
	// getKeypadPaths("A", "0")

	return -1
}

func getDirpadNumpadPaths(from string, to string) {
	fmt.Printf("%q -> %q\n", from, to)
	numpadPaths := getNumpadPaths(from, to)
	for _, numpadPath := range numpadPaths {
		/* the robot starts at A and ends at A */
		numpadKeyPath := append(slices.Insert(numpadPath, 0, "A"), "A")
		fmt.Printf("nkp: %v\n", numpadKeyPath)
		for k := range len(numpadKeyPath) - 1 {
			from := numpadKeyPath[k]
			to := numpadKeyPath[k+1]
			dirpadPaths := getDirpadPaths(from, to)
			for _, dirpadPath := range dirpadPaths {
				fmt.Printf("%v\n", dirpadPath)
			}
		}
	}
}

func getDirpadPaths(from string, to string) [][]string {
	fmt.Printf("%q -> %q\n", from, to)
	fromPos := getDirpadKeyPos(from)
	toPos := getDirpadKeyPos(to)
	foundPaths := [][]int{}

	getDirpadPathsHelper(fromPos, toPos, make(map[geom.Point]bool), []int{}, func(foundPath []int) {
		// fmt.Printf("fp: %v\n", foundPath)
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
	// fmt.Printf("minPathLen: %v\n", minPathLen)
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
