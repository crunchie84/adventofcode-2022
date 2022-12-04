import { readFileSync } from 'fs';

console.log('overlapping ranges', numberOfOverlappingPairs(readFileSync('./input.txt', 'utf-8').split('\n')));

function numberOfOverlappingPairs(input: Array<string>): number {
    return input.reduce((acc, curr) => {
        const [a, b] = parseInputLineToPairOfRangeStrings(curr);
        if (hasCompleteOverlap(a, b)) {
            acc++;
        }
        return acc;
    }, 0);
}

function parseInputLineToPairOfRangeStrings(input: string): Array<string> {
    return input.split(',');
}

function parseRange(range: string): Array<number> {
    return range.split('-').map(i => parseInt(i, 10));
}

function hasCompleteOverlap(a: string, b: string) {
    const [aBegin, aEnd] = parseRange(a);
    const [bBegin, bEnd] = parseRange(b);

    return (aBegin <= bBegin && aEnd >= bEnd) /* case a overlaps b */
        || (bBegin <= aBegin && bEnd >= aEnd); /* case b overlaps a */
}

test('Parses range', () => {
    expect(parseRange('2-8')).toEqual([2,8]);
});

test('Ranges overlap', () => {
    expect(hasCompleteOverlap('2-8', '3-7')).toBeTruthy();
    expect(hasCompleteOverlap('3-7', '2-8')).toBeTruthy();
    expect(hasCompleteOverlap('3-7', '1-3')).toBeFalsy();
});

test('Number of ranges overlapping', () => {
    expect(numberOfOverlappingPairs(['2-8,3-7'])).toEqual(1);
    expect(numberOfOverlappingPairs(['2-8,3-7', '1-4,5-6'])).toEqual(1);
    expect(numberOfOverlappingPairs(['2-8,3-7', '2-8,3-7'])).toEqual(2);
    expect(numberOfOverlappingPairs([])).toEqual(0);
});