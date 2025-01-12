package day6

import (
	"github.com/EagleLizard/advent-of-code/2024/src/util/geom"
)

type LabGuard struct {
	Pos       geom.Point
	Direction int
}

const terminal_dest = '!'

func (g *LabGuard) Step(grid [][]rune) bool {
	dx := 0
	dy := 0
	switch g.Direction {
	case 0:
		dy = -1
	case 1:
		dx = 1
	case 2:
		dy = 1
	case 3:
		dx = -1
	}
	xMov := g.Pos.X + dx
	yMov := g.Pos.Y + dy
	destVal := terminal_dest
	if (yMov >= 0 && yMov < len(grid)) && (xMov >= 0 && xMov < len(grid[yMov])) {
		destVal = grid[yMov][xMov]
	}
	if destVal == '#' {
		/* rotate */
		if g.Direction >= len(GUARD_POS)-1 {
			g.Direction = 0
		} else {
			g.Direction++
		}
	} else {
		/* advance */
		g.Pos.X = xMov
		g.Pos.Y = yMov
	}
	return destVal != terminal_dest
}

func (lg *LabGuard) Copy() LabGuard {
	return LabGuard{
		Pos:       lg.Pos,
		Direction: lg.Direction,
	}
}
