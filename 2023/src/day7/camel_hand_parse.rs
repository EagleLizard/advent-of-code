
use super::playing_card::{CamelHand, PlayingCard};

pub fn parse_camel_hands(input_lines: &Vec<String>) -> Vec<CamelHand> {
  let mut camel_hands = Vec::new();
  for input_line in input_lines.iter() {
    let hand_parts: Vec<&str> = input_line.split(" ")
      .map(|hand_part| hand_part.trim())
      .collect();
    let cards:Vec<PlayingCard> = hand_parts[0].split("")
      .filter(|card_str| card_str.len() > 0)
      .map(|card_str| match card_str {
        "A" => PlayingCard::Ace,
        "K" => PlayingCard::King,
        "Q" => PlayingCard::Queen,
        "J" => PlayingCard::Jack,
        "T" => PlayingCard::Ten,
        "9" => PlayingCard::Nine,
        "8" => PlayingCard::Eight,
        "7" => PlayingCard::Seven,
        "6" => PlayingCard::Six,
        "5" => PlayingCard::Five,
        "4" => PlayingCard::Four,
        "3" => PlayingCard::Three,
        "2" => PlayingCard::Two,
        _ => panic!("Invalid playing card: {}", card_str)
      })
      .collect();
    let bid: u16 = hand_parts[1].parse().unwrap();
    let camel_hand = CamelHand {
      cards: cards.try_into().unwrap(),
      bid,
    };
    camel_hands.push(camel_hand);
  }
  camel_hands
}
