use std::{sync::atomic::{AtomicU32, Ordering}, collections::HashSet};


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
    GalaxyMapEl {
      id,
      kind,
      x,
      y
    }
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
  pub galaxies: HashSet<GalaxyMapEl>,
}
impl GalaxyMap {
  fn new() -> GalaxyMap {
    GalaxyMap {
      matrix: vec![],
      galaxies: HashSet::new(),
    }
  }
  pub fn parse(input_lines: Vec<String>) -> GalaxyMap {
    parse_galaxy_map(input_lines)
  }
  pub fn expand(&self) -> GalaxyMap {
    let mut expanded = GalaxyMap::new();
    let mut row_inserts: Vec<usize> = vec![];
    let mut col_inserts: Vec<usize> = vec![];
    // find rows to expand
    for (_, curr_row) in self.matrix.iter().enumerate() {
      expanded.matrix.push(curr_row.to_vec());
      if curr_row.iter().all(|el| el.kind == GalaxyMapElKind::Space) {
        expanded.matrix.push(curr_row.to_vec());
      }
    }
    // find cols to expand
    for x in 0..self.matrix[0].len() {
      let mut col_is_all_spaces = true;
      for y in 0..self.matrix.len() {
        if self.matrix[y][x].kind != GalaxyMapElKind::Space {
          col_is_all_spaces = false;
          break;
        }
      }
      if col_is_all_spaces {
        col_inserts.push(x);
      }
    }
    col_inserts.reverse();
    for x in col_inserts {
      for y in 0..expanded.matrix.len() {
        let expanded_el = GalaxyMapEl::new(
          GalaxyMapElKind::Space,
          u32::try_from(x).unwrap(),
          u32::try_from(y).unwrap(),
        );
        expanded.matrix[y].insert(x, expanded_el);
      }
    }
    // re-set x,y coords & galaxies
    for (y, curr_row) in expanded.matrix.iter_mut().enumerate() {
      for (x, curr_el) in curr_row.iter_mut().enumerate() {
        curr_el.x = u32::try_from(x).unwrap();
        curr_el.y = u32::try_from(y).unwrap();
        if(curr_el.kind == GalaxyMapElKind::Galaxy) {
          expanded.galaxies.insert(*curr_el);
        }
      }
    }
    expanded
  }
}

/* Static Method */
fn parse_galaxy_map(input_lines: Vec<String>) -> GalaxyMap {
  let mut galaxy_map = GalaxyMap::new();
  
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
        galaxy_map.galaxies.insert(curr_el);
      }
    }
    galaxy_map.matrix.push(curr_row);
  }

  galaxy_map
}



fn get_map_el_kind(c: char) -> (GalaxyMapElKind) {
  return match c {
      '.' => GalaxyMapElKind::Space,
      '#' => GalaxyMapElKind::Galaxy,
      _ => panic!("Invalid map char: '{}'", c),
  }
}
