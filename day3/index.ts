export function parseRange(range: string): Array<number> {
  return range.split('-').map(i => parseInt(i, 10));
}

export function hasCompleteOverlap(a: string, b: string) {
  const [aBegin, aEnd] = parseRange(a);
  const [bBegin, bEnd] = parseRange(b);

  return (aBegin <= bBegin && aEnd >= bEnd) /* case a overlaps b */
    || (bBegin <= aBegin && bEnd >= aEnd); /* case b overlaps a */
}