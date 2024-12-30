package main

import (
	"fmt"

	"github.com/EagleLizard/advent-of-code/2024/src/day1"
	"github.com/EagleLizard/advent-of-code/2024/src/day2"
)

func main() {
	aocBanner()
	fmt.Println("~ Day 1 ~")
	fmt.Println("Part 1:")
	day1.Day1Pt1()
	fmt.Println("Part 2:")
	day1.Day1Pt2()

	fmt.Println("~ Day 2 ~")
	fmt.Println("Part 1:")
	day2.Day2Pt1()
	fmt.Println("Part 2:")
	day2.Day2Pt2()
}

func aocBanner() {
	padStr := "*"
	pre := padStr
	post := padStr
	bannerTxt := "Advent of Code 2024 [go]"
	fmt.Printf("%s %s %s\n", pre, bannerTxt, post)
}
