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
    if (r < 0.475) {
        numFilled = 2;
    } else if (r < 0.60) {
        numFilled = 3;
    } else if (r < 0.7) {
        numFilled = 4;
    } else if (r < 0.775) {
        numFilled = 5;
    } else if (r < 0.825) {
        numFilled = 6;
    } else if (r < 0.85) {
        numFilled = 7;
    } else if (r < 0.9) {
        numFilled = 1;
    }
    let selected = shuffled.slice(0, numFilled);
    
    var prevEffectiveLevel = effectiveLevel;
    
    effectiveLevel = Math.floor(effectiveLevel - (effectiveLevel-balls.length)/3);
    
    percentBonus = 0;
    if (effectiveLevel < 5) {
        percentBonus = 0.25;
    } else if (effectiveLevel < 10) {
        percentBonus = 0.20;
    } else if (effectiveLevel < 15) {
        percentBonus = 0.15;
    } else if (effectiveLevel < 20) {
        percentBonus = 0.1
    }
    
    for (i = 0; i < numBlocksWidth; i++) {
        if (selected.includes(i)) {
            // ball chance depends on base, adjustment for levels since, and current level subtracting number available
            var percent = Math.random();
            var b1 = Math.min(0.6,0.35 + percentBonus + Math.max(0, Math.log(0.4*roundsSincePowerup+0.7)) 
            + Math.max(0,-0.5*(balls.length/effectiveLevel-0.5)))
            - (4/3)*(ballPowerupsOnBoard+balls.length)/effectiveLevel;
            var b2 = b1 + 0.025;
            var b3 = b2 + 0.05;
            console.log(b1);
            if (percent < b1) {
                newBlocks[i] = new Powerup();
                newBlocks[i].color = 86;
                gotPowerup = true;
                roundsSincePowerup = 0;
                ballPowerupsOnBoard++;
            } else if (percent < b2) {
                newBlocks[i] = new Powerup();
                newBlocks[i].color = 231;
                newBlocks[i].boost = "ballPowerup";
                gotPowerup = true;
            } else if (percent < b3) {
                newBlocks[i] = new Powerup();
                newBlocks[i].color = 353;
                newBlocks[i].boost = "lowerEffectiveLevel";
                gotPowerup = true;
            } else {
                newBlocks[i] = new Block();
                var lvlChance = Math.random();
                var lvlAdjust = 0;
                if (lvlChance < 0.5) {
                    lvlAdjust = 0;
                } else if (lvlChance < 0.65) {
                    lvlAdjust = 1;
                } else if (lvlChance < 0.7) {
                    lvlAdjust = 2;
                } else if (lvlChance < 0.725) {
                    lvlAdjust = 3;
                } else if (lvlChance < 0.85) {
                    lvlAdjust = -1;
                } else if (lvlChance < 0.95) {
                    lvlChance = -2;
                }
                newBlocks[i].number = Math.max(1,effectiveLevel+Math.floor(1+effectiveLevel/10)*lvlAdjust+levelBonus);
                newBlocks[i].len = blockSize;
            }
        } else {
            newBlocks[i] = null;
        }
    }
    effectiveLevel = prevEffectiveLevel;
    if (!gotPowerup) roundsSincePowerup++;
    grid.unshift(newBlocks);
    return grid;
}
