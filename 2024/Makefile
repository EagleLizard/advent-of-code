
BIN_DIR = bin

GO_SRC_DIR = src
GO_BIN=aoc2024

ZIG_SRC_DIR=src
ZIG_BIN_DIR=zig-out/bin
ZIG_BIN=zaoc2024

day = 0

build-go:
	go build -o $(BIN_DIR)/$(GO_BIN) ${GO_SRC_DIR}/main.go
run-go:
	$(BIN_DIR)/$(GO_BIN) -d $(day)
# watch-build go
wb-go:
	air --build.cmd "make build-go" --build.bin "echo \"aoc2024[go] built\""
# run-watch go
rw-go:
	fswatch ./$(BIN_DIR)/$(GO_BIN) | xargs -n1 -I{} make day=$(day) run-go
watch-go:
	air --build.cmd "make build-go" --build.bin "make run-go"
run-lua:
	lua init.lua -d $(day)
out-lua:
	lua init.lua -d $(day) > d$(day)-out.txt
watch-lua:
	fswatch -ro ./src ./input | xargs -n1 -I{} make run-lua
watch-out-lua:
	fswatch -ro ./src | xargs -n1 -I{} make out-lua
build-zig:
	zig build --summary all
# build-run-watch zig
brw-zig:
	fswatch -ro ./$(ZIG_SRC_DIR) | xargs -n1 -I{} make br-zig
# build-run zig
br-zig:
	zig build run
run-zig:
	./$(ZIG_BIN_DIR)/$(ZIG_BIN)
run-js:
	node src/main.js
watch-js:
	fswatch -ro ./src ./input | xargs -n1 -I{} make run-js
#	node --watch src/main.js