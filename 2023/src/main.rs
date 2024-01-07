
mod day2;
mod day4;
mod day5;
mod day6;
mod day7;
mod day11;

mod util;
mod constants;

use std::time::Duration;

use util::timer::run_and_time;

use crate::{util::{print_util::get_day_divider_n, input_util::load_day_input}, day2::day2main::{day2p1, day2p2}, constants::{DAY_2_INPUT_FILE_NAME, DAY_4_INPUT_FILE_NAME, DAY_5_INPUT_FILE_NAME, DAY_6_INPUT_FILE_NAME, DAY_7_INPUT_FILE_NAME, DAY_11_INPUT_FILE_NAME}, day4::day4main::{day4_part1, day4_part2}, day5::day5main::{day5_part1, day5_part2}, day6::day6main::{day6_part1, day6_part2}, day7::day7main::{day7_part1, day7_part2}, day11::day11_main::{day11_part1, day11_part2}};

fn main() {
  log_day_divider(13);
  println!("EagleLizard - Advent of Code [Rust]");
  log_day_divider(13);

  let mut run_day_result = run_and_time(|| {
    run_day(2, DAY_2_INPUT_FILE_NAME, day2p1, Some(day2p2))
  });
  log_day_duration(run_day_result);

  run_day_result = run_and_time(|| {
    run_day(4, DAY_4_INPUT_FILE_NAME, day4_part1, Some(day4_part2))
  });
  log_day_duration(run_day_result);
  
  run_day_result = run_and_time(|| {
    run_day(5, DAY_5_INPUT_FILE_NAME, day5_part1, Some(day5_part2))
  });
  log_day_duration(run_day_result);

  run_day_result = run_and_time(|| {
    run_day(6, DAY_6_INPUT_FILE_NAME, day6_part1, Some(day6_part2))
  });
  log_day_duration(run_day_result);
  
  run_day_result = run_and_time(|| {
    run_day(7, DAY_7_INPUT_FILE_NAME, day7_part1, Some(day7_part2))
  });
  log_day_duration(run_day_result);

  run_day_result = run_and_time(|| {
    run_day(11, DAY_11_INPUT_FILE_NAME, day11_part1, Some(day11_part2))
  });
  log_day_duration(run_day_result);
}

fn run_day<
  T1: std::fmt::Display + Default,
  T2: std::fmt::Display + Default,
  F1,
  F2
>(
  day_num: u8,
  input_file_name: &str,
  part1_fn: F1,
  part2_fn: Option<F2>
)
  where F1: FnMut(&Vec<String>) -> T1,
    F2: FnMut(&Vec<String>) -> T2
{
  let input_lines: Vec<String> = load_day_input(input_file_name)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();

  println!("\n{}\n\n~ Day {} ~", get_day_divider_n(5), day_num);

  let part1_result = run_part(1, &input_lines, part1_fn);
  print_part_result(part1_result);
  
  if part2_fn.is_some() {
    let part2_result = run_part(2, &input_lines, part2_fn.unwrap());
    print_part_result(part2_result);
  }
}

fn print_part_result<T>(part_result: PartResult<T>)
  where T: std::fmt::Display
{
  println!("Part {}: {} | {:#?}", part_result.part_num, part_result.solution, part_result.fun_time);
}

struct PartResult<T> {
  pub part_num: u8,
  pub fun_time: Duration,
  pub solution: T,
}

fn run_part<T: std::fmt::Display + Default, F>(
  part_num: u8,
  input_lines: &Vec<String>,
  mut part_fn: F
) -> PartResult<T>
  where F: FnMut(&Vec<String>) -> T
{
  let mut solution: T = T::default();
  let fun_time = run_and_time(|| {
    solution = part_fn(input_lines);
  });

  let part_result = PartResult {
    part_num,
    fun_time,
    solution,
  };
  part_result
}

fn log_day_duration(fun_time: Duration) {
  println!("{}\n{:?}", "-".repeat(format!("{:?}", fun_time).len()), fun_time);
}

fn log_day_divider(repeat_n: usize) {
  println!("\n{}\n", get_day_divider_n(repeat_n));
}