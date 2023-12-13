
.PHONY: watch
.PHONY: build-cpp
.PHONY: run-cpp
.PHONY: watch-cpp

CPP_DIR = cpp-out
CPP_BIN = aoc2023cpp

watch:
	cargo watch -x run
build-cpp:
	@ mkdir -p ./$(CPP_DIR); \
	cmake -S . -B ./$(CPP_DIR); \
	cmake --build ./$(CPP_DIR)
run-cpp: build-cpp
	./$(CPP_DIR)/${CPP_BIN};
watch-cpp: run-cpp
	fswatch -r ./src | xargs -n1 -I{} make run-cpp
