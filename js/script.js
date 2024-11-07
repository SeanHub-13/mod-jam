/**
 * !Grid Match!
 * Sean Verba
 * 
 * Small 8x8 grid, flashes a picture made on the grid to the player, then asks them to recreate it as best as they can draw it from memory.
 * Compares how well they did based on what grid tiles they drew on, then gives a score.
 * If the player gets a score above a certain amount each round, they continue, if not, trigger game over leaderboard and ask them for a name so that their score gets added
 */

"use strict";

let buttonImage = undefined;
let buttonPressedImage = undefined;
let font = undefined;

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

let playButton = {
    width: 192,
    height: 72,
    fill: {
        r: 0,
        g: 0,
        b: 0
    }
}

// Array later made into a 2d array to represent cells in the grid
let gridArray = [];
let gridCompare = null;

// State variable, currently set to titlescreen on launch
let state = "titlescreen";

// Boolean variable sets whether the player can edit the grid
let editState = false;

let timer = 0;

let selectedEasy = null;

let stateLevel = "one";

let score = 0;
let oldScore = 0;

let scoreRequired = 5;

function preload() {
    buttonImage = loadImage('assets/images/Mod_Jam_Button_1.png');
    buttonPressedImage = loadImage('assets/images/Mod_Jam_Button_2.png');
    font = loadFont('assets/fonts/PressStart2P-Regular.ttf');
}

// Setup runs code on start-up
function setup() {
    createCanvas(800, 800);
    textFont(font);
    textAlign(CENTER, CENTER);
    grid.squareW = width / grid.columns / 2;
    grid.squareH = height / grid.rows / 2;
    gridReset();
    // Line of code taken from user Zuul on stack overflow - more info in README
    // From what I can understand, this adds an event handler to the canvas that is triggered on right click and stops the context menu from appearing
    canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }
    setInterval(timerUpdate, 1000);
}

// Draw runs code every frame
function draw() {
    background(255, 150, 170);
    gridClickCheck();
    stateChange();
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
        // Then, if mouse is greater than or equal to offset AND mouse is less than or equal to offset + number of columns * cell size - basically is the mouse less than or equal to the offset + the grid AND the player can edit
        if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH && editState === true) {
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
            // drawGrid();
        }
    }
}

function drawPlayButton() {
    // width & height is calculated like this because I want the button to be truly centered, and the image is 192 x 72
    image(buttonImage, width / 2 - playButton.width / 2, height / 1.2 - playButton.height / 2, playButton.width, playButton.height);
    fill(playButton.fill.r, playButton.fill.g, playButton.fill.b);
    textSize(12);
    text("PLAY", width / 2, height / 1.2);
}

function drawPressedPlayButton() {
    // width & height is calculated like this because I want the button to be truly centered, and the image is 192 x 72
    image(buttonPressedImage, width / 2 - playButton.width / 2, height / 1.2 - playButton.height / 2, playButton.width, playButton.height);
    fill(playButton.fill.r, playButton.fill.g, playButton.fill.b);
    textSize(12);
    text("PLAY", width / 2, height / 1.2);
}

function titleScreenText() {
    textSize(48);
    fill(255, 255, 255);
    text("|          |", width / 2, height / 6);
    text("|GRID MATCH|", width / 2, height / 4);
    text("|__________|", width / 2, height / 3);
}

function titleExplanationText() {
    textSize(18);
    fill(255, 255, 255);
    text("The game will quickly show you a pattern,\n match the pattern as close as possible \n before the timer runs out!\n\n Meet the required score to continue. \n\n  Left Click: Draw \n\n Right Click: Erase", width / 2, height / 2.7 + height / 5);
}

function timerDisplay() {
    textSize(56);
    let textShake = map(timer, 0, 10, 255, 0);
    fill(textShake, 0, 0);
    let shakeEffect = random(-1, 1);
    text(timer, width / 2 - shakeEffect, height / 5);
}

function scoreDisplay() {
    textSize(34);
    fill(255, 255, 255);
    text(" Score:\n" + score, width / 4, height / 8);
}

