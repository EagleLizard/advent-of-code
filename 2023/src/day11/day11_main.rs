
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
    day11_part1(&galaxy_map);
  });
  println!("\n[d11p1] took: {:#?}", fun_time);
}


pub fn day11_part1(src_galaxy_map: &GalaxyMap) {
  println!("\n~ Day 11 Part 1 ~");
  let galaxy_map = src_galaxy_map.expand();
  let galaxy_pairs = get_pairs(galaxy_map);

  let mut all_lengths = vec![];
  for pair in galaxy_pairs {
    let (galaxy_a, galaxy_b) = pair;
    let steps = find_path(galaxy_a, galaxy_b);
    all_lengths.push(steps);
  }

  let all_lengths_sum: u32 = all_lengths.iter().sum();
  println!("All lengths sum: {}", all_lengths_sum);
}

fn find_path(galaxy_a: GalaxyMapEl, galaxy_b: GalaxyMapEl) -> u32 {
  let x1 = galaxy_a.x;
  let y1 = galaxy_a.y;
  let x2 = galaxy_b.x;
  let y2 = galaxy_b.y;

  let mut curr_x = x1;
  let mut curr_y = y1;
  let mut steps: u32 = 0;
  while curr_x != x2 || curr_y != y2 {
    let dx;
    let dy;
    if curr_x > x2 {
      dx = curr_x - x2;
    } else {
      dx = x2 - curr_x;
    }
    if curr_y > y2 {
      dy = curr_y - y2;
    } else {
      dy = y2 - curr_y;
    }

    /*
    move in the direction we're farther from
    */
    if dx > dy {
      if curr_x < x2 {
        curr_x += 1;
      } else if curr_x > x2 {
        curr_x -= 1;
      }
    } else {
      if curr_y < y2 {
        curr_y += 1;
      } else if curr_y > y2 {
        curr_y -= 1;
      }
    }
    steps += 1;
  }
  steps
}

fn get_pairs(galaxy_map: GalaxyMap) -> Vec<(GalaxyMapEl, GalaxyMapEl)> {
  let mut pairs = Vec::new();
  let mut galaxies = galaxy_map.galaxies.clone();

  for el in galaxy_map.galaxies {
    galaxies.remove(&el);
    for curr_el in &galaxies {
      pairs.push((el, *curr_el))
    }
  }
  pairs
}
