/* Objects used to draw the game board
*/
function Ball() {
    this.radius = 10;
    this.x = startX; this.y = startY;
    this.moving = false;
    this.done = true; this.started = false; this.draw = draw;
    this.xVelocity = 0; this.yVelocity = 0;
    this.lastHitX = -1;
    this.lastHitY = -1;
    
    function draw(ctx,canvas,timeDelta) {
        if (!this.moving) this.moving = true;
        if (this.done) return;
        // draw circles in path
        if (!this.done) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
        
        // update positions
        var dx = this.xVelocity * timeDelta; var dy = this.yVelocity * timeDelta;
        var collision = false;
        if (this.y + dy > startY) {
            this.done = true;
            ballsMoving--;
        }
        if (this.y + dy < this.radius) {
            this.yVelocity = -this.yVelocity;
        }
        if (this.x + dx > canvas.width-this.radius || this.x + dx < this.radius) {
            this.xVelocity = -this.xVelocity;
        }
        // block collision detection
        // only check neighboring cells for efficiency; need to adjust until a proper fix can be made
        var currentX = Math.floor((this.x+dx+blockMargin/2)/(blockSize+blockMargin));
        var currentY = Math.floor((this.y+dy+blockMargin/2)/(blockSize+blockMargin));
        var blockCheckRange = [[-1,0],[0,-1],[1,0],[0,1]];
        for (var i = 0; i < blockCheckRange.length; i++) {
            var newY = currentY+blockCheckRange[i][1], newX = currentX+blockCheckRange[i][0];
            if (newY < 0 || newY > numBlocksHeight-1 || newX < 0 || newX > numBlocksWidth - 1) continue;
            var blockTest = grid[newY][newX];
            if (blockTest !== null) {
                var half = {x: blockTest.len/2, y: blockTest.len/2};
                var center = {x: (this.x+3*dx) - (blockTest.x+half.x), y: (this.y+3*dy) - (blockTest.y+half.y)};
                var originalCenter = {x: (this.x+dx) - (blockTest.x+half.x), y: (this.y+dy) - (blockTest.y+half.y)};
                
                var side = {x: Math.abs(center.x)-half.x, y: Math.abs(center.y)-half.y};
                var originalSide = {x: Math.abs(originalCenter.x)-half.x, y: Math.abs(originalCenter.y)-half.y};
                if (side.x > this.radius || side.y > this.radius) continue; // outside
                if (side.x < -this.radius && side.y < -this.radius) continue; // inside
                var xVectorChange = 0, yVectorChange = 0, isCorner = false;
                if (originalSide.x < 0 || originalSide.y < 0) {
                    if (Math.abs(side.x) < this.radius && side.y < 0) {
                        console.log("side");
                        xVectorChange = center.x*side.x < 0 ? -1 : 1;
                    } else if (Math.abs(side.y) < this.radius && side.x < 0) {
                        console.log("top");
                        yVectorChange = center.y*side.y < 0 ? -1 : 1;
                    } else {
                        continue;
                    }
                } else { // case near corner
                    console.log("corner");
                    if (!(side.x*side.x + side.y*side.y < this.radius*this.radius)) {
                        
                        var norm = Math.sqrt (side.x*side.x+side.y*side.y);
                        var bounceDx = center.x < 0 ? -1 : 1;
                        var bounceDy = center.y < 0 ? -1 : 1;
                        xVectorChange = bounceDx*(side.x/norm);
                        yVectorChange = bounceDy*(side.y/norm);
                        isCorner = true;
                    } else {
                        continue;
                    }
                }
                console.log(this.xVelocity);
                console.log(this.yVelocity);
                var normal_len = xVectorChange*this.xVelocity + yVectorChange*this.yVelocity;
                this.xVelocity = this.xVelocity-2*xVectorChange*normal_len;
                this.yVelocity = this.yVelocity-2*yVectorChange*normal_len
                console.log(this.xVelocity);
                console.log(this.yVelocity);
                if (blockTest.number - 1 === 0) {
                    grid[newY][newX] = null;
                } else {
                    blockTest.number--;
                }
                //if (!isCorner) break;
                break;
            }
        }
        this.x += dx; this.y += dy;
    }
};

function Block() {
    this.number = levelNum;
    this.x = 0, this.y = 0;
    this.len = blockSize;
    this.draw = draw;
    
    function draw(ctx,canvas) {
        ctx.fillStyle = "hsl(" + (this.number*20) % 360  + ", 80%, 50%)";
        ctx.fillRect(this.x, this.y, this.len, this.len);
        ctx.font = "12pt Sans Serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.number, this.x + this.len/2, this.y + this.len/2);
    }
}
