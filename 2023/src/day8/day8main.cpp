
#include <iostream>
#include <chrono>

#include "day8main.h"
#include "../util/input-util.h"
#include "../util/time-util.h"
#include "desert-map-parse.h"
#include "desert-map.h"

namespace Day8Main {

  using std::string;
  using std::cout;
  using std::endl;

  void day8Part1(DesertMap::DesertMap&);
  static std::chrono::nanoseconds runAndTime(std::function<void()> fn);

  const string DAY_8_INPUT_FILE = "day8.txt";

  void day8Main() {
    cout << "~ Day 8 ~" << endl;

    auto inputLines = InputUtil::loadDayInput(DAY_8_INPUT_FILE);

    auto desertMap = DesertMapParse::parseDesertMap(inputLines);

    auto fun_time = runAndTime([&desertMap]() {
      day8Part1(desertMap);
    });
    cout << "\n[d8p1] took: " << TimeUtil::getIntuitiveTimeString(fun_time) << endl << endl;
    
  }

  static std::chrono::nanoseconds runAndTime(std::function<void()> fn) {
    auto timer = TimeUtil::Timer::start();
    fn();
    auto stopNs = timer.stop();
    return stopNs;
  }

  void day8Part1(DesertMap::DesertMap& desertMap) {
    cout << "\n~ Day 8 Part 1 ~" << endl;
    const auto& lastKey = "ZZZ";
    auto it = desertMap.nodeMap.begin();
    auto currPair = std::pair(it->first, it->second);
    uint steps = 0;
    while(currPair.first != lastKey) {
      for(auto & instruction : desertMap.instructions) {
        string currKey = currPair.first;
        string currVal;
        switch(instruction) {
          case DesertMap::DIRECTION::LEFT:
            currVal = desertMap.nodeMap[currKey].first;
            break;
          case DesertMap::DIRECTION::RIGHT:
            currVal = desertMap.nodeMap[currKey].second;
            break;
        }
        auto nextIt = desertMap.nodeMap.find(currVal);
        currPair = std::pair(nextIt->first, nextIt->second);
        steps++;
      }
    }
    cout << "steps: " << steps << endl;
  }

}
