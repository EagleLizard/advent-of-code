
export function getDayDivider(repeatN?: number) {
  let repeatVal = repeatN ?? 10;
  return `${'🎄~'.repeat(repeatVal)}🎄`;
}
