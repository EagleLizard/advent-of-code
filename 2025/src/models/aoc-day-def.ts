
export type AocDayPartFn = {
  (inputLines: string[]): number | string;
};

export type AocDayDef = {
  dayNum: number | string;
  file_name: string;
  part1?: AocDayPartFn;
  part2?: AocDayPartFn;
};
