
use crate::day2::game::{ Game, GameHand };

pub fn parse_game_line(line: &str) -> Result<Game, String> {
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
  let hand_strs: Vec<&str>;
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
