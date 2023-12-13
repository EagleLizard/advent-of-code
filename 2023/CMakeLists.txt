cmake_minimum_required(VERSION 3.27.7)
project("aoc2023")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")

set(bin_name "aoc2023cpp")
add_executable(${bin_name} src/main.cpp)

add_library(day8_library src/day8/day8main.cpp src/day8/day8main.h)

target_link_libraries(${bin_name} PRIVATE day8_library)

