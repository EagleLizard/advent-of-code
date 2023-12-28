
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
    day11_part1(&galaxy_map);
  });
  println!("\n[d11p1] took: {:#?}", fun_time);

  let fun_time = run_and_time(|| {
    /*
    611998089572
    611998701561 - too high
    */
    day11_part2(&mut galaxy_map.clone());
  });
  println!("\n[d11p2] took: {:#?}", fun_time);
}


fn day11_part1(src_galaxy_map: &GalaxyMap) {
  println!("\n~ Day 11 Part 1 ~");
  let galaxy_map = src_galaxy_map.expand();
  let galaxy_pairs = get_pairs(&galaxy_map.galaxies);

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
  let expand_by: u32 = 999999;
  /*
    to expand the rows:
      1. find each column that requires exapnsion
      2. find all galaxies to the right of column
      3. update each galaxy's x val to the size of
        the expansion
    to expand the cols:
      1. find each row that requires exapnsion
      2. find all galaxies below the row (y is inverted)
      3. update each galaxy's y val to the size of
        the expansion
  */
  let mut expanded_cols = src_galaxy_map.expanded_cols.clone();
  expanded_cols.reverse();
  for expanded_col in expanded_cols {
    let galaxies = &mut src_galaxy_map.galaxies;
    let col_val = u32::try_from(expanded_col).unwrap();
    for galaxy in galaxies {
      if galaxy.x > col_val {
        galaxy.x += expand_by;
      }
    }
  }
  let mut expanded_rows = src_galaxy_map.expanded_rows.clone();
  expanded_rows.reverse();
  for expanded_row in expanded_rows {
    let galaxies = &mut src_galaxy_map.galaxies;
    let row_val = u32::try_from(expanded_row).unwrap();
    for galaxy in galaxies {
      if galaxy.y > row_val {
        galaxy.y += expand_by;
      }
    }
  }
  let galaxy_pairs = get_pairs(&src_galaxy_map.galaxies);

  let mut all_lengths = vec![];
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
  let mut galaxies: HashSet<GalaxyMapEl> = HashSet::from_iter(src_galaxies.iter().cloned());

  for el in src_galaxies {
    galaxies.remove(&el);
    for curr_el in &galaxies {
      pairs.push((*el, *curr_el))
    }
  }
  pairs
}
