use std::collections::HashSet;


#[derive(Debug, Clone)]
pub struct Card {
  pub id: u16,
  pub winning_nums: Vec<u16>,
  pub nums: Vec<u16>,
  pub copies: u32,
}
impl Card {

  pub fn get_win_count(&self) -> u16 {
    let win_count: u16;
    let winning_nums_set = self.winning_nums.iter()
      .fold(HashSet::<&u16>::new(), |mut acc, curr| {
        acc.insert(curr);
        return acc;
      }
    );

    win_count = self.nums.iter().fold(0, |acc, curr| {
      if winning_nums_set.contains(curr) {
        return acc + 1;
      }
      return acc;
    });

    return win_count;
  }

  pub fn get_score(&self) -> u16 {
    let score: u16;

    let winning_nums_set = self.winning_nums.iter()
      .fold(HashSet::<&u16>::new(), |mut acc, curr| {
        acc.insert(curr);
        return acc;
      }
    );

    score = self.nums.iter().fold(0, |acc, curr| {
      if winning_nums_set.contains(curr) {
        if acc == 0 {
          return 1;
        } else {
          return acc * 2;
        }
      }
      return acc;
    });

    return score;
  }
}
