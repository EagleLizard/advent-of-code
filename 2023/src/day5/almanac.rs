
#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum AmcEntryKind {
  None,
  Seed,
  SeedToSoil,
  SoilToFertilizer,
  FertilizerToWater,
  WaterToLight,
  LightToTemperature,
  TemperatureToHumidity,
  HumidityToLocation,
}

#[derive(Debug, Clone)]
pub struct AlmanacEntry {
  pub kind: AmcEntryKind,
  pub amc_maps: Vec<AlmanacMap>,
}
impl AlmanacEntry {
  pub fn get_dest(&self, src: u64) -> u64 {
    for amc_map in self.amc_maps.iter() {
      // check if the src is in the map range
      let src_end = amc_map.src_start + amc_map.range_len;
      if src >= amc_map.src_start 
        && src < src_end
      {
        // calculate the offset if it exists
        let offset: i64 = amc_map.dest_start as i64 - amc_map.src_start as i64;
        let dest = src as i64 + offset;
        return dest as u64;
      }
    }
    /*
      Return the same src value if no mapping found.
      Via the prompt:
        Any source numbers that aren't mapped correspond to
        the same destination number.
        So, seed number 10 corresponds to soil number 10.
    */
    src
  }
}

#[derive(Debug, Clone, Copy)]
pub struct AlmanacMap {
  pub dest_start: u64,
  pub src_start: u64,
  pub range_len: u64,
}

pub struct Almanac {
  pub seeds: Vec<u64>,
  pub amc_entries: Vec<AlmanacEntry>,
}
