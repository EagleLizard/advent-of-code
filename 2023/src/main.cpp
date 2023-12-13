// hello.cpp: Maggie Johnson
// Description: a program that prints the immortal saying "hello world"

#include <iostream>
#include "day8/day8main.h"
using namespace std;

void logDayDivider(uint);

int main() {
  logDayDivider(13);
  cout << endl << "EagleLizard - Advent of Code [C++]" << endl << endl;
  logDayDivider(13);
  day8Main();
  return 0;
}

void logDayDivider(uint n) {
  string dayDivider = "";
  for(uint i = 0; i < n; ++i) {
    dayDivider += "🎄~";
  }
  cout << dayDivider << endl;
}
