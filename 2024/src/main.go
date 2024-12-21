package main

import (
	"fmt"

	"github.com/EagleLizard/advent-of-code/2024/src/day1"
)

func main() {
	aocBanner()
	day1.Day1Pt1()
}

func aocBanner() {
	padStr := "*"
	pre := padStr
	post := padStr
	bannerTxt := "Advent of Code 2024 [go]"
	fmt.Printf("%s %s %s\n", pre, bannerTxt, post)
}
