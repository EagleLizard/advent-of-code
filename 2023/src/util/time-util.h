#ifndef TIME_UTIL_H
#define TIME_UTIL_H

#include <string>
#include <sstream>
#include <iomanip>


std::string getIntuitiveTimeString(std::chrono::nanoseconds ns) {
     const auto microsecond = std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::microseconds(1)
    );
    const auto millisecond = std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::milliseconds(1)
    );
    const auto second = std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::seconds(1)
    );
    const auto minute = std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::minutes(1)
    );
    const auto hour = std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::hours(1)
    );

    std::ostringstream ss;

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

#endif // TIME_UTIL_H