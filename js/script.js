/**
 * !Grid Match!
 * Sean Verba
 * 
 * Small 8x8 grid, flashes a picture made on the grid to the player, then asks them to recreate it as best as they can draw it from memory.
 * Compares how well they did based on what grid tiles they drew on, then gives a score.
 * If the player gets a score above a certain amount each round, they continue, if not, trigger game over leaderboard and ask them for a name so that their score gets added
 */

"use strict";

const grid = {
    columns: 8,
    rows: 8,
    squareW: null,
    squareH: null,
    offsetX: 200,
    offsetY: 300,
    fill: {
        r: 255,
        g: 255,
        b: 255
    }
}

// Setup runs code on start-up
function setup() {
    createCanvas(800, 800);
    background(255, 150, 170);
    grid.squareW = width / grid.columns / 2;
    grid.squareH = height / grid.rows / 2;
    drawGrid();
}

// Draw runs code every frame
function draw() {
    gridClickCheck();
}

function drawGrid() {
    // Let i equal 0, for every time i equals less than 8, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {
            // Number of i (squares) * squares width + offset
            let x = i * grid.squareW + grid.offsetX;
            let y = j * grid.squareH + grid.offsetY;
            push();
            stroke(0);
            fill(grid.fill.r, grid.fill.g, grid.fill.b);
            rect(x, y, grid.squareW, grid.squareH);
            pop();
        }
    }
}

function gridClickCheck() {
    if (mouseIsPressed) {
        // Adjusts mouse for grid offset before / by grid square sizes to find which cell the mouse is on
        let columnMouse = ((mouseX - grid.offsetX) / grid.squareW);
        let rowMouse = ((mouseY - grid.offsetY) / grid.squareH);
        // If columnMouse (The column that the mouse is on) is more or equal to 0 AND columnMouse is less than the number of columns
        // Then, if mouse is greater than or equal to offset AND mouse is less than or equal to offset + number of columns * cell size - basically is the mouse less than or equal to the offset + the grid
        if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH) {
            console.log(columnMouse, rowMouse);
        }
    }
}