
#ifndef DESERT_MAP_H
#define DESERT_MAP_H

#include <iostream>
#include <sstream>
#include <vector>
#include <map>
#include <stdexcept>

namespace DesertMap {

  enum DIRECTION {
    LEFT = 'L',
    RIGHT = 'R'
  };

  struct DesertMap;
  static char getDirectionChar(DIRECTION);

  using NodeMap = std::map<std::string, std::pair<std::string, std::string>>;

  struct DesertMap {
    std::vector<DIRECTION> instructions;
    NodeMap nodeMap;
  };

  std::ostream& operator<<(std::ostream& os, const DesertMap& desertMap) {
    std::string instructionsStr = "";
    for(auto & instruction : desertMap.instructions) {
      instructionsStr += getDirectionChar(instruction);
    }
    os
      << "instructions: " << instructionsStr << std::endl
      << "nodeMap: " << std::endl
    ;
    for(auto & elem : desertMap.nodeMap) {
      os << "~ " << elem.first << ": " << "(" << elem.second.first << ", " << elem.second.second << ")" << std::endl;
    }
    
    return os;
  }

  static char getDirectionChar(DIRECTION direction) {
    switch(direction) {
      case DIRECTION::LEFT:
        return 'L';
      case DIRECTION::RIGHT:
        return 'R';
      default:
        std::string errMsg = "DH_1.1 Unexpected DIRECTION: ";
        errMsg += static_cast<char>(direction);
        throw std::invalid_argument(errMsg);
    }
  }

  DIRECTION getDirection(char c) {
    switch(c) {
      case 'L':
        return DIRECTION::LEFT;
      case 'R':
        return DIRECTION::RIGHT;
      default:
        std::string errMsg = "DH_1.2 Invalid direction char: ";
        errMsg += "'";
        errMsg += c;
        errMsg += "'";
        throw std::invalid_argument(errMsg);
    }
  }
}


#endif // DESERT_MAP_H
