
mod day2;
mod day4;
mod util;

use crate::util::log_util::get_day_divider_n;

fn main() {
    println!("\n{}\n", get_day_divider_n(13));
    println!("EagleLizard - Advent of Code [Rust]");
    println!("\n{}\n", get_day_divider_n(13));
    
    day2::day2main::day2main();
    println!("\n{}\n", get_day_divider_n(5));

    day4::day4main::day4_main();    

}
