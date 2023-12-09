
const DAY_DIVIDER_STR: &str = "🎄~";

pub fn get_day_divider_n(repeat_n: usize) -> String {
  return DAY_DIVIDER_STR.repeat(repeat_n);
}
