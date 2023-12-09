

use crate::util::input_util::load_day_input;
use crate::day4::scratch_card::Card;

const DAY_4_INPUT_FILE_NAME: &str = "day4.txt";

pub fn day4_main() {
  println!("~ Day 4 ~");

  let input_lines = load_day_input(DAY_4_INPUT_FILE_NAME);
  let cards = parse_card_lines(input_lines);
  let mut score_sum: u16 = 0;

  for card in cards.iter() {
    let score = card.get_score();
    score_sum += score;
  }

  println!("score sum: {}", score_sum);
}

fn parse_card_lines(lines: Vec<String>) -> Vec<Card> {
  let mut cards: Vec<Card> = Vec::new();

  for line in lines.iter() {
    let card = parse_card_line(line);
    cards.push(card);
  }

  return cards;
}

fn parse_card_line(line: &str) -> Card {
  let card_parts: Vec<&str> = line.split(':')
    .map(|part| part.trim())
    .collect();
  let card_id_parts: Vec<&str> = card_parts[0].split(' ')
    .filter(|card_id_part| card_id_part.len() > 0)
    .collect();
  let card_id: u16 = card_id_parts[1].parse().unwrap();

  let nums_parts: Vec<&str> = card_parts[1].split('|')
    .map(|nums_parts| nums_parts.trim())
    .collect();
  let winning_nums: Vec<u16> = nums_parts[0].split(' ')
    .filter(|winning_num| winning_num.len() > 0)
    .map(|winning_num| winning_num.trim().parse::<u16>().unwrap())
    .collect();

  let nums: Vec<u16> = nums_parts[1].split(" ")
    .filter(|num| num.len() > 0)
    .map(|num| num.trim().parse::<u16>().unwrap())
    .collect();

  let card: Card = Card {
    id: card_id,
    winning_nums,
    nums,
  };

  return card;
}
