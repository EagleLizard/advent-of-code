
#include <iostream>
#include <chrono>

#include "day8main.h"
#include "../util/input-util.h"

using namespace std;

const string DAY_8_INPUT_FILE = "day8_test1.txt";

void day8Main() {
  cout << "~ Day 8 ~" << endl;

  auto input_lines = loadDayInput(DAY_8_INPUT_FILE);

  for(auto & line : input_lines) {
    cout << line << endl;
  }
}


