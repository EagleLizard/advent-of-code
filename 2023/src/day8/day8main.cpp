
#include <iostream>
#include <chrono>

#include "day8main.h"
#include "../util/input-util.h"
#include "desert-map-parse.h"
#include "desert-map.h"

const std::string DAY_8_INPUT_FILE = "day8_test1.txt";

void day8Main() {
  std::cout << "~ Day 8 ~" << std::endl;

  auto inputLines = InputUtil::loadDayInput(DAY_8_INPUT_FILE);

  auto desertMap = DesertMapParse::parseDesertMap(inputLines);
  
}


