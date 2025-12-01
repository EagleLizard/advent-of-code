
# EagleLizard - Advent of Code

## Overview

This repository contains [Advent of Code](https://adventofcode.com/) solutions by EagleLizard.

## Table of Contents

1. [AoC 2025](#aoc-2025)
    1. [TypeScript](#aoc-2025-ts)
        1. [Prerequisites](#aoc-2025-ts-prerequisites)
        1. [Getting Started](#aoc-2025-ts-getting-started)
1. [AoC 2024](#aoc-2024)
    1. [Go](#aoc-2024-go)
        1. [Prerequisites](aoc-2024-go-prerequisites)
        1. [Running the Code](aoc-2024-go-running-the-code)
    1. [Lua](#aoc-2024-lua)
        1. [Prerequisites](#aoc-2024-lua-prerequisites)
        1. [Getting Started](#aoc-2024-lua-getting-started)
        1. [Running the Code](#aoc-2024-lua-running-the-code)
    1. [Zig](#aoc-2024-zig)
        1. [Prerequisites](#aoc-2024-zig-prerequisites)
        1. [Running the Code](#aoc-2024-zig-running-the-code)
    1. [JavaScript](#aoc-2024-js)
        1. [Prerequisites](#aoc-2024-js-prerequisites)
        1. [Getting Started](#aoc-2024-js-getting-started)
        1. [Running the Code](#aoc-2024-js-running-the-code)
1. [AoC 2023](#aoc-2023)
    1. [Typescript + NodeJS](#aoc-2023-ts-node)
        1. [Prerequisites](#aoc-2023-ts-node-prerequisites)
        1. [Getting Started](#aoc-2023-ts-node-getting-started)
        1. [Running the Code](#aoc-2023-ts-node-running-the-code)
    1. [Rust](#aoc-2023-rust)
        1. [Prerequisites](#aoc-2023-rust-prerequisites)
        1. [Getting Started](#aoc-2023-rust-getting-started)
        1. [Running the Code](#aoc-2023-rust-running-the-code)
    1. [C++](#aoc-2023-cpp)
        1. [Prerequisites](#aoc-2023-cpp-prerequisites)
        1. [Getting Started](#aoc-2023-cpp-getting-started)
        1. [Running the Code](#aoc-2023-cpp-running-the-code)

<a id="aoc-2025"></a>
# AoC 2025

Advent of code 2025 solutions are in the [`./2025`](./2025/) directory.

Solutions are in **TypeScript**, and others...

<a id="aoc-2025-ts"></a>
## TypeScript

<a id="aoc-2025-ts-prerequisites"></a>
### Prerequisites

* NodeJS @ `24.11.1`+
* TypeScript @ `5.9.3`+

<a id="aoc-2025-ts-getting-started"></a>
### Getting Started

Get [`nvm`](https://github.com/nvm-sh/nvm).

In the `2025` directory, run:

```sh
nvm install
nvm use
npm i
```

To run the build, run one of the following:

If `tsc` is installed globally:

```sh
tsc
```

If not:

```sh
npx tsc
```

I recommend running in watch mode in another terminal:

```sh
tsc -w
```

<a id="aoc-2024"></a>
# AoC 2024

Advent of code 2024 solutions are in the [`./2024`](./2024/) directory.

Solutions are in **Go**, **Lua**, **Zig**, and **JavaScript** __(via **NodeJS**)__.

<a id="aoc-2024-go"></a>
## Go

<a id="aoc-2024-go-prerequisites"></a>
### Prerequisites
* Go @ `1.23.1`

<a id="aoc-2024-go-running-the-code"></a>
### Running the Code
Run via:
```sh
go run src/main.go
```

Run and watch for changes:
```sh
make watch-go
```

<a id="aoc-2024-lua"></a>
## Lua

<a id="aoc-2024-lua-prerequisites"></a>
### Prerequisites
* Lua @ `5.4.7`
* [Luarocks](https://github.com/luarocks/luarocks/wiki/Installation-instructions-for-macOS)

On MacOS:
```sh
brew install luarocks
```

<a id="aoc-2024-lua-getting-started"></a>
### Getting Started
Run the following to install dependencies:
```sh
luarocks install --deps-only 2024-dev-1.rockspec
```

<a id="aoc-2024-lua-running-the-code"></a>
### Running the Code
```sh
make run-lua
```
or:
```sh
lua init.lua
```

To watch for changes:
```sh
make watch-lua
```

<a id="aoc-2024-zig"></a>
## Zig

<a id="aoc-2024-zig-prerequisites"></a>
### Prerequisites
* Zig @ `0.13.0`

<a id="aoc-2024-zig-running-the-code"></a>
### Running the Code
Run:
```sh
make br-zig
```
Or to watch for changes:

```sh
make brw-zig
```

<a id="aoc-2024-js"></a>
## JavaScript

<a id="aoc-2024-js-prerequisites"></a>
### Prerequisites
* NodeJS @ `22.13.1` (via [`nvm`](https://github.com/nvm-sh/nvm))

<a id="aoc-2024-js-getting-started"></a>

Get [`nvm`](https://github.com/nvm-sh/nvm):
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Install & switch to `22.13.1`:
```sh
nvm install 22.13.1
nvm use 22.13.1
```

My intent was to do this with **__zero dependencies__**, so you should just be able to run it with node (we'll see how well I keep to this). 

However, if you want linting or whatever other dev stuff I made you can install dependencies:
```sh
npm i
```


<a id="aoc-2024-js-running-the-code"></a>
### Running the Code

```sh
node src/main.js
```

To watch for changes:
```sh
node --watch src/main.js
```
Or using `fswatch` via make:

```sh
make watch-js
```

<a id="aoc-2023"></a>
# AoC 2023

Advent of Code 2023 solutions are in the `./2023` directory.

Solutions are created in **Typescript + NodeJS** and **Rust**.

<a id="aoc-2023-ts-node"></a>
## Typescript + NodeJS

It's recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage `node` and `npm` versions.

<a id="aoc-2023-ts-node-prerequisites"></a>
### Prerequisites
* NodeJS @ `v21.4.0`
* Typescript @ `v5.3.2`

<a id="aoc-2023-ts-node-getting-started"></a>
### Getting Started 

In the `2023` directory, install dependencies:
```sh
npm i
```

If you have typescript installed globally, run:
```sh
tsc
```

Otherwise, you can prefix the command with `npx` to use the binary installed in `node_modules`:
```sh
npx tsc
```

To run the compiler in watch mode:
```sh
tsc -w
```
<a id="aoc-2023-ts-node-running-the-code"></a>
### Running the Code

After compiling, the transpiled JS code will be in the `dist` folder.

Run the program by executing the `main.js` file with `node`:
```sh
node dist/main.js
```

<a id="aoc-2023-rust"></a>
## Rust

It's recommended to use `rustup` to manage versions, see [Rust's official Getting Started page](https://www.rust-lang.org/learn/get-started) for installation instructions.

<a id="aoc-2023-rust-prerequisites"></a>
### Prerequisites
* cargo @ `1.72.1`

To use the Makefile and run the project in watch mode, install `cargo-watch`:
```sh
cargo install cargo-watch
```

<a id="aoc-2023-rust-getting-started"></a>
### Getting Started

In the `2023` directory, run:
```sh
cargo build
```

<a id="aoc-2023-rust-running-the-code"></a>
### Running the Code

If you built the executable already via the previous section, you can run:
```sh
./target/debug/aoc2023
```

Alternatively, you can build and run the project using:
```sh
cargo watch -x run
```

You can also run in watch mode using:
```sh
make watch
```

<a id="aoc-2023-cpp"></a>
## C++

On MacOS, uses `g++` which is an alias to `clang`.

<a id="aoc-2023-cpp-prerequisites"></a>
### Prerequisites
* cmake @ `3.27.7`
* fswatch @ `1.17.1`

To use the Makefile and run the project in watch mode, install `fswatch`:
```sh
brew install fswatch
```

<a id="aoc-2023-cpp-getting-started"></a>
### Getting Started

In the `2023` directory, run:
```sh
make build-cpp
```

<a id="aoc-2023-cpp-running-the-code"></a>
### Running the Code

If you built the executable already via the previous section, you can run:
```sh
./cpp-out/aoc2023cpp
```

Alternatively, you can build and run the project using:
```sh
make run-cpp
```

You can also run in watch mode using:
```sh
make watch-cpp
```
