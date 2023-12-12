
use crate::{
  util::{input_util::load_day_input, timer::run_and_time},
  day5::almanac_parse::parse_almanac,
};

use super::almanac::Almanac;

const DAY_5_INPUT_FILE_NAME: &str = "day5_test.txt";

pub fn day5_main() {
  println!("~ Day 5 ~");

  let input_lines: Vec<String> = load_day_input(DAY_5_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let amc = parse_almanac(input_lines);

  let mut fun_time = run_and_time(|| {
    day5_part1(&amc);
  });
  println!("\n[d5p1] took: {:#?}", fun_time);
  
}

fn day5_part1(amc: &Almanac) {
  println!("\n~ Day 5 Part 1 ~\n");
  let mut locations = Vec::new();
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
  println!("Lowest location: {}", min_location);
}

fn list_to_str<T: ToString>(list: &[T]) -> String {
  return list.iter()
    .map(|val| val.to_string())
    .collect::<Vec<String>>()
    .join(", ");
}
