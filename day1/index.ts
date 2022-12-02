import { readFileSync } from "fs";

const input = readFileSync('./input.txt', 'utf-8');

const perElf = splitPuzzleInputPerElf(input);
const perElfNumbers = convertElfCaloriesToNumbers(perElf);
const totalCalPerElf = sumCaloriesPerElf(perElfNumbers);
const sortedByCalorie = sortDescending(totalCalPerElf);

// part 1
const maxCaloriesOneElf = sortedByCalorie[0];
console.log(`max calories = ${maxCaloriesOneElf}`);

// part 2
const totalCaloriesTopThreeElves = sum(sortedByCalorie.slice(0, 3));
console.log(`top three total cal = ${totalCaloriesTopThreeElves}`);

function splitPuzzleInputPerElf(input: string) : Array<string> {
    return input.split('\n\n');
}

function convertElfCaloriesToNumbers(input: Array<string>): Array<Array<number>> {
    return input.map(elf => elf.split('\n').map(i => parseInt(i, 10)));
}

function sumCaloriesPerElf(input: Array<Array<number>>): Array<number> {
    return input.map(elf => sum(elf));
}

function sortDescending(input: Array<number>): Array<number> {
    return input.sort((a, b) => b - a);
}

function sum(input: Array<number>): number {
    return input.reduce((acc, curr) => acc + curr, 0);
}