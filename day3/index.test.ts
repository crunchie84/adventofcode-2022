import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8');
// const input = `vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw`;

test('split correctly', () => {
    expect(splitCompartiments('vJrwpWtwJgWrhcsFMMfFFhFp')).toEqual(['vJrwpWtwJgWr', 'hcsFMMfFFhFp'])
});
test('items in both Compartiments', () => {
    expect(itemsInBothCompartiments('vJrwpWtwJgWr', 'hcsFMMfFFhFp')).toEqual(['p']);
    expect(itemsInBothCompartiments('jqHRNqRjqzjGDLGL', 'rsFMfFZSrLrFZsSL')).toEqual(['L']);
});

const puzzlePartTwoValue = groupPerThreeElves(
        input.split('\n')
            .map(compartiments => itemsInBothCompartiments(compartiments[0], compartiments[1]))
    )
    .map(groupOfElves => groupOfElves)
    
// for every group, find which letters are matchingover all elves

// .map(line => splitCompartiments(line))
// .map(compartiments => itemsInBothCompartiments(compartiments[0], compartiments[1]))
// .flat()
// .map(itemsInBothCompartiments => valueOfItem(itemsInBothCompartiments))
// .reduce((acc,curr) => acc+curr, 0);


function groupPerThreeElves(items: Array<T>, amountPerBucket): Array<Array<T>> {
    return items.reduce((acc, curr, currIdx) => {
        const bucketIndex = math.floor(currIdx / amountPerBucket);
        if(acc[bucketIndex] === undefined) {
            acc[bucketindex] = new Array<T>();
        }
        acc[bucketIndex].push(curr);
        return acc;
    }, new Array<Array<T>>())
}

const puzzlePartOneValue = input
    .split('\n')
    .map(line => splitCompartiments(line))
    .map(compartiments => itemsInBothCompartiments(compartiments[0], compartiments[1]))
    .flat()
    .map(itemsInBothCompartiments => valueOfItem(itemsInBothCompartiments))
    .reduce((acc,curr) => acc+curr, 0);

console.log('total value = ', puzzlePartOneValue);

function splitCompartiments(bag: string): Array<string> {
    const middle = Math.round(bag.length / 2)
    return [bag.substring(0, middle), bag.substring(middle)];
}

function itemsInBothCompartiments(compartimentOne: string, compartimentTwo: string): Array<string> {
    return unique(compartimentOne
        .split('')
        .filter(char => compartimentTwo.indexOf(char) > -1));
}

function unique<T>(input: Array<T>): Array<T> {
    return input.reduce((acc, curr) => { 
            if (acc.indexOf(curr) === -1) {
                acc.push(curr);
            }
            return acc;
        },
        new Array<T>()
    );
}

function valueOfItem(item: string) {
    const valueMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return 1 + valueMap.indexOf(item);
}

