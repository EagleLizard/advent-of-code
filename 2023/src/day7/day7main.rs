use crate::util::input_util::load_day_input;


const DAY_7_INPUT_FILE_NAME: &str = "day7_test.txt";

pub fn day7_main() {
  println!("~ Day 7 ~");
  let input_lines: Vec<String> = load_day_input(DAY_7_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  println!("{:#?}", input_lines);
}
