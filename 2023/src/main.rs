
mod day1;
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
use colored::Colorize;

use crate::{util::{print_util::get_day_divider_n, input_util::load_day_input, timer::Timer}, day2::day2main::{day2p1, day2p2}, constants::{DAY_2_INPUT_FILE_NAME, DAY_4_INPUT_FILE_NAME, DAY_5_INPUT_FILE_NAME, DAY_6_INPUT_FILE_NAME, DAY_7_INPUT_FILE_NAME, DAY_11_INPUT_FILE_NAME, DAY_1_INPUT_FILE_NAME}, day4::day4main::{day4_part1, day4_part2}, day5::day5main::{day5_part1, day5_part2}, day6::day6main::{day6_part1, day6_part2}, day7::day7main::{day7_part1, day7_part2}, day11::day11_main::{day11_part1, day11_part2}, day1::day1main::{day1_part1, day1_part2}};

fn main() {
  log_day_divider(13);
  println!("EagleLizard - Advent of Code [Rust]");
  log_day_divider(13);

  let day1_result = run_day(1, DAY_1_INPUT_FILE_NAME, day1_part1, Some(day1_part2));
  log_day_result(day1_result);

  let day2_result = run_day(2, DAY_2_INPUT_FILE_NAME, day2p1, Some(day2p2));
  log_day_result(day2_result);
  let day4_result = run_day(4, DAY_4_INPUT_FILE_NAME, day4_part1, Some(day4_part2));
  log_day_result(day4_result);
  let day5_result = run_day(5, DAY_5_INPUT_FILE_NAME, day5_part1, Some(day5_part2));
  log_day_result(day5_result);
  let day6_result = run_day(6, DAY_6_INPUT_FILE_NAME, day6_part1, Some(day6_part2));
  log_day_result(day6_result);
  let day7_result = run_day(7, DAY_7_INPUT_FILE_NAME, day7_part1, Some(day7_part2));
  log_day_result(day7_result);
  let day11_result = run_day(11, DAY_11_INPUT_FILE_NAME, day11_part1, Some(day11_part2));
  log_day_result(day11_result);
}

struct DayResult<T1, T2>
  where T1: std::fmt::Display + Default,
  T2: std::fmt::Display + Default,
{
  pub day_num: u8,
  pub day_time: Duration,
  pub part1_result: PartResult<T1>,
  pub part2_result: Option<PartResult<T2>>,
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
) -> DayResult<T1, T2>
  where F1: FnMut(&Vec<String>) -> T1,
    F2: FnMut(&Vec<String>) -> T2
{
  let day_timer = Timer::start();
  let input_lines: Vec<String> = load_day_input(input_file_name)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let day_str = format!("~ Day {} ~", day_num).bright_green();
  println!("\n{}\n\n{}", get_day_divider_n(5), day_str);

  let part1_result = run_part(1, &input_lines, part1_fn);
  let mut part2_result: Option<PartResult<T2>> = None;
  
  if part2_fn.is_some() {
    let part2_result_val = run_part(2, &input_lines, part2_fn.unwrap());
    part2_result = Some(part2_result_val);
  }
  let day_time = day_timer.stop();
  
  
  // print_part_result(&part1_result);
  // if let Some(ref part2_result) = part2_result {
  //   print_part_result(&part2_result);
  // }

  let day_result = DayResult {
    day_num,
    day_time,
    part1_result,
    part2_result,
  };

  day_result
}

fn print_part_result<T>(part_result: &PartResult<T>, solution_pad: usize)
  where T: std::fmt::Display
{
  let PartResult {
    part_num,
    fun_time,
    solution,
  } = part_result;
  let solution_pad_str = if solution_pad > 0 {
    " ".repeat(solution_pad)
  } else {
    "".to_string()
  };

  let part_str = format!("Part {}", part_num).bright_green();
  let solution_str = format!("{}", solution).yellow();
  let fun_time_str = format!("{:#?}", fun_time).cyan();
  println!("{}: {}{} | {}", part_str, solution_str, solution_pad_str, fun_time_str);
}
#[derive(Clone, Copy)]
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

fn log_day_result<T1, T2>(day_result: DayResult<T1, T2>)
  where T1: std::fmt::Display + Default + Copy,
  T2: std::fmt::Display + Default + Copy,
{
  let part1_result = day_result.part1_result;
  let part2_result_opt = day_result.part2_result;
  let p1_len = part1_result.solution.to_string().len();
  let mut p2_len = 0;
  if let Some(part2_result) = part2_result_opt {
    p2_len = part2_result.solution.to_string().len();
  }

  let p1_pad = if p1_len > p2_len {
    0
  } else {
    p2_len - p1_len
  };
  let p2_pad = if p2_len > p1_len {
    0
  } else {
    p1_len - p2_len
  };



  print_part_result(&part1_result, p1_pad);
  if part2_result_opt.is_some() {
    print_part_result(&part2_result_opt.unwrap(), p2_pad)
  }
  log_day_duration(day_result.day_time);
}

fn log_day_duration(fun_time: Duration) {
  let fun_time_str = format!("{:?}", fun_time).cyan().italic();
  let total_str = "total: ";
  let total_clr = total_str.bright_green().italic();
  let divider_str = "-".repeat(
    total_str.len() + format!("{:?}", fun_time).len()
  );
  println!("{}\n{}{}", divider_str, total_clr, fun_time_str);
}

fn log_day_divider(repeat_n: usize) {
  println!("\n{}\n", get_day_divider_n(repeat_n));
}