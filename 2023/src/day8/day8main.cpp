
#include <iostream>
#include <chrono>
#include <algorithm> 
#include <numeric> 

#include "day8main.h"
#include "../util/input-util.h"
#include "../util/time-util.h"
#include "desert-map-parse.h"
#include "desert-map.h"

namespace Day8Main {

  using std::string;
  using std::cout;
  using std::endl;
  using std::vector;
  using std::pair;
  

  static void day8Part1(DesertMap::DesertMap&);
  static void day8Part2(DesertMap::DesertMap&);
  static std::chrono::nanoseconds runAndTime(std::function<void()>);
  static std::chrono::nanoseconds runAndTimeLog(std::function<void()>, uint, uint);
  void printNodePair(pair<string, pair<string, string>>);

  const string DAY_8_INPUT_FILE = "day8.txt";

  void day8Main() {
    cout << "~ Day 8 ~" << endl;

    auto inputLines = InputUtil::loadDayInput(DAY_8_INPUT_FILE);

    auto desertMap = DesertMapParse::parseDesertMap(inputLines);

    runAndTimeLog([&desertMap]() {
      day8Part1(desertMap);
    }, 8, 1);
    
    runAndTimeLog([&desertMap]() {
      day8Part2(desertMap);
    }, 8, 2);
    
  }

  static std::chrono::nanoseconds runAndTimeLog(std::function<void()> fn, uint dn, uint pn) {
    auto fun_time = runAndTime(fn);
    cout << "\n[d" << dn << "p" << pn << "] took: " << TimeUtil::getIntuitiveTimeString(fun_time) << endl << endl;
  }

  static std::chrono::nanoseconds runAndTime(std::function<void()> fn) {
    auto timer = TimeUtil::Timer::start();
    fn();
    auto stopNs = timer.stop();
    return stopNs;
  }

  static void day8Part1(DesertMap::DesertMap& desertMap) {
    cout << "\n~ Day 8 Part 1 ~" << endl;
    const auto& lastKey = "ZZZ";
    auto it = desertMap.nodeMap.begin();
    auto currPair = pair(it->first, it->second);
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
        currPair = pair(nextIt->first, nextIt->second);
        steps++;
      }
    }
    cout << "steps: " << steps << endl;
  }
  

  static void day8Part2(DesertMap::DesertMap& desertMap) {
    cout << "\n~ Day 8 Part 2 ~" << endl;
    /*
      If you were a ghost, you'd probably just start at every node
        that ends with A and follow all of the paths at the same time
        until they all simultaneously end up at nodes that end with Z.
    */
    // cout << desertMap << endl;
    vector<pair<string, pair<string, string>>> currPairs;
    for(auto & mapPair : desertMap.nodeMap) {
      if(mapPair.first[mapPair.first.length() - 1] == 'A') {
        currPairs.push_back(mapPair);
      }
    }
    // for(auto & currPair : currPairs) {
    //     printNodePair(currPair);
    // }
    // return;
    // cout << currPairs.size() << endl;
    const auto& lastKey = 'Z';
    auto finished = false;
    vector<uint> allSteps;
    for(auto & currPair : currPairs) {
      // printNodePair(currPair);
      auto currPairCopy = pair(currPair.first, currPair.second);
      uint steps = 0;
      while(currPairCopy.first[2] != lastKey) {
        for(auto & instruction : desertMap.instructions) {
          string currKey = currPairCopy.first;
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
          currPairCopy = pair(nextIt->first, nextIt->second);
          steps++;
        }
      }

      // cout << "steps: " << steps << endl;
      allSteps.push_back(steps);
    }

    /*
      the answer is LCM because doing the problem as described has
        cycles
    */
    auto totalSteps = std::accumulate(
      allSteps.begin(),
      allSteps.end(),
      1ul,
      [](unsigned long acc, unsigned long curr) {
        return std::lcm(acc, curr);
      }
    );

    cout << "steps: " << totalSteps << endl;
  }

  void printNodePair(pair<string, pair<string, string>> currPair) {
    cout << "~ " << currPair.first << ": " << "(" << currPair.second.first << ", " << currPair.second.second << ")" << endl;
  }
}
