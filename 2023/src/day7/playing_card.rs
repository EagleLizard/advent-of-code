
use std::collections::HashMap;
use std::cmp::{Ord, Ordering};


/*
A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2
*/
#[derive(Debug, PartialEq, Eq, Hash, PartialOrd, Ord, Clone)]
pub enum PlayingCard {
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace,
}
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum PlayingHand {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}
#[derive(Clone)]
pub struct CamelHand {
  pub cards: [PlayingCard; 5],
  pub bid: u16,
}
impl CamelHand {
  pub fn get_type(&self) -> PlayingHand {
    /*
      count the number of cards
    */
    let mut card_counts = HashMap::new();
    for card in self.cards.iter() {
      if !card_counts.contains_key(card) {
        card_counts.insert(card, 0 as u8);
      }
      let curr_card_count = card_counts.get(card).unwrap();
      card_counts.insert(card, curr_card_count + 1);
    }
    let max_card = card_counts.iter()
      .reduce(|acc, curr| {
        if curr.1 > acc.1 {
          curr
        } else {
          acc
        }
      })
      .unwrap();
    let hand_type = match *max_card.1 {
      5 => PlayingHand::FiveOfAKind,
      4 => PlayingHand::FourOfAKind,
      3 => {
        let has_pair = card_counts.values().any(|count| *count == 2);
        if has_pair {
          PlayingHand::FullHouse
        } else {
          PlayingHand::ThreeOfAKind
        }
      }
      2 => {
        let pair_count = card_counts.values().fold(0, |acc, curr| {
          if *curr == 2 {
            acc + 1
          } else {
            acc
          }
        });
        if pair_count > 1 {
          PlayingHand::TwoPair
        } else {
          PlayingHand::OnePair
        }
      }
      1 => PlayingHand::HighCard,
      _ => unreachable!(),
    };
    return hand_type;
  }

  #[allow(dead_code)]
  pub fn get_hand_str(&self) -> String {
    self.cards.iter().map(|card| get_card_str(card).to_string())
      .collect::<Vec<String>>()
      .join("")
  }
}

impl Ord for CamelHand {
  fn cmp(&self, other: &Self) -> Ordering {
    let a_type = self.get_type();
    let b_type = other.get_type();
    if a_type < b_type {
      return Ordering::Less;
    } else if a_type > b_type {
      return Ordering::Greater;
    }
    /*
      If equal, compare cards one by one.
        Whichever has the higher card first wins.
    */
    for (a_card, b_card) in self.cards.iter().zip(other.cards.iter()) {
      if a_card < b_card {
        return Ordering::Less;
      } else if a_card > b_card {
        return Ordering::Greater;
      }
    }
    Ordering::Equal
  }
}
impl PartialOrd for CamelHand {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
      Some(self.cmp(other))
  }
}
impl PartialEq for CamelHand {
  fn eq(&self, other: &Self) -> bool {
    return self.cards == other.cards;
  }
}
impl Eq for CamelHand {}

fn get_card_str(card: &PlayingCard) -> &str {
  match card {
    PlayingCard::Two => "2",
    PlayingCard::Three => "3",
    PlayingCard::Four => "4",
    PlayingCard::Five => "5",
    PlayingCard::Six => "6",
    PlayingCard::Seven => "7",
    PlayingCard::Eight => "8",
    PlayingCard::Nine => "9",
    PlayingCard::Ten => "T",
    PlayingCard::Jack => "J",
    PlayingCard::Queen => "Q",
    PlayingCard::King => "K",
    PlayingCard::Ace => "A",
  }
}