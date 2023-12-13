use crate::{
  util::{
    input_util::load_day_input,
    timer::run_and_time
  },
  day7::{camel_hand_parse::parse_camel_hands, playing_card::{get_hand_type, PlayingCard}}
};

use super::playing_card::CamelHand;


const DAY_7_INPUT_FILE_NAME: &str = "day7.txt";

pub fn day7_main() {
  println!("~ Day 7 ~");
  let input_lines: Vec<String> = load_day_input(DAY_7_INPUT_FILE_NAME)
    .into_iter()
    .filter(|line| line.len() > 0)
    .collect();

  let camel_hands = parse_camel_hands(&input_lines);

  let mut fun_time = run_and_time(|| {
    day7_part1(&camel_hands);
  });
  println!("\n[d7p1] took: {:#?}", fun_time);

  fun_time = run_and_time(|| {
    day7_part2(&camel_hands);
  });
  println!("\n[d7p2] took: {:#?}", fun_time);
}

pub fn day7_part1(camel_hands: &Vec<CamelHand>) {
  println!("\n~ Day 7 Part 1 ~");
  let mut sorted_hands: Vec<CamelHand> = camel_hands.clone();
  sorted_hands.sort();

  let mut curr_hand_n = 1;
  let total_winnings: u32 = sorted_hands.iter().fold(0, |acc, curr| {
    let curr_winnings: u32 = curr.bid as u32 * curr_hand_n;
    curr_hand_n += 1;
    acc + curr_winnings
  });
  println!("total_winnings: {}", total_winnings);

}

pub fn day7_part2(camel_hands: &Vec<CamelHand>) {
  println!("\n~ Day 7 Part 2 ~");
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
  println!("total_winnings: {}", total_winnings);
}
