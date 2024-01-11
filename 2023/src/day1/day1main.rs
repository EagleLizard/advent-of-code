
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
#[derive(Debug, Clone)]
struct WordMatch<'a> {
  word: &'a str,
  start: usize,
}

fn get_calibration_value_p2(input_line: &str) -> u16 {
  let words = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let mut all_matches = Vec::new();
  for word in words {
    input_line.match_indices(word)
      .for_each(|match_index| {
        let word_match = WordMatch {
          word: match_index.1,
          start: match_index.0
        };
        all_matches.push(word_match)
      });
  }
  for (i, c) in input_line.char_indices() {
    if c.is_digit(10) {
      let c_str = &input_line[i..i + c.len_utf8()];
      all_matches.push(WordMatch {
        word: c_str,
        start: i,
      })
    }
  }
  let mut first_match_opt: Option<WordMatch> = None;
  let mut last_match_opt: Option<WordMatch> = None;
  for curr_match in all_matches {
    if first_match_opt.is_none() {
      first_match_opt = Some(curr_match.clone())
    } else if let Some(ref first_match) = first_match_opt {
      if curr_match.start < first_match.start {
        first_match_opt = Some(curr_match.clone());
      }
    }
    if last_match_opt.is_none() {
      last_match_opt = Some(curr_match);
    } else if let Some(ref last_match) = last_match_opt {
      if curr_match.start > last_match.start {
        last_match_opt = Some(curr_match)
      }
    }
  }
  let first_match = first_match_opt.unwrap();
  let last_match = last_match_opt.unwrap();
  let first_digit = get_digit_from_match_string(&first_match.word);
  let last_digit = get_digit_from_match_string(&last_match.word);
  let calibration_str = format!("{}{}", first_digit, last_digit);
  let calibration_val: u16 = calibration_str.parse().unwrap();
  return calibration_val
  // 0
}

fn get_digit_from_match_string(match_str: &str) -> &str {
  if "0123456789".contains(match_str) {
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
