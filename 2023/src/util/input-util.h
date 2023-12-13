
#ifndef INPUT_UTIL_H
#define INPUT_UTIL_H

#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

string getBasePath();
string getInputFilePath(string);

vector<string> loadDayInput(string inputFileName) {
  vector<string> inputLines;
  auto inputFilePath = getInputFilePath(inputFileName);
  std::ifstream ifs (inputFilePath);
  string line;
  while(getline(ifs, line)) {
    inputLines.push_back(line);
  }
  return inputLines;
}

string getInputFilePath(string inputFileName) {
  auto basePath = getBasePath();
  auto inputFilePath = std::filesystem::canonical(basePath + "/input/" + inputFileName);
  return inputFilePath;
}

string getBasePath() {
  return std::filesystem::current_path();
}

#endif // INPUT_UTIL_H

