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
    
    // choose cells that will have something
    var indices = Array(numBlocksWidth);
    for (i = 0; i < indices.length; i++) {
        indices[i] = i;
    }
    const shuffled = indices.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    var r = Math.random();//1+Math.floor(Math.random()*(numBlocksWidth-1)
    var numFilled = 1;
    if (r < 0.3) {
        numFilled = 3;
    } else if (r < 0.55) {
        numFilled = 4;
    } else if (r < 0.7) {
        numFilled = 5;
    } else if (r < 0.75) {
        numFilled = 6;
    } else if (r < 0.8) {
        numFilled = 7;
    } else if (r < 0.7) {
        numFilled = 6;
    } else if (r < 0.9) {
        numFilled = 2;
    }
    let selected = shuffled.slice(0, numFilled);
    
    for (i = 0; i < numBlocksWidth; i++) {
        if (selected.includes(i)) {
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