function requirmentDisplay() {
    textSize(34);
    fill(255, 255, 255);
    text("Need:\n" + scoreRequired + " ", width / 2 + width / 4, height / 8);
}

function leaderboardText() {
    textSize(32);
    fill(255, 255, 255);
    text("LEADERBOARD\n___________", width / 2, height / 8);
    text("1:\n2:\n3:\n4:\n5:\n6:\n7:\n8:\n9:\n10:", width / 3, height / 2.2);
}

function playButtonInput() {
    // If the mouse is between these values then
    if ((mouseX > width / 2 - playButton.width / 2) &&
        (mouseX < width / 2 + playButton.width / 2) &&
        (mouseY > height / 1.2 - playButton.height / 2) &&
        (mouseY < height / 1.2 + playButton.height / 2)) {
        //If mouse hovers over the button, draw the pressed version
        drawPressedPlayButton();
        playButton.fill.r = 255;
        playButton.fill.g = 255;
        playButton.fill.b = 255;
        //Checks if the button is left clicked
        if (mouseIsPressed) {
            scoreReset();
            timerReset();
            state = "game";
        }
    }
    else {
        playButton.fill.r = 0;
        playButton.fill.g = 0;
        playButton.fill.b = 0;
    }
}

function timerUpdate() {
    timer--;
}

function nextStage() {
    if (timer <= 0) {
        // If the state of the level is level one display
        if (stateLevel === "one") {
            console.log("Score Required: " + scoreRequired);
            if (gridCompare != null) {
                cellCompare();
                if (score < scoreRequired) {
                    console.log("You Lost!!!")
                    state = "end";
                }
                else {
                    scoreRequired = scoreRequired + 5;
                    console.log("New Score Required: " + scoreRequired);
                }
            }
            console.log(score);
            oldScore = structuredClone(score);
            // Set the timer to 10
            timer = 5;
            // Set the editing boolean to false
            editState = false;
            // Choose how many cells to fill
            selectedEasy = Math.floor(random(5, 15));
            // Reset the grid, create a pattern on gridArray, copy it onto gridCompare
            levelOne();
            // Change the state of the level to one draw
            stateLevel = "onedraw";
        }
        // If the state of the level is level one draw
        else if (stateLevel === "onedraw") {
            gridReset();

            editState = true;
            timer = 10;
            stateLevel = "one";
        }
    }
}

function levelOne() {
    gridReset();
    for (let k = 0; k < selectedEasy; k++) {
        let randomColumn = Math.floor(random(0, grid.columns - 1));
        let randomRow = Math.floor(random(0, grid.rows - 1));
        gridArray[randomColumn][randomRow] = true;
    }
    // GridCompare is equal to gridArrays rows
    // Had to do this because it makes gridCompare a copy of the array instead of making it constantly refer to gridArray, meaning it would always match
    gridCompare = gridArray.map(row => row.slice());
}

function gridReset() {
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
}

function scoreReset() {
    score = 0;
    oldScore = 0;
}

function timerReset() {
    timer = 0;
}

function cellCompare() {
    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {
            if (gridArray[i][j] === true && gridCompare[i][j] === true) {
                console.log("true");
                score++;
            }
            else if (gridArray[i][j] === true && gridCompare[i][j] !== true) {
                console.log("false");
                score = score - 2;
            }
        }
    }
}

function cheatCheck() {
    if (score - oldScore > 15) {
        score = 0;
    }
}

function stateChange() {
    //Checks what state the game is supposed to be in and changes it
    if (state === "titlescreen") {
        titleScreen();
    }
    else if (state === "game") {
        game();
    }
    else if (state === "end") {
        end();
    }
}

//Displays all title screen related functions
function titleScreen() {
    titleScreenText();
    drawPlayButton();
    playButtonInput();
    titleExplanationText();
}

function game() {
    drawGrid();
    gridClickCheck();
    timerDisplay();
    scoreDisplay();
    requirmentDisplay();
    nextStage();
    cheatCheck();
}

function end() {
    drawPlayButton();
    playButtonInput();
    leaderboardText();
    cheatCheck();
}