use std::sync::atomic::{AtomicU32, Ordering};


#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash)]
pub enum GalaxyMapElKind {
  Space,
  Galaxy,
}

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
pub struct GalaxyMapEl {
  pub id: Option<u32>,
  pub kind: GalaxyMapElKind,
  pub x: u32,
  pub y: u32,
}

static ID_COUNTER: AtomicU32 = AtomicU32::new(1);

impl GalaxyMapEl {
  
  fn new(kind: GalaxyMapElKind, x: u32, y: u32) -> GalaxyMapEl {
    let id: Option<u32>;
    id = match kind {
      GalaxyMapElKind::Galaxy => {
        Some(ID_COUNTER.fetch_add(1, Ordering::Relaxed))
      }
      GalaxyMapElKind::Space => None
    };
    GalaxyMapEl { id, kind, x, y }
  }

  pub fn to_char(&self) -> char {
    match self.kind {
      GalaxyMapElKind::Space => '.',
      GalaxyMapElKind::Galaxy => '#',
      _ => unreachable!()
    }
  }
}

#[derive(Clone)]
pub struct GalaxyMap {
  pub matrix: Vec<Vec<GalaxyMapEl>>,
  pub galaxies: Vec<GalaxyMapEl>,
  pub expanded_rows: Vec<u32>,
  pub expanded_cols: Vec<u32>,
}
impl GalaxyMap {
  fn new() -> GalaxyMap {
    GalaxyMap {
      matrix: vec![],
      galaxies: Vec::new(),
      expanded_cols: Vec::new(),
      expanded_rows: Vec::new(),
    }
  }
  pub fn parse(input_lines: &Vec<String>) -> GalaxyMap {
    parse_galaxy_map(input_lines)
  }
  pub fn expand(&mut self, factor: u32) {
    let expand_by = factor - 1;
    /*
      to expand the rows:
        1. find each column that requires exapnsion
        2. find all galaxies to the right of column
        3. update each galaxy's x val to the size of
          the expansion
      to expand the cols:
        1. find each row that requires exapnsion
        2. find all galaxies below the row (y is inverted)
        3. update each galaxy's y val to the size of
          the expansion
    */
    for &expanded_col in self.expanded_cols.iter().rev() {
      for galaxy in &mut self.galaxies {
        if galaxy.x > expanded_col {
          galaxy.x += expand_by;
        }
      }
    }
    for &expanded_row in self.expanded_rows.iter().rev() {
      for galaxy in &mut self.galaxies {
        if galaxy.y > expanded_row {
          galaxy.y += expand_by;
        }
      }
    }
  }
}

/* Static Method */
fn parse_galaxy_map(input_lines: &Vec<String>) -> GalaxyMap {
  let mut galaxy_map = GalaxyMap::new();
  let mut expanded_cols: Vec<u32> = vec![];
  let mut expanded_rows: Vec<u32> = vec![];
  
  for (y, input_line) in input_lines.iter().enumerate() {
    let mut curr_row: Vec<GalaxyMapEl> = vec![];
    for (x, curr_char) in input_line.chars().enumerate() {
      let kind = get_map_el_kind(curr_char);
      let curr_el = GalaxyMapEl::new(
        kind,
        u32::try_from(x).unwrap(),
        u32::try_from(y).unwrap(),
      );
      curr_row.push(curr_el);
      if kind == GalaxyMapElKind::Galaxy {
        galaxy_map.galaxies.push(curr_el);
      }
    }
    galaxy_map.matrix.push(curr_row);
  }

  for y in 0..galaxy_map.matrix.len() {
    let mut row_is_spaces = true;
    for x in 0..galaxy_map.matrix.len() {
      if galaxy_map.matrix[y][x].kind != GalaxyMapElKind::Space {
        row_is_spaces = false;
        break;
      }
    }
    if row_is_spaces {
      expanded_rows.push(u32::try_from(y).unwrap());
    }
  }
  galaxy_map.expanded_rows = expanded_rows;

  for x in 0..galaxy_map.matrix[0].len() {
    let mut col_is_spaces = true;
    for y in 0..galaxy_map.matrix.len() {
      if galaxy_map.matrix[y][x].kind != GalaxyMapElKind::Space {
        col_is_spaces = false;
        break;
      }
    }
    if col_is_spaces {
      expanded_cols.push(u32::try_from(x).unwrap());
    }
  }
  galaxy_map.expanded_cols = expanded_cols;

  galaxy_map
}



fn get_map_el_kind(c: char) -> GalaxyMapElKind {
  return match c {
      '.' => GalaxyMapElKind::Space,
      '#' => GalaxyMapElKind::Galaxy,
      _ => panic!("Invalid map char: '{}'", c),
  }
}
