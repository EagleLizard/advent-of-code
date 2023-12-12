
use::std::cmp::min;

use crate::{
  util::{input_util::load_day_input, timer::run_and_time},
  day5::{almanac_parse::parse_almanac, almanac::AlmanacPair},
};

use super::almanac::Almanac;

const DAY_5_INPUT_FILE_NAME: &str = "day5.txt";

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

  fun_time = run_and_time(|| {
    day5_part2(&amc);
  });
  println!("\n[d5p2] took: {:#?}", fun_time);
}

fn day5_part2(amc: &Almanac) {
  println!("\n~ Day 5 Part 2 ~");
  /*
    Try a brute force method.
      [note] - worked, but took 21gig RAM & 2800 seconds
    
    More optimal:
    Pass in seed ranges,
      and return any subranges that are within bounds
  */
  
  let seed_pairs: Vec<AlmanacPair> = amc.seeds
    .chunks(2)
    .map(|seed_pair| {
      AlmanacPair {
        start: seed_pair[0],
        end: seed_pair[1],
      }
    })
    .collect();


  let mut locatons = Vec::new();
  for seed_pair in seed_pairs.iter() {
    let pairs = vec![seed_pair.clone()];
    for pair in pairs.iter() {
      let mut curr_src_pairs = vec![pair.clone()];
      for amc_entry in amc.amc_entries.iter() {
        let dest_pairs = curr_src_pairs.iter().fold(Vec::new(), |mut acc, curr| {
          for dest_pair in amc_entry.get_dest_pairs(curr).iter() {
            acc.push(dest_pair.clone());
          }
          acc
        });
        curr_src_pairs = dest_pairs;
      }
      // println!("{:#?}", dest_pairs);
      for pair in curr_src_pairs.iter() {
        locatons.push(pair.start);
      }
    }
  }
  let min_location = locatons.iter().fold(u64::MAX, |acc, curr| min(acc, *curr));
  println!("min location: {}", min_location);
}

fn day5_part1(amc: &Almanac) {
  println!("\n~ Day 5 Part 1 ~");
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
