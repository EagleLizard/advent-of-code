#ifndef TIME_UTIL_H
#define TIME_UTIL_H

#include <string>
#include <sstream>
#include <iomanip>


namespace TimeUtil {

  using std::string;
  using std::ostringstream;
  using namespace std::chrono;

  struct Timer {
    steady_clock::time_point startTime;
    static Timer start() {
      auto startTime = high_resolution_clock::now();
      return Timer {
        startTime,
      };
    }
    nanoseconds stop() {
      return high_resolution_clock::now() - this->startTime;
    }
  };

  static string getIntuitiveTimeString(nanoseconds ns) {
      const auto microsecond = duration_cast<nanoseconds>(
        microseconds(1)
      );
      const auto millisecond = duration_cast<nanoseconds>(
        milliseconds(1)
      );
      const auto second = duration_cast<nanoseconds>(
        seconds(1)
      );
      const auto minute = duration_cast<nanoseconds>(
        minutes(1)
      );
      const auto hour = duration_cast<nanoseconds>(
        hours(1)
      );

      ostringstream ss;

      if (ns >= hour) {
          ss << (ns / hour) << "h";
      } else if (ns >= minute) {
          ss << (ns / minute) << "m";
      } else if (ns >= second) {
          ss << (ns / second) << "s";
      } else if (ns >= millisecond) {
          ss << (ns / millisecond) << "ms";
      } else if (ns >= microsecond) {
          ss << (ns / microsecond) << "µs";
      } else {
          ss << ns.count() << "ns";
      }

      return ss.str();
  }
}


#endif // TIME_UTIL_H