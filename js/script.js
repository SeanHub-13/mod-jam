/**
 * !Grid Match!
 * Sean Verba
 * 
 * Small 16x16 grid, flashes a picture made on the grid to the player, then asks them to recreate it as best as they can draw it from memory.
 * Compares how well they did based on what grid tiles they drew on, then gives a score.
 * If the player gets a score above a certain amount each round, they continue, if not, trigger game over leaderboard and ask them for a name so that their score gets added
 */

"use strict";

const grid = {
    columns: 8,
    rows: 8,
    squareW: null,
    squareH: null,
    fill: {
        r: 255,
        g: 255,
        b: 255
    }
}

// Setup runs code on start-up
function setup() {
    createCanvas(800, 800);
    grid.squareW = width / grid.columns / 2;
    grid.squareH = height / grid.rows / 2;
    drawGrid();
}

// Draw runs code every frame
function draw() {

}

function drawGrid() {
    // Let i equal 0, for every time i equals less than 8, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {
            let x = i * grid.squareW;
            let y = j * grid.squareH;
            push();
            stroke(0);
            fill(grid.fill.r, grid.fill.g, grid.fill.b);
            rect(x, y, grid.squareW, grid.squareH);
            pop();
        }
    }
}