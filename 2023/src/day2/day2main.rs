
use crate::day2::game::{
  Game,
  GameHand,
  BagContents,
};
use crate::day2::game_parse::parse_game_line;

pub fn day2p2(input_lines: &Vec<String>) -> u16 {
  /*
    in each game you played, what is the fewest number of cubes of each color
      that could have been in the bag to make the game possible?
  */
  let mut all_min_bags: Vec<BagContents> = Vec::new();
  let mut all_games: Vec<Game> = Vec::new();
  for line in input_lines.iter() {
    let curr_game = parse_game_line(line).unwrap();
    all_games.push(curr_game)
  }
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

  min_bag_power_set_sum
}

pub fn day2p1(input_lines: &Vec<String>) -> u16 {
  /*
    The Elf would first like to know which games would have been possible
    if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?
  */
  let mut all_games: Vec<Game> = Vec::new();
  for line in input_lines.iter() {
    let curr_game = parse_game_line(line).unwrap();
    all_games.push(curr_game)
  }
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
  return id_sum;

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
