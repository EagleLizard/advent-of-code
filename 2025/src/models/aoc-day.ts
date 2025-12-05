
export type AocDayPartFn = {
  (inputLines: string[]): number | string;
};

export type AocDay = {
  file_name: string;
  part1?: AocDayPartFn;
  part2?: AocDayPartFn;
};
