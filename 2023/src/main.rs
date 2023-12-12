
mod day2;
mod day4;
mod day5;

mod util;

use std::time::Duration;

use util::timer::run_and_time;

use crate::util::log_util::get_day_divider_n;

fn main() {
  log_day_divider(13);
  println!("EagleLizard - Advent of Code [Rust]");
  log_day_divider(13);
  
  run_fun_and_time(
    &day2::day2main::day2main
  );
  log_day_divider(5);

  run_fun_and_time(
    &day4::day4main::day4_main
  );
  log_day_divider(5);

  run_fun_and_time(
    &day5::day5main::day5_main
  );
  log_day_divider(5);

}

fn run_fun_and_time(fun: &dyn Fn() -> ()) {
  let fun_time = run_and_time(fun);
  log_duration(fun_time);
}

fn log_duration(fun_time: Duration) {
  println!("\n{}\n{:?}", "-".repeat(format!("{:?}", fun_time).len()), fun_time);
}

fn log_day_divider(repeat_n: usize) {
  println!("\n{}\n", get_day_divider_n(repeat_n));
}