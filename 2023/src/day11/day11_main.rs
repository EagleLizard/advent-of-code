
use std::collections::HashSet;

use crate::{util::{input_util::load_day_input, timer::run_and_time}, day11::galaxy_map::GalaxyMap};

use super::galaxy_map::GalaxyMapEl;

const DAY_11_INPUT_FILE_NAME: &str = "day11.txt";

pub fn day11_main() {
  println!("~ Day 11 ~");
  let input_lines: Vec<String> = load_day_input(DAY_11_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let galaxy_map = GalaxyMap::parse(input_lines);

  let fun_time = run_and_time(|| {
    day11_part1(&mut galaxy_map.clone());
  });
  println!("\n[d11p1] took: {:#?}", fun_time);

  let fun_time = run_and_time(|| {
    day11_part2(&mut galaxy_map.clone());
  });
  println!("\n[d11p2] took: {:#?}", fun_time);
}


fn day11_part1(src_galaxy_map: &mut GalaxyMap) {
  println!("\n~ Day 11 Part 1 ~");
  src_galaxy_map.expand(2);
  let galaxy_pairs = get_pairs(&src_galaxy_map.galaxies);

  let mut all_lengths = vec![];
  for pair in galaxy_pairs {
    let (galaxy_a, galaxy_b) = pair;
    let steps = find_path(galaxy_a, galaxy_b);
    all_lengths.push(steps);
  }

  let all_lengths_sum: u32 = all_lengths.iter().sum();
  println!("All lengths sum: {}", all_lengths_sum);
}

fn day11_part2(src_galaxy_map: &mut GalaxyMap) {
  println!("\n~ Day 11 Part 2 ~");
  
  src_galaxy_map.expand(1_000_000);

  let galaxy_pairs = get_pairs(&src_galaxy_map.galaxies);

  let mut all_lengths = Vec::with_capacity(galaxy_pairs.len());
  for pair in galaxy_pairs {
    let (galaxy_a, galaxy_b) = pair;
    let steps = find_path(galaxy_a, galaxy_b);
    all_lengths.push(steps);
  }

  let all_lengths_sum: u64 = all_lengths.iter()
    .map(|len| u64::try_from(*len).unwrap())
    .sum();
  println!("All lengths sum: {}", all_lengths_sum);
}

fn find_path(galaxy_a: GalaxyMapEl, galaxy_b: GalaxyMapEl) -> u32 {
  let x1 = galaxy_a.x;
  let y1 = galaxy_a.y;
  let x2 = galaxy_b.x;
  let y2 = galaxy_b.y;

  let dx;
  let dy;
  if x1 > x2 {
    dx = x1 - x2;
  } else {
    dx = x2 - x1;
  }
  if y1 > y2 {
    dy = y1 - y2;
  } else {
    dy = y2 - y1;
  }
  dx + dy
}

fn get_pairs(src_galaxies: &[GalaxyMapEl]) -> Vec<(GalaxyMapEl, GalaxyMapEl)> {
  let mut pairs = Vec::new();

  for i in 0..src_galaxies.len() {
    let curr_left = src_galaxies[i];
    for curr_right in &src_galaxies[i + 1..] {
      pairs.push((curr_left, *curr_right));
    }
  }
  pairs
}
