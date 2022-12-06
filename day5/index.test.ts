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

type Stacks = Array<Array<string>>;

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

function createInvertedStacksArrayFromInput(initialStacksFromInput: Array<string>):Stacks {
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
        }, new Array<Array<string>>() as Stacks);
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
    // const stacksArray = newStacks();
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

//     function executeMove(move: string, currentStacks:Stacks):Stacks {
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


function executeMove(move: string, currentStacks:Stacks): Stacks {
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

function executeMultipleCratesAtOnceMove(move: string, currentStacks:Stacks): Stacks {
    const [ amountOfMovesToDo, from, to ] = move
        .split(' ')
        .map(i => parseInt(i, 10))
        .filter(i => !Number.isNaN(i));

    let movesExecuted = 0;
    const crates = new Array<string>();
    while (movesExecuted < amountOfMovesToDo) {
        const crate = currentStacks[from-1].pop();
        if (crate !== undefined) {
            crates.push(crate);
        }
        movesExecuted++;
    }
    currentStacks[to-1] = currentStacks[to-1].concat(crates.reverse());

    return currentStacks;
}


test('execute multi-move on inverted stackArray correctly', () => {
    const move = 'move 3 from 1 to 3';
    const input = [
        ['Z', 'N'],
        ['M', 'C', 'D'],
        ['P'],
    ];

    expect(executeMultipleCratesAtOnceMove(move, input)).toEqual([
        [],
        ['M', 'C', 'D', ],
        ['P', 'Z', 'N'],
    ])
});


function executeAllMoves(moveFnc: (move: string, currentStacks:Stacks) => Stacks, initialStacks:Stacks, moveCommands: Array<string>) :Stacks {
    return moveCommands.reduce((stacks, moveCommand) => {
        return moveFnc(moveCommand, stacks)
    }, initialStacks)
}

test('executes all moves from input with singlemover', () => {
    const stacksFromInput = extractStacksSetupFromInput(input);
    const moveCommandsFromInput = extractMoveCommandsFromInput(input);
    const finalStacks = executeAllMoves(executeMove, createInvertedStacksArrayFromInput(stacksFromInput), moveCommandsFromInput);

    expect(finalStacks).toEqual([
        ['C'],
        ['M'],
        ['P','D','N','Z']
    ]);
});

test('execute single multimove correctly', () => {
    expect(
        executeMultipleCratesAtOnceMove('move 1 from 2 to 1', [['Z','N'],['M','C','D'],['P']])
    ).toEqual([['Z', 'N', 'D' ], ['M', 'C'], ['P']]);

    expect(
        executeMultipleCratesAtOnceMove('move 5 from 2 to 1', [['Z','N'],['M','C','D'],['P']])
    ).toEqual([['Z', 'N', 'M','C','D' ], [], ['P']]);
});

test('executes all moves from input with multiMover', () => {
    const stacksFromInput = extractStacksSetupFromInput(input);
    const moveCommandsFromInput = extractMoveCommandsFromInput(input);

    const initial = createInvertedStacksArrayFromInput(stacksFromInput);
    expect(initial).toEqual([['Z','N'],['M','C','D'],['P']]);

    const afterMoveOne = executeMultipleCratesAtOnceMove('move 1 from 2 to 1', initial);
    expect(afterMoveOne).toEqual([['Z', 'N', 'D' ], ['M', 'C'], ['P']]);
    
    const afterMoveTwo = executeMultipleCratesAtOnceMove('move 3 from 1 to 3', afterMoveOne);
    expect(afterMoveTwo).toEqual([[], ['M','C'], ['P', 'Z', 'N', 'D']]);
    
    const afterMoveThree = executeMultipleCratesAtOnceMove('move 2 from 2 to 1', afterMoveTwo);
    expect(afterMoveThree).toEqual([['M','C'], [], ['P', 'Z', 'N', 'D']]);

    const afterMoveFour = executeMultipleCratesAtOnceMove('move 1 from 1 to 2', afterMoveThree);
    expect(afterMoveFour).toEqual([
        ['M'],
        ['C'],
        ['P','Z','N','D']
    ]);
});

function getTopCrates(input:Stacks) : string {
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

console.log(`total move commands: ${moveCommandsFromInput.length}`);

const finalStacks = executeAllMoves(executeMove, createInvertedStacksArrayFromInput(stacksFromInput), moveCommandsFromInput);
console.log(`day5-1: ${getTopCrates(finalStacks)}`)

// day 5-2
const finalStacksPart2 = executeAllMoves(executeMultipleCratesAtOnceMove, createInvertedStacksArrayFromInput(stacksFromInput), moveCommandsFromInput);
console.log(`day5-2: ${getTopCrates(finalStacksPart2)}`)

