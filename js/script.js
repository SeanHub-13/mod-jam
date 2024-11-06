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
    fillFalse: {
        r: 255,
        g: 255,
        b: 255
    },
    fillTrue: {
        r: 50,
        g: 225,
        b: 50
    }
}

let gridArray = [];

// Setup runs code on start-up
function setup() {
    createCanvas(800, 800);
    background(255, 150, 170);
    grid.squareW = width / grid.columns / 2;
    grid.squareH = height / grid.rows / 2;
    // Let i equal 0, for every time i equals less than 8, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        // Basically creates 8 arrays (8 because of the amount of columns)
        gridArray[i] = [];
        for (let j = 0; j < grid.rows; j++) {
            // Creates 8 variables (rows) inside each of the 8 arrays (columns) and then sets them all to false
            // This sucked, screw 2d arrays, thank god for youtube explanations on this crap.
            gridArray[i][j] = false;
        }
    }
    drawGrid();
    // Line of code taken from user Zuul on stack overflow - more info in README
    // From what I can understand, this adds an event handler to the canvas that is triggered on right click and stops the context menu from appearing
    canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }
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
            // If a variable in one of the arrays is true, make its corresponding cell the "true" color
            if (gridArray[i][j] === true) {
                fill(grid.fillTrue.r, grid.fillTrue.g, grid.fillTrue.b);
            }
            // If it is false, make its corresponding cell the "false" color
            else {
                fill(grid.fillFalse.r, grid.fillFalse.g, grid.fillFalse.b);
            }
            push();
            stroke(0);
            rect(x, y, grid.squareW, grid.squareH);
            pop();
        }
    }
}

// Checks if and where the mouse clicked on the grid
function gridClickCheck() {
    // If mouse is pressed
    if (mouseIsPressed) {
        // Adjusts mouse for grid offset before / by grid square sizes to find which cell the mouse is on
        let columnMouse = Math.floor((mouseX - grid.offsetX) / grid.squareW);
        let rowMouse = Math.floor((mouseY - grid.offsetY) / grid.squareH);
        // If columnMouse (The column that the mouse is on) is more or equal to 0 AND columnMouse is less than the number of columns
        // Then, if mouse is greater than or equal to offset AND mouse is less than or equal to offset + number of columns * cell size - basically is the mouse less than or equal to the offset + the grid
        if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH) {
            // console.log(columnMouse + 1, rowMouse + 1);
            // If mouse button that was pressed is left
            if (mouseButton === LEFT) {
                // Sets the state of the clicked boolean to true
                gridArray[columnMouse][rowMouse] = true;
            }
            // If mouse button that was pressed is right
            else if (mouseButton === RIGHT) {
                // Sets the state of the clicked boolean to true
                gridArray[columnMouse][rowMouse] = false;
            }
            drawGrid();
        }
    }
}