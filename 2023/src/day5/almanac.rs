
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
