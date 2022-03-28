/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/* Initial setup */
// Game block settings
var blockSize = 45;
var blockMargin = 5;
var numBlocksWidth = 7, numBlocksHeight = 12;

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
var levelNum, effectiveLevel, levelBonus;
var roundsSincePowerup;
var powerups, ballPowerupsOnBoard, currentPowerup = "";
var numSolved, numCorrect, problemChances;
var balls, ballPower;

// reflection transformation matrices
var wallHorizontalMatrix = [{x: -1, y: 0}, {x: 0, y: 1}];