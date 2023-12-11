
use crate::{util::input_util::load_day_input, day5::almanac_parse::parse_almanac};

const DAY_5_INPUT_FILE_NAME: &str = "day5_test.txt";

pub fn day5_main() {
  println!("~ Day 5 ~");

  let input_lines: Vec<String> = load_day_input(DAY_5_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let amc = parse_almanac(&input_lines);
  println!("Seeds:\n{}", list_to_str(&amc.seeds));
  for amc_entry in amc.amc_entries.iter() {
    println!();
    println!("{:#?}", amc_entry.kind);
    for amc_map in amc_entry.amc_maps.iter() {
      println!("{} {} {}", amc_map.dest_start, amc_map.src_start, amc_map.range_len);
    }
  }
}

fn list_to_str<T: ToString>(list: &[T]) -> String {
  return list.iter()
    .map(|val| val.to_string())
    .collect::<Vec<String>>()
    .join(", ");
}
