
use::std::iter::zip;

use super::boat_race::BoatRace;


pub fn parse_boat_races(lines: Vec<String>) -> Vec<BoatRace> {
  let boat_races: Vec<BoatRace> = Vec::new();

  let times_str = lines[0].split(":").collect::<Vec<&str>>()[1].trim();
  let distances_str = lines[1].split(":").collect::<Vec<&str>>()[1].trim();

  let times: Vec<u16> = times_str.split(" ")
    .filter(|time_str| time_str.len() > 0)
    .map(|time_str| time_str.parse().unwrap())
    .collect();
  let distances: Vec<u16> = distances_str.split(" ")
    .filter(|distance_str| distance_str.len() > 0)
    .map(|distance_str| distance_str.parse().unwrap())
    .collect();
  let mut boat_races: Vec<BoatRace> = Vec::new();
  let mut curr_id = 1;
  for race_pairs in zip(times, distances) {
    boat_races.push(BoatRace {
      id: curr_id,
      time: race_pairs.0,
      distance: race_pairs.1,
    });
    curr_id += 1;
  }


  boat_races
}
