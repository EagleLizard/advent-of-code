
#[derive(Debug, Copy, Clone)]
pub struct GameHand {
  pub red: u16,
  pub blue: u16,
  pub green: u16,
}

pub type BagContents = GameHand;

#[derive(Debug)]
pub struct Game {
  pub game_id: u16,
  pub hands: Vec<GameHand>,
}
impl Game {
  pub fn clone(&self) -> Game {
    return Game {
      game_id: self.game_id,
      hands: self.hands.clone(),
    }
  }
}
