
#[derive(PartialEq, Eq, Clone)]
pub enum GalaxyMapElKind {
  Space,
  Galaxy,
}

#[derive(Clone)]
pub struct GalaxyMapEl {
  kind: GalaxyMapElKind,
  x: u32,
  y: u32,
}

impl GalaxyMapEl {
  pub fn to_char(&self) -> char {
    match self.kind {
      GalaxyMapElKind::Space => '.',
      GalaxyMapElKind::Galaxy => '#',
      _ => unreachable!()
    }
  }
}


pub struct GalaxyMap {
  pub matrix: Vec<Vec<GalaxyMapEl>>
}
impl GalaxyMap {
  fn new() -> GalaxyMap {
    GalaxyMap {
      matrix: vec![],
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
    for (y, curr_row) in self.matrix.iter().enumerate() {
      expanded.matrix.push(curr_row.to_vec());
      if curr_row.iter().all(|el| el.kind == GalaxyMapElKind::Space) {
        expanded.matrix.push(curr_row.to_vec());
        println!("row: {}", y)
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
        expanded.matrix[y].insert(x, GalaxyMapEl {
          kind: GalaxyMapElKind::Space,
          x: u32::try_from(x).unwrap(),
          y: u32::try_from(y).unwrap(),
        });
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
      let curr_el = GalaxyMapEl {
        kind,
        x: u32::try_from(x).unwrap(),
        y: u32::try_from(y).unwrap(),
      };
      curr_row.push(curr_el);
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
