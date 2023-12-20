use crate::{util::{input_util::load_day_input, timer::run_and_time}, day6::boat_race_parse::parse_boat_races};

use super::boat_race::BoatRace;


const DAY_6_INPUT_FILE_NAME: &str = "day6.txt";

pub fn day6_main() {
  println!("~ Day 6 ~");
  let input_lines: Vec<String> = load_day_input(DAY_6_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let boat_races = parse_boat_races(input_lines);

  let mut fun_time = run_and_time(|| {
    day6_part1(&boat_races)
  });
  println!("\n[d6p1] took: {:#?}", fun_time);
}

fn day6_part1(boat_races: &Vec<BoatRace>) {
  println!("\n~ Day 6 Part 1 ~");
  let mut ways_to_win: Vec<u16> = Vec::new();
  for boat_race in boat_races.iter() {
    let mut curr_ways_to_win: u16 = 0;
    for i in 0..(boat_race.time + 1) {
      let curr_distance = boat_race.hold_button(i);
      if curr_distance > boat_race.distance {
        curr_ways_to_win += 1;
      }
    }
    ways_to_win.push(curr_ways_to_win);
  }
  let win_multiple: u32 = ways_to_win.iter()
    .map(|way_to_win| *way_to_win as u32)
    .fold(1, |acc, curr| acc * curr);
  println!("win_multiple: {}", win_multiple);
    
}
