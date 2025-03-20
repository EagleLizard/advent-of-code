package clicolors

import "fmt"

var (
	WhiteBright     = rgb(255, 255, 255)
	Cyan            = rgb(142, 250, 253)
	Pear            = rgb(191, 226, 55)
	ChartreuseLight = rgb(190, 255, 125)
)

type FmtFn func(val any) string

type Theme struct {
	C1        FmtFn
	C2        FmtFn
	C3        FmtFn
	C4        FmtFn
	Italic    FmtFn
	Underline FmtFn
}

func NewTheme(c1 FmtFn, c2 FmtFn, c3 FmtFn, c4 FmtFn) Theme {
	t := Theme{
		c1,
		c2,
		c3,
		c4,
		Italic,
		Underline,
	}
	return t
}

func rgb(r int, g int, b int) func(any) string {
	return func(val any) string {
		return fmt.Sprintf("\x1B[38;2;%d;%d;%dm%v\x1B[39m", r, g, b, val)
	}
}

func Italic(val any) string {
	return fmt.Sprintf("\x1B[3m%v\x1B[23m", val)
}

func Underline(val any) string {
	return fmt.Sprintf("\x1B[4m%v\x1B[24m", val)
}
