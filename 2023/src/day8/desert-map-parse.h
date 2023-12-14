#ifndef DESERT_MAP_PARSE_H
#define DESERT_MAP_PARSE_H

#include <iostream>
#include <vector>
#include <map>

#include "desert-map.h"
#include "../util/str-util.h"

namespace DesertMapParse {

  static DesertMap::DesertMap parseDesertMap(std::vector<std::string>);
  static std::vector<DesertMap::DIRECTION> parseInstructions(std::string);
  static std::pair<std::string, std::pair<std::string, std::string>> parseNodeMap(std::string);

  static DesertMap::DesertMap parseDesertMap(std::vector<std::string> inputLines) {
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
    std::cout << desertMap << std::endl;
    return desertMap;
  }

  static std::vector<DesertMap::DIRECTION> parseInstructions(std::string inputLine) {
    std::vector<DesertMap::DIRECTION> instructions;
    for(auto & c : inputLine) {
      auto direction = DesertMap::getDirection(c);
      instructions.push_back(direction);
    }
    return instructions;
  }

  static std::pair<std::string, std::pair<std::string, std::string>> parseNodeMap(std::string inputLine) {
    auto lineParts = StrUtil::split(inputLine, "=");
    auto keyPart = StrUtil::trim(lineParts[0]);
    auto valueParts = StrUtil::split(
      StrUtil::trim(lineParts[1]),
      ","
    );
    auto leftVal = StrUtil::trim(valueParts[0]).substr(1);
    auto rightVal = StrUtil::trim(valueParts[1]);
    rightVal = rightVal.substr(0, rightVal.length() - 1);
    return std::pair(keyPart, std::pair(leftVal, rightVal));
  }
}

#endif // DESERT_MAP_PARSE_H

