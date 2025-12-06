
export type AocDayPartFn = {
  (inputLines: string[]): number | string;
};

export type AocDayDef = {
  file_name: string;
  part1?: AocDayPartFn;
  part2?: AocDayPartFn;
};
