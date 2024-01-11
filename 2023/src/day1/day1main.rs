use once_cell::sync::Lazy;
use regex::{Regex, Match};

// Compile regexes only once
static WORD_NUM_RXS: Lazy<Vec<Regex>> = Lazy::new(|| {
  vec![
      r"one",
      r"two",
      r"three",
      r"four",
      r"five",
      r"six",
      r"seven",
      r"eight",
      r"nine",
      r"[0-9]",
  ].iter()
  .map(|rx_str| Regex::new(rx_str).unwrap())
   .collect()
});

// Compile regex only once
static NUM_RX: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r"[0-9]+").unwrap()
});


pub fn day1_part1(input_lines: &Vec<String>) -> u16 {
  let calibration_sum = input_lines.iter().fold(0, |acc, curr_line| {
    acc + get_calibration_value(&curr_line)
  });
  calibration_sum
}

pub fn day1_part2(input_lines: &Vec<String>) -> u16 {
  let mut calibration_values = Vec::new();

  // for input_line in &input_lines[0..2] {
  for input_line in input_lines {
    let calibration_value = get_calibration_value_p2(input_line);
    calibration_values.push(calibration_value);
  }
  return calibration_values.iter().fold(0, |acc, curr| {
    acc + curr
  })
  // 0
}

fn get_calibration_value_p2(input_line: &str) -> u16 {
  let all_matches = WORD_NUM_RXS.iter().fold(Vec::new(), |mut acc, curr_rx| {
    for mat in curr_rx.find_iter(input_line) {
      acc.push(mat)
    }
    acc
  });
  let mut first_match_opt: Option<Match> = None;
  let mut last_match_opt: Option<Match> = None;
  for curr_mat in all_matches {
    if first_match_opt.is_none() {
      first_match_opt = Some(curr_mat);
    } else if let Some(first_match) = first_match_opt {
      if curr_mat.start() < first_match.start() {
        first_match_opt = Some(curr_mat);
      }
    }
    if last_match_opt.is_none() {
      last_match_opt = Some(curr_mat);
    } else if let Some(last_match) = last_match_opt {
      if curr_mat.start() > last_match.start() {
        last_match_opt = Some(curr_mat);
      }
    }
  }

  let first_digit = get_digit_from_match_string(first_match_opt.unwrap().as_str());
  let last_digit = get_digit_from_match_string(last_match_opt.unwrap().as_str());
  let calibration_str = format!("{}{}", first_digit, last_digit);
  let calibration_val: u16 = calibration_str.parse().unwrap();
  return calibration_val
  // 0
}

fn get_digit_from_match_string(match_str: &str) -> &str {
  // let num_rx = Regex::new(r"[0-9]+").unwrap();
  if NUM_RX.is_match(match_str) {
    return match_str
  }
  match match_str {
    "one" => "1",
    "two" => "2",
    "three" => "3",
    "four" => "4",
    "five" => "5",
    "six" => "6",
    "seven" => "7",
    "eight" => "8",
    "nine" => "9",
    _ => unreachable!("invalid digit string: {}", match_str),
  }
}

fn get_calibration_value(input_str: &str) -> u16 {
  let mut num_str = String::new();
  let num_chars = "0123456789";
  for c in input_str.chars() {
    if num_chars.contains(c) {
      num_str.push(c)
    }
  }
  let first_digit = num_str.chars().next().unwrap();
  let second_digit = num_str.chars().last().unwrap();
  let mut calibration_string = String::new();
  calibration_string.push(first_digit);
  calibration_string.push(second_digit);
  let calibration_num: u16 = calibration_string.parse().unwrap();
  calibration_num
}
