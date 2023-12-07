
# EagleLizard - Advent of Code

## Overview

This repository contains [Advent of Code](https://adventofcode.com/) solutions by EagleLizard.

## Table of Contents

1. [AoC 2023](#aoc-2023)
    1. [Typescript + NodeJS](#aoc-2023-ts-node)
        1. [Prerequisites](#aoc-2023-ts-node-prerequisites)
        1. [Getting Started](#aoc-2023-ts-node-getting-started)
        1. [Running the Code](#aoc-2023-ts-node-running-the-code)
    1. [Rust](#aoc-2023-rust)
        1. [Prerequisites](#aoc-2023-rust-prerequisites)
        1. [Getting Started](#aoc-2023-rust-getting-started)
        1. [Running the Code](#aoc-2023-rust-running-the-code)

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
