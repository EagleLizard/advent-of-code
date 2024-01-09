
use crate::day6::boat_race_parse::parse_boat_races;
use super::boat_race::BoatRace;

pub fn day6_part2(input_lines: &Vec<String>) -> u64 {
  let boat_races = parse_boat_races(input_lines);
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
  
  ways_to_win
}

pub fn day6_part1(input_lines: &Vec<String>) -> u32 {
  let boat_races = parse_boat_races(input_lines);
  let mut ways_to_win = Vec::new();
  for boat_race in boat_races.iter() {
    let curr_ways_to_win = get_ways_to_win(boat_race);
    ways_to_win.push(curr_ways_to_win);
  }
  let win_multiple: u32 = ways_to_win.iter()
    .map(|way_to_win| *way_to_win as u32)
    .fold(1, |acc, curr| acc * curr);
  win_multiple  
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

