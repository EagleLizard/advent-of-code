// hello.cpp: Maggie Johnson
// Description: a program that prints the immortal saying "hello world"

#include <iostream>
#include <sstream>
#include "day8/day8main.h"
#include "util/time-util.h"

using namespace std;

using std::chrono::high_resolution_clock;
using std::chrono::duration_cast;

void logDayDivider(uint);
void funAndTime(std::function<void()>);
string repeatStr(string, uint);

int main() {
  logDayDivider(13);
  cout << endl << "EagleLizard - Advent of Code [C++]" << endl << endl;
  logDayDivider(13);

  funAndTime([]() {
    day8Main();
  });
  logDayDivider(5);

  

  return 0;
}

void logDayDivider(uint n) {
  cout << endl << repeatStr("🎄~", n) << endl << endl;
}
string repeatStr(string str, uint n) {
  string repeatStr = "";
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
  string durationStr = getIntuitiveTimeString(duration);
  cout << repeatStr("-", durationStr.length()) << endl;
  cout << durationStr << endl;
}

