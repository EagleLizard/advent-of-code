
use crate::day7::{
  camel_hand_parse::parse_camel_hands,
  playing_card::{
    get_hand_type,
    PlayingCard
  }
};

use super::playing_card::CamelHand;

pub fn day7_part1(input_lines: &Vec<String>) -> u32 {
  let camel_hands = parse_camel_hands(&input_lines);
  let mut sorted_hands: Vec<CamelHand> = camel_hands.clone();
  sorted_hands.sort();

  let mut curr_hand_n = 1;
  let total_winnings: u32 = sorted_hands.iter().fold(0, |acc, curr| {
    let curr_winnings: u32 = curr.bid as u32 * curr_hand_n;
    curr_hand_n += 1;
    acc + curr_winnings
  });
  total_winnings
}

pub fn day7_part2(input_lines: &Vec<String>) -> u32 {
  let camel_hands = parse_camel_hands(&input_lines);
  let mut joker_camel_hands = camel_hands.clone();
  for joker_camel_hand in joker_camel_hands.iter_mut() {
    for card in joker_camel_hand.cards.iter_mut() {
      *card = match card {
        PlayingCard::Jack => PlayingCard::Joker,
        _ => *card
      }
    }
    joker_camel_hand.hand_type = get_hand_type(&joker_camel_hand.cards, true);
  }
  let mut sorted_hands: Vec<CamelHand> = joker_camel_hands.clone();
  sorted_hands.sort();
  let mut curr_hand_n = 1;
  let total_winnings: u32 = sorted_hands.iter().fold(0, |acc, curr| {
    let curr_winnings: u32 = curr.bid as u32 * curr_hand_n;
    curr_hand_n += 1;
    acc + curr_winnings
  });
  total_winnings
}

#[cfg(test)]
mod day8_tests {
  
  use crate::constants::DAY_7_INPUT_FILE_NAME;
  use crate::util::input_util::load_day_input;
  use super::*;

  fn get_test_input() -> Vec<String> {
    let input_lines: Vec<String> = load_day_input(DAY_7_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();
    input_lines
  }

  #[test]
  fn p1_test() {
    let test_input = get_test_input();
    let result = day7_part1(&test_input);
    assert_eq!(result, 251058093)
  }

  #[test]
  fn p2_test() {
    let test_input = get_test_input();
    let result = day7_part2(&test_input);
    assert_eq!(result, 249781879)
  }
}
