/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
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
    if (r < 0.5) {
        numFilled = 2;
    } else if (r < 0.6) {
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
            // list of chances for the different powerups
            var b1 = Math.min(0.675,0.35 + percentBonus + Math.max(0, Math.log(0.4*roundsSincePowerup+0.7)) 
            + Math.max(0,-0.5*(balls.length/effectiveLevel-0.5)))
            - (4/3)*(ballPowerupsOnBoard+balls.length)/effectiveLevel;
            var b2 = b1 + 0.01;
            var b3 = b2 + 0.05;
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
                    lvlAdjust = -2;
                }
                var multiplier = 1;
                if (Math.random() < 0.05) {
                    multiplier = 2;
                }
                newBlocks[i].number = Math.max(1,effectiveLevel+Math.floor(1+effectiveLevel/10)*lvlAdjust+levelBonus) * multiplier;
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
