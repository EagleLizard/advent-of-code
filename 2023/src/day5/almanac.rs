use std::cmp::{max, min};


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

pub struct Almanac {
  pub seeds: Vec<u64>,
  pub amc_entries: Vec<AlmanacEntry>,
}

#[derive(Debug, Clone, Copy)]
pub struct AlmanacPair {
  pub start: u64,
  pub end: u64,
}
#[derive(Debug, Clone)]
pub struct AlmanacEntry {
  pub kind: AmcEntryKind,
  pub amc_maps: Vec<AlmanacMap>,
}
impl AlmanacEntry {
  pub fn get_dest_pairs(&self, amc_pair: &AlmanacPair) -> Vec<AlmanacPair> {
    for amc_map in self.amc_maps.iter() {
      /*
        Compare the input range overlap against the 
          current amc_map range
      */
      let amc_pair_end = amc_pair.start + amc_pair.end;
      let src_end = amc_map.src_start + amc_map.range_len;

      let does_pair_overlap_src = has_src_overlap(amc_pair, amc_map);
      if does_pair_overlap_src {
        /*
          Calculate the new pair as the overlap, and check if
            it overlaps with any dest range
        */
        let src_pair = AlmanacPair {
          start: max(amc_pair.start, amc_map.src_start),
          end: min(amc_pair_end - amc_pair.start, src_end - max(amc_pair.start, amc_map.src_start)),
        };

        let src_pair_end = src_pair.start + src_pair.end;
        
        let offset: i64 = amc_map.dest_start as i64 - amc_map.src_start as i64;
        let dest_pair = AlmanacPair {
          start: (src_pair.start as i64 + offset) as u64,
          end: src_pair.end,
        };

        /*
          if overlap found, return 1-3 pairs:
            1. the overlapping dest pair
            2. the outside less-than pair
            3. the outside greater-than pair
        */
        let mut result_pairs: Vec<AlmanacPair> = Vec::new();

        // 1. the overlapping dest pair
        result_pairs.push(dest_pair);

        if amc_pair.start < src_pair.start {
          // 2. the outside less-than pair
          result_pairs.push(AlmanacPair {
            start: amc_pair.start,
            end: src_pair.start,
          });
        }
        if amc_pair_end - 1 > src_pair_end - 1 {
          // 3. the outside greater-than pair
          result_pairs.push(AlmanacPair {
            start: src_pair.start,
            end: amc_pair_end,
          });
        }

        return result_pairs;
      }
    }
    // if no overlap, return original range
    vec![amc_pair.clone()]
  }

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

fn has_src_overlap(amc_pair: &AlmanacPair, amc_map: &AlmanacMap) -> bool {
  let amc_pair_end = amc_pair.start + amc_pair.end;
  let src_end = amc_map.src_start + amc_map.range_len;
  let does_overlap = (
    (amc_pair.start >= amc_map.src_start)
    && (amc_pair.start < src_end)
  )
  || (
    (amc_pair_end - 1 >= amc_map.src_start)
    && (amc_pair_end - 1 < src_end)
  );
  does_overlap
}

#[derive(Debug, Clone, Copy)]
pub struct AlmanacMap {
  pub dest_start: u64,
  pub src_start: u64,
  pub range_len: u64,
}
