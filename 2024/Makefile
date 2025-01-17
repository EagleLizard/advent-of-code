
BIN_DIR = bin

GO_SRC_DIR = src
GO_BIN=aoc2024

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
watch-lua:
	fswatch -ro ./src | xargs -n1 -I{} make run-lua
