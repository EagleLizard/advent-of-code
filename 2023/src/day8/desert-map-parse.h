#ifndef DESERT_MAP_PARSE_H
#define DESERT_MAP_PARSE_H

#include <iostream>
#include <vector>
#include <map>

#include "desert-map.h"
#include "../util/str-util.h"

namespace DesertMapParse {

  using std::string;
  using std::pair;
  using std::vector;
  using std::cout;
  using std::endl;

  static DesertMap::DesertMap parseDesertMap(vector<string>);
  static vector<DesertMap::DIRECTION> parseInstructions(string);
  static pair<string, pair<string, string>> parseNodeMap(string);

  static DesertMap::DesertMap parseDesertMap(vector<string> inputLines) {
    auto desertMap = DesertMap::DesertMap {};
    uint lineCount = 0;
    for(auto &inputLine : inputLines) {
      if(lineCount == 0) {
        // first line is the instruction string
        desertMap.instructions = parseInstructions(inputLine);
      } else if(inputLine.length() > 0)  {
        auto nodeMapPair = parseNodeMap(inputLine);
        desertMap.nodeMap[nodeMapPair.first] = nodeMapPair.second;
      }
      lineCount++;
    }
    return desertMap;
  }

  static vector<DesertMap::DIRECTION> parseInstructions(string inputLine) {
    vector<DesertMap::DIRECTION> instructions;
    for(auto & c : inputLine) {
      auto direction = DesertMap::getDirection(c);
      instructions.push_back(direction);
    }
    return instructions;
  }

  static pair<string, pair<string, string>> parseNodeMap(string inputLine) {
    auto lineParts = StrUtil::split(inputLine, "=");
    auto keyPart = StrUtil::trim(lineParts[0]);
    auto valueParts = StrUtil::split(
      StrUtil::trim(lineParts[1]),
      ","
    );
    auto leftVal = StrUtil::trim(valueParts[0]).substr(1);
    auto rightVal = StrUtil::trim(valueParts[1]);
    rightVal = rightVal.substr(0, rightVal.length() - 1);
    return pair(keyPart, pair(leftVal, rightVal));
  }
}

#endif // DESERT_MAP_PARSE_H

