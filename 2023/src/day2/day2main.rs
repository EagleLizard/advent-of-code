
use std::{env, path::PathBuf};

use crate::day2::game::{
  Game,
  GameHand,
  BagContents,
};
use crate::day2::game_parse::parse_game_line;
use crate::util::input_util::load_day_input;

const DAY_2_INPUT_FILE_NAME: &str = "day2.txt";

pub fn day2main () {
  println!("\n~ Day 2 ~");
  let input_lines : Vec<String> = load_day_input(DAY_2_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
  let mut all_games: Vec<Game> = Vec::new();
  for line in input_lines.iter() {
    let curr_game = parse_game_line(line).unwrap();
    all_games.push(curr_game.clone());
  }
  
  day2p1(&all_games);
  day2p2(&all_games);
}

fn day2p2(all_games: &Vec<Game>) {
  /*
    in each game you played, what is the fewest number of cubes of each color
      that could have been in the bag to make the game possible?
  */
  println!("\n~ Day 2 Part 2 ~");
  let mut all_min_bags: Vec<BagContents> = Vec::new();
  for curr_game in all_games.iter() {
    let mut min_bag = BagContents {
      red: 0,
      green: 0,
      blue: 0,
    };
    for curr_hand in curr_game.hands.iter() {
      if curr_hand.red > min_bag.red {
        min_bag.red = curr_hand.red;
      }
      if curr_hand.green > min_bag.green {
        min_bag.green = curr_hand.green;
      }
      if curr_hand.blue > min_bag.blue {
        min_bag.blue = curr_hand.blue;
      }
    }
    all_min_bags.push(min_bag);
  }
  let min_bag_power_set_sum = all_min_bags.iter().fold(0, |acc, curr| {
    let power_val = curr.red * curr.blue * curr.green;
    return acc + power_val;
  });

  println!("Min cube set power sum:");
  println!("{}", min_bag_power_set_sum);
}

fn day2p1(all_games: &Vec<Game>) {
  /*
    The Elf would first like to know which games would have been possible
    if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?
  */
  println!("~ Day 2 Part 1 ~");
  let mut possible_games: Vec<&Game> = Vec::new();
  let bag_contents = BagContents {
    red: 12,
    green: 13,
    blue: 14
  };
  for curr_game in all_games.iter() {
    if is_possible_game(&curr_game, &bag_contents) {
      possible_games.push(curr_game);
    }
  }
  let id_sum = possible_games.iter().fold(0, |acc, curr| acc + curr.game_id);
  println!("{}", "Possible game IDs sum: \n".to_string() + &id_sum.to_string());

  fn is_possible_game(game: &Game, bag_contents: &BagContents) -> bool {
    return game.hands.iter().all(|hand| is_possible_hand(hand, bag_contents));
  }
  
  fn is_possible_hand(hand: &GameHand, bag_contents: &BagContents) -> bool {
    return (hand.red <= bag_contents.red)
      && (hand.green <= bag_contents.green)
      && (hand.blue <= bag_contents.blue)
    ;
  }
}
