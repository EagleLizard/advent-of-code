
#ifndef INPUT_UTIL_H
#define INPUT_UTIL_H

#include <iostream>
#include <vector>
#include <string>
#include <fstream>

#include "str-util.h"

namespace InputUtil {

  using std::vector;
  using std::string;
  using std::ifstream;

  static vector<string> loadDayInput(string);
  static string getBasePath();
  static string getInputFilePath(string);

  static vector<string> loadDayInput(string inputFileName) {
    vector<string> inputLines;
    auto inputFilePath = getInputFilePath(inputFileName);
    ifstream ifs (inputFilePath);
    string inputLine;
    while(getline(ifs, inputLine)) {
      inputLines.push_back(
        StrUtil::trim(inputLine)
      );
    }
    return inputLines;
  }

  static string getInputFilePath(string inputFileName) {
    auto basePath = getBasePath(); 
    auto inputFilePath = std::filesystem::canonical(basePath + "/input/" + inputFileName);
    return inputFilePath;
  }

  static string getBasePath() {
    return std::filesystem::current_path();
  }

}

#endif // INPUT_UTIL_H

