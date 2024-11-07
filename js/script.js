/**
 * !Grid Match!
 * Sean Verba
 * 
 * Controls:
 * - Left click to draw
 * - Right click to erase
 * 
 * Small 6 x 6 grid, flashes a pattern made on the grid to the player, then asks them to recreate it as best as they can draw it from memory.
 * Compares how well they did based on what grid tiles they drew on, then gives a score.
 * If the player gets a score above a certain amount each round, they continue, if not, triggers game over and displays their score.
 * When the player wins a round, decreases drawing time by 2 down to a minimum of 4.
 * If the player wins 3 rounds (up to 12) increases grid columns and rows by 2.
 * 
 * Uses:
 * 
 * p5.js
 * https://p5js.org
 * 
 * Firebase
 * https://firebase.google.com/
 * 
 */

"use strict";

// Next few variables are all undefined variables in preperation for the preload function
let beepOne = undefined;
let beepTwo = undefined;
let beepThree = undefined;
let beepFour = undefined;
let beepFive = undefined;
let cheater = undefined;
let gameOver = undefined;
let greatJob = undefined;
let buttonImage = undefined;
let buttonPressedImage = undefined;
let font = undefined;
let alarm = undefined;

// Grid defining variables
const grid = {
    columns: 6,
    rows: 6,
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

// Background color variables
const backgroundColor = {
    fill: {
        r: 255,
        g: 150,
        b: 170
    }
}

// Play button variables
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

// Later becomes a deep copy of gridArray
let gridCompare = null;

// State variable, currently set to titlescreen on launch
let state = "titlescreen";

// Boolean variable sets whether the player can edit the grid
let editState = false;

// Timer variable
let timer = 0;

// Timers starting time
let timerOne = 16;

// Later represents the selected amount of grid blocks to make green
let selectedEasy = null;

// State of the level
let stateLevel = "one";

// Score variable
let score = 0;

// Variable that becomes a deep copy of score later
let oldScore = 0;

// Score requirement
let scoreRequired = 5;

// Later becomes a shake effect value
let shakeEffect = null;

// Amount of wins
let wins = 0;

// Later holds the picked beep sound
let beepPick = null;

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

/**
 * Sounds were loading late the first time they were played, and I couldn't figure out why
 * This workaround plays them at 0 volume upon pressing the play button to "warm them up"
 */
function warmUpSounds() {
    // Playing sounds at 0 volume
    beepOne.play(0, 1, 0, 0, 0.1);
    beepTwo.play(0, 1, 0, 0, 0.1);
    beepThree.play(0, 1, 0, 0, 0.1);
    beepFour.play(0, 1, 0, 0, 0.1);
    beepFive.play(0, 1, 0, 0, 0.1);
    cheater.play(0, 1, 0, 0, 0.1);
    gameOver.play(0, 1, 0, 0, 0.1);
    greatJob.play(0, 1, 0, 0, 0.1);
}

/**
 * A function that preloads all the assets used
 */
function preload() {
    // Variables finding files
    beepOne = loadSound('assets/sounds/beep1.mp3');
    beepTwo = loadSound('assets/sounds/beep2.mp3');
    beepThree = loadSound('assets/sounds/beep3.mp3');
    beepFour = loadSound('assets/sounds/boop1.mp3');
    beepFive = loadSound('assets/sounds/boop2.mp3');
    cheater = loadSound('assets/sounds/CHEATER.mp3');
    gameOver = loadSound('assets/sounds/gameover.mp3');
    greatJob = loadSound('assets/sounds/greatjob.mp3');
    alarm = loadSound('assets/sounds/alarm.wav');
    buttonImage = loadImage('assets/images/Mod_Jam_Button_1.png');
    buttonPressedImage = loadImage('assets/images/Mod_Jam_Button_2.png');
    font = loadFont('assets/fonts/PressStart2P-Regular.ttf');
}

/**
 * Setup runs code on start-up
 */
function setup() {
    // Creates the canvas
    createCanvas(800, 800);
    // Sets font
    textFont(font);
    // Centers text alignment
    textAlign(CENTER, CENTER);
    calculateGridSize()
    gridReset();
    // Line of code taken from user Zuul on stack overflow - more info in README
    // From what I can understand, this adds an event handler to the canvas that is triggered on right click and stops the context menu from appearing
    canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }
    // Sets an interval to trigger timer update
    setInterval(timerUpdate, 1000);
}

