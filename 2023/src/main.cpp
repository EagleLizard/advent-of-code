
// +build test
// Description: a program that prints the immortal saying "hello world"

#include <iostream>
#include <sstream>
#include "day8/day8main.h"
#include "util/time-util.h"

using std::chrono::high_resolution_clock;
using std::chrono::duration_cast;

void logDayDivider(uint);
void funAndTime(std::function<void()>);
std::string repeatStr(std::string, uint);

int main() {
  logDayDivider(13);
  std::cout << std::endl << "EagleLizard - Advent of Code [C++]" << std::endl << std::endl;
  logDayDivider(13);

  funAndTime([]() {
    Day8Main::day8Main();
  });
  logDayDivider(5);
  return 0;
}

void logDayDivider(uint n) {
  std::cout << std::endl << repeatStr("🎄~", n) << std::endl << std::endl;
}
std::string repeatStr(std::string str, uint n) {
  std::string repeatStr = "";
  for(uint i = 0; i < n; ++i) {
    repeatStr += str;
  }
  return repeatStr;
}

void funAndTime(std::function<void()> fn) {
  auto t1 = high_resolution_clock::now();
  fn();
  auto t2 = high_resolution_clock::now();
  auto duration = t2 - t1;
  std::string durationStr = TimeUtil::getIntuitiveTimeString(duration);
  std::cout << repeatStr("-", durationStr.length()) << std::endl;
  std::cout << durationStr << std::endl;
}

