import { readFileSync } from 'fs';

const puzzleInput = readFileSync('./input.txt', 'utf-8');

function uniqueCharsInChunk(input: string): Number {
    const uniqueChars = input
        .split('')
        .filter((c, idx) => input.indexOf(c) === idx) // only return first occurence in the chunk of the char
        .length;
    return uniqueChars;
}

function _findIndexOfUniqueChars(input: string, uniqueCharsNeeded: number): number {
    let idx = 0;
    while ((idx + uniqueCharsNeeded) < input.length){
        const chunk = input.substring(idx, idx + uniqueCharsNeeded);
        //console.log(`idx=${idx}, chunk=${chunk}, uniqueChars=${uniqueCharsInChunk(chunk)}`);
        if (uniqueCharsInChunk(chunk) === uniqueCharsNeeded) {
            return uniqueCharsNeeded + idx; // needs to return last char read as 'first char of data'
        }
        idx++;
    }
    return -1;
}

function findStartOfPacketMarker(input: string): Number {
    return _findIndexOfUniqueChars(input, 4);
}

function findStartOfMessageMarker(input: string): Number {
    return _findIndexOfUniqueChars(input, 14);
}

test('counting unique chars in substring', () => {
    expect(uniqueCharsInChunk('aaaa')).toEqual(1);
    expect(uniqueCharsInChunk('abab')).toEqual(2);
    expect(uniqueCharsInChunk('abca')).toEqual(3);
    expect(uniqueCharsInChunk('abcd')).toEqual(4);
});

test('correct position of marker', () => {
    expect(findStartOfPacketMarker('bvwbjplbgvbhsrlpgdmjqwftvncz')).toEqual(5);
    expect(findStartOfPacketMarker('nppdvjthqldpwncqszvftbrmjlhg')).toEqual(6);
    expect(findStartOfPacketMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toEqual(10);
    expect(findStartOfPacketMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toEqual(11);
});

test('correct position of message part', () => {
    expect(findStartOfMessageMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).toEqual(19);
    expect(findStartOfMessageMarker('bvwbjplbgvbhsrlpgdmjqwftvncz')).toEqual(23);
    expect(findStartOfMessageMarker('nppdvjthqldpwncqszvftbrmjlhg')).toEqual(23);
    expect(findStartOfMessageMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toEqual(29);
    expect(findStartOfMessageMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toEqual(26);
});

console.log(`day 6-1=${findStartOfPacketMarker(puzzleInput)}`);
console.log(`day 6-2=${findStartOfMessageMarker(puzzleInput)}`);