/**
 * Draw runs code every frame
 */
function draw() {
    // Changes background color
    background(backgroundColor.fill.r, backgroundColor.fill.g, backgroundColor.fill.b);
    gridClickCheck();
    stateChange();
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

/**
 * Draws the grid
 */
function drawGrid() {
    // Let i equal 0, for every time i equals less than 8, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        for (let j = 0; j < grid.rows; j++) {
            // Number of i (squares) * squares width + offset
            let x = i * grid.squareW + grid.offsetX;
            let y = j * grid.squareH + grid.offsetY;
            // If a variable in one of the arrays is true
            if (gridArray[i][j] === true) {
                // Make its corresponding cell the "true" color
                fill(grid.fillTrue.r, grid.fillTrue.g, grid.fillTrue.b);
            }
            // If it is false
            else {
                // Make its corresponding cell the "false" color
                fill(grid.fillFalse.r, grid.fillFalse.g, grid.fillFalse.b);
            }
            push();
            stroke(backgroundColor.fill.r, backgroundColor.fill.g, backgroundColor.fill.b);
            rect(x, y, grid.squareW, grid.squareH);
            pop();
        }
    }
}

/**
 * Draws the normal play button
 */
function drawPlayButton() {
    image(buttonImage, width / 2 - playButton.width / 2, height / 1.2 - playButton.height / 2, playButton.width, playButton.height);
    fill(playButton.fill.r, playButton.fill.g, playButton.fill.b);
    textSize(12);
    text("PLAY", width / 2, height / 1.2);
}

/**
 * Draws the pressed play button
 */
function drawPressedPlayButton() {
    image(buttonPressedImage, width / 2 - playButton.width / 2, height / 1.2 - playButton.height / 2, playButton.width, playButton.height);
    fill(playButton.fill.r, playButton.fill.g, playButton.fill.b);
    textSize(12);
    text("PLAY", width / 2, height / 1.2);
}

/**
 * Draws title screen text
 */
function titleScreenText() {
    textSize(48);
    fill(255, 255, 255);
    text("|          |", width / 2, height / 6);
    text("|GRID MATCH|", width / 2, height / 4);
    text("|__________|", width / 2, height / 3);
}

/**
 * Draws title screen explanation text
 */
function titleExplanationText() {
    textSize(18);
    fill(255, 255, 255);
    text("The game will quickly show you a pattern,\n match the pattern as close as possible \n before the timer runs out!\n\n Meet the required score to continue. \n\n  Left Click: Draw \n\n Right Click: Erase", width / 2, height / 2.7 + height / 5);
}

/**
 * Draws timer
 */
function drawTimer() {
    textSize(56);
    // Map the timer value to a red color
    let textColor = map(timer, 0, 10, 255, 0);
    fill(textColor, 0, 0);
    // Control the shake effect based on the timer value
    if (timer > 10) {
        shakeEffect = 0;
    }
    else if (timer > 5) {
        shakeEffect = random(-2, 2);
    }
    else {
        shakeEffect = random(-3, 3);
    }
    text(timer, width / 2 - shakeEffect, height / 4);
}

/**
 * Draws score
 */
function drawScore() {
    textSize(34);
    fill(255, 255, 255);
    text(" Score:\n" + score, width / 4, height / 8);
}

/**
 * Draws score requirement
 */
function drawRequirement() {
    textSize(34);
    fill(255, 255, 255);
    text("Need:\n" + scoreRequired + " ", width / 2 + width / 4, height / 8);
}

/**
 * Draws game over text and final score
 */
