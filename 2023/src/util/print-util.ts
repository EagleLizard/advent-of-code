
export function getDayDivider(repeatN?: number) {
  let repeatVal = repeatN ?? 10;
  return `${'🎄~'.repeat(repeatVal)}🎄`;
}

export function printDayBanner(dayNumber: number) {
  console.log(getDayBanner(dayNumber));
}

export function getDayBanner(dayNumber: number): string {
  return `~ Day ${dayNumber} ~`;
}
