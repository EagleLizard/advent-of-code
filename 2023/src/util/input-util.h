
#ifndef INPUT_UTIL_H
#define INPUT_UTIL_H

#include <iostream>
#include <vector>
#include <string>
#include <fstream>

#include "str-util.h"

namespace InputUtil {

  static std::vector<std::string> loadDayInput(std::string);
  static std::string getBasePath();
  static std::string getInputFilePath(std::string);

  static std::vector<std::string> loadDayInput(std::string inputFileName) {
    std::vector<std::string> inputLines;
    auto inputFilePath = getInputFilePath(inputFileName);
    std::ifstream ifs (inputFilePath);
    std::string inputLine;
    while(getline(ifs, inputLine)) {
      inputLines.push_back(
        StrUtil::trim(inputLine)
      );
    }
    return inputLines;
  }

  static std::string getInputFilePath(std::string inputFileName) {
    auto basePath = getBasePath(); 
    auto inputFilePath = std::filesystem::canonical(basePath + "/input/" + inputFileName);
    return inputFilePath;
  }

  static std::string getBasePath() {
    return std::filesystem::current_path();
  }

}

#endif // INPUT_UTIL_H

