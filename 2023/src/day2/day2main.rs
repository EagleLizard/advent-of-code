
use std::{env, path::PathBuf};


#[derive(Debug)]
struct GameHand {
  red: u16,
  blue: u16,
  green: u16,
}

type BagContents = GameHand;

#[derive(Debug)]
struct Game {
  game_id: u16,
  hands: Vec<GameHand>,
}

/*
  The Elf would first like to know which games would have been possible
  if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?
*/

pub fn day2main () {
  println!("~ Day 2 ~");
  println!("{}", get_input_path().display());
  let input_lines = load_day2_input();
  let bag_contents = BagContents {
    red: 12,
    green: 13,
    blue: 14
  };
  let mut possible_games: Vec<Game> = Vec::new();
  for line in input_lines.iter() {
    let curr_game = parse_game_line(line).unwrap();
    if is_possible_game(&curr_game, &bag_contents) {
      possible_games.push(curr_game);
    }
  }
  let id_sum = possible_games.iter().fold(0, |acc, curr| acc + curr.game_id);
  println!("{}", "Possible game IDs sum: \n".to_string() + &id_sum.to_string());
}

fn is_possible_game(game: &Game, bag_contents: &BagContents) -> bool {
  return game.hands.iter().all(|hand| is_possible_hand(hand, bag_contents));
}

fn is_possible_hand(hand: &GameHand, bag_contents: &BagContents) -> bool {
  return (hand.red <= bag_contents.red)
    && (hand.green <= bag_contents.green)
    && (hand.blue <= bag_contents.blue)
  ;
  
}

fn parse_game_line(line: &str) -> Result<Game, String> {
  /*
    Game 2: 6 red, 11 green; 4 blue, 4 green, 5 red; 11 green, 6 blue, 6 red
  */
  let game: Game;
  let mut hands: Vec<GameHand>;
  let line_parts: Vec<&str> = line.split(':').collect();
  if line_parts.len() < 1 {
    return Err(format!("Input line missing semicolon: {}", line))
  }
  
  let game_part = line_parts[0];
  let cubes_part = line_parts[1].trim();

  // println!("{}", "\n~~~~~~~~~\n\n".to_string() + line);
  // println!("{}", cubes_part);
  // println!("{}", game_part);

  let game_id: u16 = game_part.split(' ')
    .last()
    .unwrap()
    .to_string()
    .parse()
    .unwrap()
  ;
  
  let game_hand_strs: Vec<&str> = cubes_part.split(";")
    .map(|hand_str| hand_str.trim())
    .collect()
  ;
  hands = Vec::new();

  for game_hand_str in game_hand_strs.iter() {
    let game_hand: GameHand;
    game_hand = parse_game_hand(game_hand_str).unwrap();
    hands.push(game_hand);
  }

  game = Game {
    game_id,
    hands,
  };

  return Ok(game);
}

fn parse_game_hand(game_hand_str: &str) -> Result<GameHand, String> {
  let mut hand = GameHand {
    red: 0,
    blue: 0,
    green: 0,
  };
  let mut hand_strs: Vec<&str> = Vec::new();
  if !game_hand_str.contains(',') {
    // only one str exists
    hand_strs = vec![game_hand_str]
  } else {
    hand_strs = game_hand_str.split(',')
      .map(|cube_str| cube_str.trim())
      .collect()
  }

  for hand_str in hand_strs.iter() {
    // println!("{}", hand_str);
    let hand_parts: Vec<&str> = hand_str.split(' ').collect();
    let cube_count: u16 = hand_parts[0].parse().unwrap();
    match hand_parts[1] {
      "red" => hand.red = cube_count,
      "blue" => hand.blue = cube_count,
      "green" => hand.green = cube_count,
      &_ => {
        return Err("Invalid cube color in hand: ".to_string() + hand_parts[1])
      }
    }
  }

  return Ok(hand);
}

fn get_input_path() -> PathBuf {
  let input_dir_path = get_base_path()
    .join("input");
  return std::fs::canonicalize(input_dir_path).unwrap();
}

fn get_base_path() -> PathBuf {
  return env::current_dir().unwrap();
}

fn load_day2_input() -> Vec<String> {
  let input_file_name = "day2.txt";
  let input_file_path = std::fs::canonicalize(
      get_input_path().join(input_file_name)
  ).unwrap();
  let input_file_data = std::fs::read_to_string(input_file_path).unwrap();
  let input_file_lines = input_file_data
    .split("\n")
    .filter(|line| line.len() > 0)
    .map(|line| String::from(line))
    .collect::<Vec<String>>();

  return input_file_lines;
}

