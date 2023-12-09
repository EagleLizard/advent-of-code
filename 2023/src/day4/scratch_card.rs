use std::collections::HashSet;


#[derive(Debug)]
pub struct Card {
  pub id: u16,
  pub winning_nums: Vec<u16>,
  pub nums: Vec<u16>,
}
impl Card {

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
