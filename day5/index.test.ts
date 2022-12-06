import { readFileSync } from 'fs';

const puzzleInput = readFileSync('./input.txt', 'utf-8');
const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function createStackRowArray(input: string): Array<string> {
    return input.match(/.{1,4}/g) || [];
}

function cleanupStackRowArray(input: Array<string>): Array<string> {
    return input
        .map(i => i.replace(/[^A-Z]+/g, ''));
}


test('splits stack line into segments', () => {
    expect(createStackRowArray('    [D]    ')).toEqual(['    ', '[D] ', '   ']);
    expect(createStackRowArray('[N] [C]    ')).toEqual(['[N] ', '[C] ', '   ']);
    expect(createStackRowArray('[Z] [M] [P]')).toEqual(['[Z] ', '[M] ', '[P]']);
});

test('cleans up stack lines into crate designations', () => {
    expect(cleanupStackRowArray(['    ', '[D] ', '   '])).toEqual(['','D','']);
    expect(cleanupStackRowArray(['[N] ', '[C] ', '   '])).toEqual(['N','C','']);
    expect(cleanupStackRowArray(['[Z] ', '[M] ', '[P]'])).toEqual(['Z','M','P']);
});

function extractStacksSetupFromInput(input: string): Array<string> {
    const stacks = input.split('\n\n')[0].split('\n');
    stacks.pop();// remove the numbers line
    return stacks;
}

function extractMoveCommandsFromInput(input: string): Array<string> {
    return input.split('\n\n')[1].split('\n');
}

function createInvertedStacksArrayFromInput(initialStacksFromInput: Array<string>): Array<Array<string>> {
    // flip the array's because that is easier
    const newStacksArray = initialStacksFromInput
        .reverse() /* start with the bottom */
        .reduce((flippedStacksArray, currentRow) => {
            const rowArray = cleanupStackRowArray(
                createStackRowArray(currentRow)
            );
            rowArray.forEach((el, columnIndex) => {
                if (el !== '') {
                    if (flippedStacksArray[columnIndex] === undefined) {
                        flippedStacksArray[columnIndex] = new Array<string>();
                    }
                    flippedStacksArray[columnIndex].push(el);
                }
            });
            return flippedStacksArray;
        }, new Array<Array<string>>());
    return newStacksArray;
}

test('loads stacks from input', () => {
    const stacksFromInput = extractStacksSetupFromInput(input);
    const newStacksArray = createInvertedStacksArrayFromInput(stacksFromInput);
    expect(newStacksArray).toEqual([
        ['Z', 'N'],
        ['M', 'C', 'D'],
        ['P'],
    ])

    // this was horrible
    // const stacksArray = new Array<Array<String>>();
    // stacks
    //     .reverse() // start with the botttom
    //     .forEach((row, rowIndex) => {
    //         stacksArray[rowIndex] = new Array<string>();
    //         cleanupStackRowArray(
    //             createStackRowArray(row)
    //         )
    //         .forEach((crate, columnIndex) => {
    //             stacksArray[rowIndex][columnIndex] = crate;
    //         })
    //     });
    // expect(stacksArray).toEqual([
    //     ['Z','M','P'],
    //     ['N','C',''],
    //     ['','D',''],
    // ])
});

// test('executes moves on stacksArray correctly', () => {
//     const move = 'move 3 from 1 to 3';
//     const input = [
//         ['Z','M','P'],
//         ['N','C',''],
//         ['','D',''],
//     ];

//     function executeMove(move: string, currentStacks: Array<Array<string>>): Array<Array<string>> {
//         const { _, amountOfMovesToDo, _2, from, _3, to } = move.split(' ');

//         let movesDone = 0;
//         let currentHeight = currentStacks.length();
//         while (currentHeight > 0 && movesDone < amountOfMovesToDo) {
//             const crateToMove = currentStacks[currentHeight][from-1];
//             if (crateToMove !== '') {
//                 // we have a crate we can pick up
//                 currentStacks[currentHeight][to-1]
//             }


//             currentHeight--;
//         }
//     }

//     expect(executeMove(move, input)).toEqual([
//         ['','M','P'],
//         ['','C','Z'],
//         ['','D','N'],
//     ])
// });


function executeMove(move: string, currentStacks: Array<Array<string>>): Array<Array<string>> {
    const [ amountOfMovesToDo, from, to ] = move
        .split(' ')
        .map(i => parseInt(i, 10))
        .filter(i => !Number.isNaN(i));
    
    let movesExecuted = 0;
    while(movesExecuted < amountOfMovesToDo) {
        const crate = currentStacks[from-1].pop();
        if (crate !== undefined) {
            currentStacks[to-1].push(crate);
        }
        movesExecuted++;
    }
    return currentStacks;
}

test('execute move on inverted stackArray correctly', () => {
    const move = 'move 3 from 1 to 3';
    const input = [
        ['Z', 'N'],
        ['M', 'C', 'D'],
        ['P'],
    ];

    expect(executeMove(move, input)).toEqual([
        [],
        ['M', 'C', 'D', ],
        ['P', 'N', 'Z'],
    ])
});


function executeAllMoves(initialStacks: Array<Array<string>>, moveCommands: Array<string>) : Array<Array<string>> {
    return moveCommands.reduce((stacks, moveCommand) => {
        return executeMove(moveCommand, stacks)
    }, initialStacks)
}

test('executes all moves from input', () => {
    const stacksFromInput = extractStacksSetupFromInput(input);
    const moveCommandsFromInput = extractMoveCommandsFromInput(input);
    const finalStacks = executeAllMoves(createInvertedStacksArrayFromInput(stacksFromInput), moveCommandsFromInput);
    
    expect(finalStacks).toEqual([
        ['C'],
        ['M'],
        ['P','D','N','Z']
    ]);
});

function getTopCrates(input: Array<Array<string>>) : string {
    return input.reduce((acc, curr) => `${acc}${curr[curr.length-1]}`, '');
}

test('get topMostCrates from stacks', () => {
    expect(getTopCrates([
        ['C'],
        ['M'],
        ['P','D','N','Z']
    ])).toEqual('CMZ');
});


// day 5-1 solution
const stacksFromInput = extractStacksSetupFromInput(puzzleInput);
const moveCommandsFromInput = extractMoveCommandsFromInput(puzzleInput);
const finalStacks = executeAllMoves(createInvertedStacksArrayFromInput(stacksFromInput), moveCommandsFromInput);
console.log(`day5-1: ${getTopCrates(finalStacks)}`)