function gen_board() {
    // check if the second to last row still has blocks; if so, next shift results in a lose game
    for (var i = 0; i < grid[numBlocksHeight-2].length; i++) {
        if (grid[numBlocksHeight-2][i] !== null) {
            return false;
        }
    }
    grid.pop();
    var newBlocks = Array(numBlocksWidth);
    for (i = 0; i < numBlocksWidth; i++) {
        if (Math.random() < 0.5) {
            newBlocks[i] = new Block();
            newBlocks[i].number = levelNum + Math.floor(Math.random()*3);
            newBlocks[i].len = blockSize;
        } else {
            newBlocks[i] = null;
        }
    }
    grid.unshift(newBlocks);
    return grid;
}
