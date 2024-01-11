
use crate::day4::scratch_card::Card;

pub fn day4_part2(input_lines: &Vec<String>) -> u32 {
  let base_cards = parse_card_lines(input_lines);
  let mut cards: Vec<Card> = base_cards.to_vec().clone();

  let mut i: usize = 0;

  while i < cards.len() {
    let card = cards[i].clone();
    let win_count = card.get_win_count() as usize;
    for k in 0..win_count {
      let copy_idx = i + k + 1;
      if copy_idx > cards.len() - 1 {
        break;
      }
      let card_ref = &mut cards[i + k + 1];
      card_ref.copies += 1 * card.copies;
    }
    i += 1;
  }

  let total_cards: u32 = cards.iter().fold(0, |acc, curr| acc + curr.copies);

  total_cards
}

pub fn day4_part1(input_lines: &Vec<String>) -> u16 {
  let cards = parse_card_lines(input_lines);
  let mut score_sum: u16 = 0;

  for card in cards.iter() {
    let score = card.get_score();
    score_sum += score;
  }

  score_sum
}

fn parse_card_lines(lines: &Vec<String>) -> Vec<Card> {
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
    copies: 1,
  };

  return card;
}
