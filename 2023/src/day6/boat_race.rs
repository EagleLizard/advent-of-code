
#[derive(Debug, Clone, Copy)]
pub struct BoatRace {
  pub id: u16,
  pub time: u64,
  pub distance: u64,
}
impl BoatRace {
  pub fn hold_button(&self, ms: u64) -> u64 {
    let remaining_time = self.time - ms;
    let distance = remaining_time * ms;
    distance
  }
}
