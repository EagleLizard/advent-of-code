

use crate::util::input_util::load_day_input;

const DAY_4_INPUT_FILE_NAME: &str = "day4.txt";

#[derive(Debug)]
struct Card {
  id: u16,
  winning_nums: Vec<u16>,
  nums: Vec<u16>,
  score: u16,
}

pub fn day4_main() {
  println!("~ Day 4 ~");

  let input_lines = load_day_input(DAY_4_INPUT_FILE_NAME);
  let cards = parse_card_lines(input_lines);

  for card in cards.iter() {
    println!("id: {}", card.id);
    println!("winning_nums: {}", card.winning_nums.iter().map(|x| x.to_string()).collect::<Vec<String>>().join(", "));
    println!("nums: {}", card.nums.iter().map(|x| x.to_string()).collect::<Vec<String>>().join(", "));
    println!();
  }
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
    score: 0,
  };

  return card;
}
