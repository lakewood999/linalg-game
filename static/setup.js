/* Initial setup */
// Game block settings
var blockSize = 45;
var blockMargin = 5;
var numBlocksWidth = 7, numBlocksHeight = 10;

// setup the canvas
var canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
canvas.width = numBlocksWidth * blockSize + blockMargin * (numBlocksWidth+1);
canvas.height = numBlocksHeight * blockSize + blockMargin * (numBlocksHeight+1) + blockSize*2; // last one adjusts for bottom bar

// render setup
var targetFps = 60, targetElapsed = 1/60;

// basic game variables
var startX = canvas.width/2, startY = canvas.height-blockSize*2;
var ballRadius = 10;
var game_state;
var ballsMoving, framesPassed, framesBeforeShots;
var gameFailed = false;

var grid = new Array(numBlocksHeight);
for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(numBlocksWidth);
    for (var j = 0; j < grid[i].length; j++) {
        grid[i][j] = null;
    }
}
var levelNum, effectiveLevel;
var ballsGained;
var roundsSincePowerup;
var numberNewBalls, ballPowerupsOnBoard;
var numSolved, numCorrect;
var balls;
