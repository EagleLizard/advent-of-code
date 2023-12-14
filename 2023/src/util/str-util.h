#ifndef STR_UTIL_H
#define STR_UTIL_H

#include <algorithm> 
#include <cctype>
#include <locale>

namespace StrUtil {
  // trim from start (in place)
  static inline std::string ltrim(std::string s) {
      s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
          return !std::isspace(ch);
      }));
      return s;
  }

  // trim from end (in place)
  static inline std::string rtrim(std::string s) {
      s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
          return !std::isspace(ch);
      }).base(), s.end());
      return s;
  }

  // trim from both ends (in place)
  static inline std::string trim(std::string s) {
      s = rtrim(s);
      s = ltrim(s);
      return s;
  }

  static inline std::vector<std::string> split(std::string s, std::string delim) {
    std::string strPart;
    std::vector<std::string> strParts;
    size_t pos = 0;
    while((pos = s.find(delim)) != std::string::npos) {
      strPart = s.substr(0, pos);
      strParts.push_back(strPart);
      s.erase(0, pos + delim.length());
    }
    strParts.push_back(s);
    return strParts;
  }
}

#endif