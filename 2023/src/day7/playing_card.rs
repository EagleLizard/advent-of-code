
use std::collections::HashMap;
use std::cmp::{Ord, Ordering};


/*
A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2
*/
#[derive(Debug, PartialEq, Eq, Hash, PartialOrd, Ord, Clone, Copy)]
pub enum PlayingCard {
  Joker,
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
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
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
  pub hand_type: PlayingHand,
  pub bid: u16,
}
impl CamelHand {
  // #[allow(dead_code)]
  pub fn get_hand_str(&self) -> String {
    self.cards.iter().map(|card| get_card_str(card).to_string())
      .collect::<Vec<String>>()
      .join("")
  }
}

pub fn get_hand_type(cards: &[PlayingCard; 5], with_joker: bool) -> PlayingHand {
  /*
    count the number of cards
  */
  let mut card_counts: HashMap<&PlayingCard, u8> = HashMap::new();
  for card in cards.iter() {
    if !card_counts.contains_key(card) {
      card_counts.insert(card, 0 as u8);
    }
    let curr_card_count = card_counts.get(card).unwrap();
    card_counts.insert(card, curr_card_count + 1);
  }
  // println!("{:#?}", card_counts);
  let mut joker_count = 0;
  if with_joker && cards.contains(&PlayingCard::Joker) {
    
    /*
      stash count and pluck out joker
        UNLESS joker is the 5 card
    */
    joker_count = *card_counts.get(&PlayingCard::Joker).unwrap();
    if joker_count < 5 {
      card_counts.remove(&PlayingCard::Joker);
    } else {
      return PlayingHand::FiveOfAKind;
    }

  }
  
  /*
    create a copy to avoid mutable borrow
  */
  let card_counts_copy = card_counts.clone();
  let max_card_pair = card_counts_copy.iter().reduce(|acc, curr| {
    if acc.1 > curr.1 {
      acc
    } else {
      curr
    }
  }).unwrap();
  
  card_counts.insert(max_card_pair.0, *max_card_pair.1 + joker_count).unwrap();
  let max_card_val = card_counts.get(max_card_pair.0).unwrap();
  let hand_type = match max_card_val {
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

impl Ord for CamelHand {
  fn cmp(&self, other: &Self) -> Ordering {
    let a_hand_type = self.hand_type;
    let b_hand_type = other.hand_type;
    if a_hand_type < b_hand_type {
      return Ordering::Less;
    } else if a_hand_type > b_hand_type {
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
    PlayingCard::Joker => "J",
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