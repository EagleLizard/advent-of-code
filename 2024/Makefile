
BIN_DIR = bin

GO_SRC_DIR = src
GO_BIN=aoc2024

build-go:
	go build -o $(BIN_DIR)/$(GO_BIN) ${GO_SRC_DIR}/main.go
run-go:
	$(BIN_DIR)/$(GO_BIN)
watch-go:
	air --build.cmd "make build-go" --build.bin "make run-go"

