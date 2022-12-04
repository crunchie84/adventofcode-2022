import { readFileSync } from "fs";

const input = readFileSync('./input.txt', 'utf-8');
// const input = `A Y
// B X
// C Z`;

// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.

const score = input.split('\n').reduce((acc, curr) => acc + calculateMatchScore(curr), 0);
console.log(`score = ${score}`);

const score2 = input.split('\n').reduce((acc, curr) => acc + calculateMatchScorePartTwo(curr), 0);
console.log(`score2 = ${score2}`);



function calculateMatchScorePartTwo(matchLine: string) {
    const [opponent, you] = matchLine.split(' ');
    const youNormalized = determineShapeToPlay(opponent, you);
    return scoreShapesOutcome(youNormalized, opponent) + scoreSelectedShape(youNormalized);
}

function determineShapeToPlay(opponent: string, desiredOutcome: string): string {
    switch(desiredOutcome) {
        case 'X': return shapeNeededToLose(opponent);
        case 'Z': return shapeNeededToWin(opponent);
        case 'Y': 
        default: 
          return opponent;
    }
}

function shapeNeededToWin(opponent: string) {
    switch(opponent) {
        case 'A': return 'B';
        case 'B': return 'C';
        case 'C': return 'A';
        default: throw new Error('wut');
    }
}

function shapeNeededToLose(opponent: string) {
    switch(opponent) {
        case 'A': return 'C';
        case 'B': return 'A'
        case 'C': return 'B';
        default: throw new Error('wut');
    }
}

function calculateMatchScore(matchLine: string) {
    const [opponent, you] = matchLine.split(' ');
    const youNormalized = you
        .replace('X','A')
        .replace('Y','B')
        .replace('Z','C');
    
    return scoreShapesOutcome(youNormalized, opponent) + scoreSelectedShape(youNormalized);
}

function scoreShapesOutcome(shapeYou: string, shapeOpponent: string): number {
    if (shapeYou === shapeOpponent) {
        return 3; // draw
    }
    // win
    // a = rock, b = paper, c = scisccor
    if (shapeYou === 'A' && shapeOpponent === 'C') return 6;
    if (shapeYou === 'B' && shapeOpponent === 'A') return 6;
    if (shapeYou === 'C' && shapeOpponent === 'B') return 6;

    return 0; // lose
}

function scoreSelectedShape(shape: string): number {
    switch(shape) {
        case 'A':return 1; 
        case 'B': return 2;
        case 'C': return 3;
        default: return 0;
    }
}