function gameOverText() {
    textSize(32);
    fill(255, 255, 255);
    text("GAME OVER\n___________", width / 2, height / 8);
    text("Final Score", width / 2, height / 4);
    textSize(82);
    // Maps the scores value to how yellow it becomes
    let scoreColor = map(score, 0, 50, 0, 255);
    fill(scoreColor, scoreColor, 0);
    text(score, width / 2, height / 2);
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

/**
 * Checks if and where the mouse clicked on the grid
 */
function gridClickCheck() {
    // If mouse is pressed
    if (mouseIsPressed) {
        // Adjusts mouse for grid offset before / by grid square sizes to find which cell the mouse is on
        let columnMouse = Math.floor((mouseX - grid.offsetX) / grid.squareW);
        let rowMouse = Math.floor((mouseY - grid.offsetY) / grid.squareH);
        // If columnMouse (The column that the mouse is on) is more or equal to 0 AND columnMouse is less than the number of columns
        // Then, if mouse is greater than or equal to offset AND mouse is less than or equal to offset + number of columns * cell size - basically is the mouse less than or equal to the offset + the grid AND the player can edit
        if (columnMouse >= 0 && columnMouse < grid.columns && rowMouse >= 0 && rowMouse < grid.rows && mouseX >= grid.offsetX && mouseX <= grid.offsetX + grid.columns * grid.squareW && mouseY >= grid.offsetY && mouseY <= grid.offsetY + grid.rows * grid.squareH && editState === true) {
            // If mouse button that was pressed is left
            if (mouseButton === LEFT) {
                // Sets the state of the clicked cells boolean to true
                gridArray[columnMouse][rowMouse] = true;
                // Picks the beep sound randomely
                beepPick = Math.floor(random(1, 10));
                // If none of the sounds are playing, play the one picked
                if (!beepOne.isPlaying() && !beepTwo.isPlaying() && !beepThree.isPlaying() && !beepFour.isPlaying() && !beepFive.isPlaying()) {
                    if (beepPick === 1) {
                        beepOne.setVolume(0.25);
                        beepOne.play();
                    }
                    else if (beepPick === 2) {
                        beepTwo.setVolume(0.25);
                        beepTwo.play();
                    }
                    else if (beepPick === 3) {
                        beepThree.setVolume(0.25);
                        beepFour.play();
                    }
                    else if (beepPick === 4) {
                        beepFour.setVolume(0.25);
                        beepFour.play();
                    }
                    else if (beepPick === 5) {
                        beepFive.setVolume(0.25);
                        beepFive.play();
                    }
                }
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

/**
 * Calculates grid size
 */
function calculateGridSize() {
    // Grid width is equal to canvas width divided by amount of columns / 2
    grid.squareW = width / grid.columns / 2;
    grid.squareH = height / grid.rows / 2;
}

/**
 * Controls the input and function calls for the play button
 */
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
            gridReset();
            scoreReset();
            timerReset();
            stateLevel = "one";
            nextStage();
            state = "game";
            warmUpSounds();
        }
    }
    else {
        playButton.fill.r = 0;
        playButton.fill.g = 0;
        playButton.fill.b = 0;
    }
}

/**
 * Ticks the timer down
 */
function timerUpdate() {
    timer--;
}

/**
 * Figures out everything regarding what the next stage / level should be after the timer reaches 0
 */
function nextStage() {
    if (timer <= 0) {
        // If the state of the level is level one display
        if (stateLevel === "one") {
            // If gridCompare is not nothing
            if (gridCompare != null) {
                cellCompare();
                // If score is less than the required score
                if (score < scoreRequired) {
                    gameOver.setVolume(0.25);
                    gameOver.play();
                    state = "end";
                }
                else {
                    // Increase score required
                    scoreRequired = scoreRequired + 5;
                    // If the timer is more than 4
                    if (timerOne > 4) {
                        timerOne = timerOne - 2;
                    }
                    wins++;
                    // If amount of wins is equal to (asked amount)
                    if (wins === 3) {
                        grid.columns = 8;
                        grid.rows = 8;
                        greatJob.setVolume(0.25);
                        greatJob.play();
                    }
                    else if (wins === 6) {
                        grid.columns = 10;
                        grid.rows = 10;
                        greatJob.setVolume(0.25);
                        greatJob.play();
                    }
                    else if (wins === 9) {
                        grid.columns = 12;
                        grid.rows = 12;
                        greatJob.setVolume(0.25);
                        greatJob.play();
                    }
                    else if (wins === 12) {
                        grid.columns = 14;
                        grid.rows = 14;
                        greatJob.setVolume(0.25);
                        greatJob.play();
                    }
                    calculateGridSize()
                }
            }
            oldScore = structuredClone(score);
            // Set the timer to 10
            timer = 5;
            // Set the editing boolean to false
            editState = false;
            // Choose how many cells to fill
            selectedEasy = Math.floor(random(5, 20));
            // Reset the grid, create a pattern on gridArray, copy it onto gridCompare
            levelOne();
            // Change the state of the level to one draw
            stateLevel = "onedraw";
        }
        // If the state of the level is level one draw
        else if (stateLevel === "onedraw") {
            gridReset();
            editState = true;
            timer = timerOne;
            stateLevel = "one";
        }
    }
}

/**
 * Prepares a level
 */
function levelOne() {
    gridReset();
    // For whatever amount of cells selected to be true
    for (let k = 0; k < selectedEasy; k++) {
        // Decides whatever the random whole number x coordinate will be picked for one of the cells that will turn green
        let randomColumn = Math.floor(random(0, grid.columns - 1));
        // Decides whatever the random whole number y coordinate will be picked for one of the cells that will turn green
        let randomRow = Math.floor(random(0, grid.rows - 1));
        // Turns selected cell true (green)
        gridArray[randomColumn][randomRow] = true;
    }
    // GridCompare is equal to gridArrays rows
    // Had to do this because it makes gridCompare a copy of the array instead of making it constantly refer to gridArray, meaning it would always match
    gridCompare = gridArray.map(row => row.slice());
}

/**
 * Resets the grid
 */
function gridReset() {
    // Let i equal 0, for every time i equals less than columns, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        // Basically creates "columns" amount of arrays
        gridArray[i] = [];
        // Let i equal 0, for every time i equals less than rows, add 1 to i
        for (let j = 0; j < grid.rows; j++) {
            // Create "rows" variables inside each of thea arrays (columns) and then set them all to false
            gridArray[i][j] = false;
        }
    }
}

/**
 * Resets score
 */
function scoreReset() {
    score = 0;
    oldScore = 0;
}

/**
 * Resets timer
 */
function timerReset() {
    timer = 0;
}

/**
 * Compares cells between gridArray and gridCompare to figure out how much score to give
 */
function cellCompare() {
    // Let i equal 0, for every time i equals less than columns, add 1 to i
    for (let i = 0; i < grid.columns; i++) {
        // Let i equal 0, for every time i equals less than rows, add 1 to i
        for (let j = 0; j < grid.rows; j++) {
            // Checks if the cells match
            if (gridArray[i][j] === true && gridCompare[i][j] === true) {
                score++;
            }
            else if (gridArray[i][j] === true && gridCompare[i][j] !== true) {
                score = score - 2;
            }
        }
    }
}

/**
 * Checks whether someone is editing their score value and triggers an alarm, breaking their game
 */
function cheatCheck() {
    if (score - oldScore > 20) {
        score = 0;
        backgroundColor.fill.r = 255;
        backgroundColor.fill.g = 0;
        backgroundColor.fill.b = 0;
        cheater.setVolume(0.50);
        cheater.play();
        alarm.loop();
        grid.columns = 128;
        grid.rows = 128;
        gridReset();
        calculateGridSize();
        console.log("CHEATER ALERT");
        console.log("CHEATER ALERT");
        console.log("CHEATER ALERT");
    }
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

/**
 * The metaphorical backbone of changing states
 */
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

/**
 * Displays all title screen related functions
 */
function titleScreen() {
    titleScreenText();
    drawPlayButton();
    playButtonInput();
    titleExplanationText();
}

/**
 * Displays all game related functions
 */
function game() {
    drawGrid();
    gridClickCheck();
    drawScore();
    drawTimer();
    drawRequirement();
    nextStage();
    cheatCheck();
}

/**
 * Displays all end screen related functions
 */
function end() {
    drawPlayButton();
    playButtonInput();
    gameOverText()
    cheatCheck();
}