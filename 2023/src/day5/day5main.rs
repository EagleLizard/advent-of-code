
use crate::{
  util::input_util::load_day_input,
  day5::almanac_parse::parse_almanac,
};

const DAY_5_INPUT_FILE_NAME: &str = "day5.txt";

pub fn day5_main() {
  println!("~ Day 5 ~\n");

  let input_lines: Vec<String> = load_day_input(DAY_5_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let amc = parse_almanac(input_lines);

  let mut locations: Vec<u64> = Vec::new();
  for seed in amc.seeds.iter() {
    let mut curr_src = seed.clone();
    for amc_entry in amc.amc_entries.iter() {
      let dest = amc_entry.get_dest(curr_src).clone();
      /*
        The current dest value is the input into the nex
          almanac mapping
      */
      curr_src = dest;
    }
    locations.push(curr_src);
  }

  let mut min_location: u64 = u64::MAX;
  for location in locations.iter() {
    if *location < min_location {
      min_location = *location;
    }
  }
  println!("Lowest location:\n{}", min_location);
}

fn list_to_str<T: ToString>(list: &[T]) -> String {
  return list.iter()
    .map(|val| val.to_string())
    .collect::<Vec<String>>()
    .join(", ");
}
