use crate::{util::{input_util::load_day_input, timer::run_and_time}, day11::galaxy_map::GalaxyMap};

const DAY_11_INPUT_FILE_NAME: &str = "day11_test1.txt";

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
  for curr_row in galaxy_map.matrix {
    for curr_el in curr_row {
      print!("{}",curr_el.to_char())
    }
    print!("\n")
  }
}
