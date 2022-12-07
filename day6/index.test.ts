import { readFileSync } from 'fs';

const puzzleInput = readFileSync('./input.txt', 'utf-8');

function uniqueCharsInChunk(input: string): Number {
    const uniqueChars = input
        .split('')
        .filter((c, idx) => input.indexOf(c) === idx) // only return first occurence in the chunk of the char
        .length;
    return uniqueChars;
}

function findStartOfPacketMarker(input: string): Number {
    let idx = 0;
    while ((idx + 4) < input.length){
        const chunk = input.substring(idx, idx + 4);
        //console.log(`idx=${idx}, chunk=${chunk}, uniqueChars=${uniqueCharsInChunk(chunk)}`);
        if (uniqueCharsInChunk(chunk) === 4) {
            return 4 + idx; // needs to return last char read as 'first char of data'
        }
        idx++;
    }
    return -1;
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

console.log(`day 6-1=${findStartOfPacketMarker(puzzleInput)}`);