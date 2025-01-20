package clicolors

import "fmt"

type CliFormatter func(val interface{}) string

func Italic(val any) string {
	return fmt.Sprintf("\x1B[3m%v\x1B[23m", val)
}
func Dim(val any) string {
	return fmt.Sprintf("\x1B[2m%s\x1B[22m", val)
}
func Bold(val any) string {
	return fmt.Sprintf("\x1B[1m%s\x1B[22m", val)
}
func Inverse(val any) string {
	return fmt.Sprintf("\x1B[7m%s\x1B[27m", val)
}
func Underline(val any) string {
	return fmt.Sprintf("\x1B[4m%s\x1B[24m", val)
}

func Rgb(r, g, b int) CliFormatter {
	return func(val any) string {
		valStr := fmt.Sprintf("%v", val)
		return fmt.Sprintf("\x1B[38;2;%d;%d;%dm%s\x1B[39m", r, g, b, valStr)
	}
}
