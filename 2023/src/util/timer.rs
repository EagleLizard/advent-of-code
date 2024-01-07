
use std::time::{Duration, Instant};

pub fn run_and_time<F>(mut fun: F) -> Duration
where
  F: FnMut()
{
  let start = Instant::now();
  fun();
  let fun_time = start.elapsed();
  return fun_time;
}
