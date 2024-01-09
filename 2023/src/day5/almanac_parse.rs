use std::collections::HashMap;

use crate::day5::almanac::{Almanac, AmcEntryKind, AlmanacEntry};

use regex::Regex;

use super::almanac::AlmanacMap;

pub fn parse_almanac(input_lines: &Vec<String>) -> Almanac {
  let mut curr_amc_state: AmcEntryKind = AmcEntryKind::None;
  let mut almanac_entries_map: HashMap<AmcEntryKind, AlmanacEntry> = HashMap::new();

  let num_rx = Regex::new(r"^[0-9]").unwrap();

  let mut seeds_opt: Option<Vec<u64>> = Option::None;

  for line in input_lines.iter() {
    curr_amc_state = get_amc_state(curr_amc_state, line);

    if curr_amc_state == AmcEntryKind::None {
      panic!("AmcEntryKind::None encountered");
    }

    if curr_amc_state == AmcEntryKind::Seed {
      seeds_opt = Some(parse_seeds(line));
    } else {
      if !almanac_entries_map.contains_key(&curr_amc_state) {
        let amc_entry = AlmanacEntry {
          kind: curr_amc_state,
          amc_maps: Vec::new(),
        };
        almanac_entries_map.insert(amc_entry.kind, amc_entry);
      }
  
      let curr_amc_entry = almanac_entries_map.get_mut(&curr_amc_state).unwrap();
  
      if num_rx.is_match(line) {
        let amc_map = parse_almanac_map(line);
        curr_amc_entry.amc_maps.push(amc_map);
      }
    }
  }

  let seeds = seeds_opt.unwrap();

  let mut amc_entries = almanac_entries_map.values().cloned().collect::<Vec<AlmanacEntry>>();

  amc_entries.sort_by(|a, b| (a.kind as isize).cmp(&(b.kind as isize)));

  return Almanac {
    seeds,
    amc_entries,
  }; 
}

fn parse_seeds(line: &str) -> Vec<u64> {
  let seeds: Vec<u64> = line.split(":")
    .collect::<Vec<&str>>()[1]
    .trim()
    .split(" ")
    .map(|seed_str| seed_str.trim().parse::<u64>().unwrap())
    .collect();
  return seeds;
}

fn parse_almanac_map(line: &str) -> AlmanacMap {
  let amc_map_parts: Vec<&str> = line.split(" ").collect();
  let amc_map = AlmanacMap {
    dest_start: amc_map_parts[0].parse::<u64>().unwrap(),
    src_start: amc_map_parts[1].parse::<u64>().unwrap(),
    range_len: amc_map_parts[2].parse::<u64>().unwrap(),
  };
  return amc_map;
}

fn get_amc_state(curr_state: AmcEntryKind, line: &String) -> AmcEntryKind {
  let amc_state: AmcEntryKind;
  let amc_entry_str: &str = line.split(" ").collect::<Vec<&str>>()[0];

  if line.len() < 1 {
    /*
      Empty lines denote a change in state,
        unset state and move to next
    */
    return AmcEntryKind::None;
  }

  // line is an almanac map declaration, or seeds
  if line.contains(":") {
    // line is seeds
    if !line.contains("map") {
      return AmcEntryKind::Seed;
    }
    amc_state = match amc_entry_str {
      "seed-to-soil" => AmcEntryKind::SeedToSoil,
      "soil-to-fertilizer" => AmcEntryKind::SoilToFertilizer,
      "fertilizer-to-water" => AmcEntryKind::FertilizerToWater,
      "water-to-light" => AmcEntryKind::WaterToLight,
      "light-to-temperature" => AmcEntryKind::LightToTemperature,
      "temperature-to-humidity" => AmcEntryKind::TemperatureToHumidity,
      "humidity-to-location" => AmcEntryKind::HumidityToLocation,
      _ => panic!("Invalid almanac map declaration: {}", line)
    };
  } else {
    amc_state = curr_state;
  }

  return amc_state;
}
