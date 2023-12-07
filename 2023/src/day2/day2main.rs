
use std::{env, path::PathBuf};



pub fn day2main () {
  println!("~ Day 2 ~");
  println!("{}", get_input_path().display());
  println!("{:#?}", load_day2_input())
}

fn get_input_path() -> PathBuf {
  let input_dir_path = get_base_path()
    .join("input");
  return std::fs::canonicalize(input_dir_path).unwrap();
}

fn get_base_path() -> PathBuf {
  return env::current_dir().unwrap();
}

fn load_day2_input() -> Vec<String> {
  let input_file_name = "day2.txt";
  let input_file_path = std::fs::canonicalize(
      get_input_path().join(input_file_name)
  ).unwrap();
  let input_file_data = std::fs::read_to_string(input_file_path).unwrap();
  let input_file_lines = input_file_data
    .split("\n")
    .map(|line| String::from(line))
    .collect::<Vec<String>>();

  return input_file_lines;
}

