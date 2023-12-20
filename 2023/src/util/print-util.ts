
export function printDayBanner(dayNumber: number) {
  console.log(getDayBanner(dayNumber));
}

export function getDayBanner(dayNumber: number): string {
  return `~ Day ${dayNumber} ~`;
}
