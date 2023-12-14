
#ifndef DESERT_MAP_H
#define DESERT_MAP_H

#include <iostream>
#include <sstream>
#include <vector>
#include <map>
#include <stdexcept>

namespace DesertMap {

  using std::map;
  using std::string;
  using std::pair;
  using std::vector;
  using std::ostream;
  using std::endl;
  using std::invalid_argument;

  enum DIRECTION {
    LEFT = 'L',
    RIGHT = 'R'
  };

  struct DesertMap;
  static char getDirectionChar(DIRECTION);

  using NodeMap = map<string, pair<string, string>>;

  struct DesertMap {
    vector<DIRECTION> instructions;
    NodeMap nodeMap;
  };

  ostream& operator<<(ostream& os, const DesertMap& desertMap) {
    string instructionsStr = "";
    for(auto & instruction : desertMap.instructions) {
      instructionsStr += getDirectionChar(instruction);
    }
    os
      << "instructions: " << instructionsStr << endl
      << "nodeMap: " << endl
    ;
    for(auto & elem : desertMap.nodeMap) {
      os << "~ " << elem.first << ": " << "(" << elem.second.first << ", " << elem.second.second << ")" << endl;
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
        string errMsg = "DH_1.1 Unexpected DIRECTION: ";
        errMsg += static_cast<char>(direction);
        throw invalid_argument(errMsg);
    }
  }

  DIRECTION getDirection(char c) {
    switch(c) {
      case 'L':
        return DIRECTION::LEFT;
      case 'R':
        return DIRECTION::RIGHT;
      default:
        string errMsg = "DH_1.2 Invalid direction char: ";
        errMsg += "'";
        errMsg += c;
        errMsg += "'";
        throw invalid_argument(errMsg);
    }
  }
}


#endif // DESERT_MAP_H
