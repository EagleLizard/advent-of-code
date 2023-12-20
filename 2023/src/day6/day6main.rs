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

  fun_time = run_and_time(|| {
    day6_part2(&boat_races)
  });
  println!("\n[d6p2] took: {:#?}", fun_time);
}

fn day6_part2(boat_races: &Vec<BoatRace>) {
  println!("\n~ Day 6 Part 2 ~");
  
  let actual_time = boat_races.iter().fold(Vec::new(), |mut acc, curr| {
      acc.push(curr.time.to_string());
      acc
    })
    .join("")
    .parse::<u64>()
    .unwrap();
  let actual_distance = boat_races.iter().fold(Vec::new(), |mut acc, curr| {
    acc.push(curr.distance.to_string());
    acc
  })
    .join("")
    .parse::<u64>()
    .unwrap();
  let boat_race = BoatRace {
    id: 1,
    time: actual_time,
    distance: actual_distance,
  };
  let ways_to_win = get_ways_to_win_faster(&boat_race);
  // let ways_to_win = get_ways_to_win(&boat_race);
  println!("ways_to_win: {}", ways_to_win);
}

fn day6_part1(boat_races: &Vec<BoatRace>) {
  println!("\n~ Day 6 Part 1 ~");
  let mut ways_to_win = Vec::new();
  for boat_race in boat_races.iter() {
    let curr_ways_to_win = get_ways_to_win(boat_race);
    ways_to_win.push(curr_ways_to_win);
  }
  let win_multiple: u32 = ways_to_win.iter()
    .map(|way_to_win| *way_to_win as u32)
    .fold(1, |acc, curr| acc * curr);
  println!("win_multiple: {}", win_multiple);
    
}

// #[allow(dead_code)]
fn get_ways_to_win(boat_race: &BoatRace) -> u64 {
  let mut curr_ways_to_win: u64 = 0;
  for i in 0..(boat_race.time + 1) {
    let curr_distance = boat_race.hold_button(i);
    if curr_distance > boat_race.distance {
      curr_ways_to_win += 1;
    }
  }
  curr_ways_to_win
}

/*
  ~400% faster than other
*/
fn get_ways_to_win_faster(boat_race: &BoatRace) -> u64 {
  let mut first_win_idx = 0;
  let mut last_win_idx = 0;
  for i in 0..(boat_race.time + 1) {
    let curr_distance = boat_race.hold_button(i);
    if curr_distance > boat_race.distance {
      first_win_idx = i;
      break;
    }
  }
  for i in (0..boat_race.time + 1).rev() {
    let curr_distance = boat_race.hold_button(i);
    if curr_distance > boat_race.distance {
      last_win_idx = i;
      break;
    }
  }
  let ways_to_win = (last_win_idx + 1) - first_win_idx;
  ways_to_win
}

