import { readFileSync } from "fs";

const input = readFileSync('./input.txt', 'utf-8');
// const input = `A Y
// B X
// C Z`;

const score = input.split('\n').reduce((acc, curr) => acc + calculateMatchScore(curr), 0);
console.log(`score = ${score}`);

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
