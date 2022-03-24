function gen_board() {
    // check if the second to last row still has blocks; if so, next shift results in a lose game
    for (var i = 0; i < grid[numBlocksHeight-2].length; i++) {
        if (grid[numBlocksHeight-2][i] !== null && grid[numBlocksHeight-2][i].objectType === "block") {
            gameFailed = true;
            break;
        }
    }
    grid.pop();
    var gotPowerup = false;
    var newBlocks = Array(numBlocksWidth);
    for (i = 0; i < numBlocksWidth; i++) {
        if (Math.random() < 0.4) {
            if (Math.random() < 0.1 + Math.max(0,Math.log(0.4*roundsSincePowerup+0.7))) {
                newBlocks[i] = new Powerup();
                newBlocks[i].color = 86;
                gotPowerup = true;
                roundsSincePowerup = 0;
            } else {
                newBlocks[i] = new Block();
                newBlocks[i].number = levelNum + Math.floor(Math.random()*3);
                newBlocks[i].len = blockSize;
            }
        } else {
            newBlocks[i] = null;
        }
    }
    if (!gotPowerup) roundsSincePowerup++;
    grid.unshift(newBlocks);
    return grid;
}
