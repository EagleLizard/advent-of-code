
#[derive(Debug, Clone, Copy)]
pub struct BoatRace {
  pub id: u16,
  pub time: u16,
  pub distance: u16,
}
impl BoatRace {
  pub fn hold_button(&self, ms: u16) -> u16 {
    let remaining_time = self.time - ms;
    let distance = remaining_time * ms;
    distance
  }
}