/* Objects used to draw the game board
*/
function Ball() {
    this.radius = 9.5;
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
        var currentX = Math.min(numBlocksWidth-1,Math.max(0,Math.floor((this.x+dx-blockMargin/2)/(blockSize+blockMargin/2))));
        var currentY = Math.min(numBlocksHeight-1,Math.max(0,Math.floor((this.y+dy-blockMargin/2)/(blockSize+blockMargin/2))));
        console.log(currentX + " " + currentY);
        if (grid[currentY][currentX] !== null) {
            if (grid[currentY][currentX].objectType === "powerup") {
                ballsGained++;
                grid[currentY][currentX] = null;
            }
        } else {
            //grid[currentY][currentX] = new Powerup();
            //grid[currentY][currentX].objectType = "tracer";
        }
        var blockCheckRange = [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,1],[1,-1],[-1,-1]];
        for (var i = 0; i < blockCheckRange.length; i++) {
            var newY = currentY+blockCheckRange[i][1], newX = currentX+blockCheckRange[i][0];
            if (newY < 0 || newY > numBlocksHeight-1 || newX < 0 || newX > numBlocksWidth - 1) continue;
            var blockTest = grid[newY][newX];
            if (blockTest !== null && blockTest.objectType === "block") {
                //blockTest.number = 100;
                var testX = this.x, testY = this.y, isLeft = true, isAbove = true;
                
                // determine edges to use in collision detection
                if (this.x+dx < blockTest.x) testX = blockTest.x; // left edge
                else if (this.x+dx > blockTest.x+blockTest.len) testX = blockTest.x+blockTest.len; isLeft = false; // right edge
                if (this.y < blockTest.y) testY = blockTest.y // top edge
                else if (this.y+dy > blockTest.y+blockTest.len) testY = blockTest.y+blockTest.len; isAbove = false; // bottom edge
                
                // calculate distance
                var rectCenter = {x: blockTest.x + blockTest.len/2, y: blockTest.y + blockTest.len/2};
                var sides = {x: (this.x+dx) - rectCenter.x, y: (this.y+dy) - rectCenter.y};
                var collided = false;
                if (Math.abs(1-Math.abs(sides.y/sides.x)) < 0.1 && Math.pow(sides.x,2) + Math.pow(sides.y,2) <= Math.pow(this.radius + Math.sqrt(2)*blockTest.len/2,2)) { // corner hit
                    this.xVelocity = -this.xVelocity;
                    this.yVelocity = -this.yVelocity;
                    collided = true;
                } else {
                    if (Math.abs(sides.y) > Math.abs(sides.x)) {
                        if (Math.abs(sides.y+dy) <= this.radius + blockTest.len/2 + 12) { // vertical collision
                            console.log("top");
                            this.yVelocity = -this.yVelocity;
                            collided = true;
                        } else {
                            console.log("failed top with ");
                            console.log(sides);
                        }
                    } else if (Math.abs(sides.x) > Math.abs(sides.y)) {
                        if (Math.abs(sides.x+dx) <= this.radius + blockTest.len/2 + 12) { // horizontal collision
                            console.log("side");
                            this.xVelocity = -this.xVelocity;
                            collided = true;
                        } else {
                            console.log("failed side with ");
                            console.log(sides);
                        }
                    } else {
                        if (sides.y > 0) {
                        console.log("missed");
                        console.log(sides);
                        console.log(currentX + " " + currentY);
                        console.log(newY + " " + newX);
                        }
                    }
                }
                if (collided) {
                    if (blockTest.number - 1 === 0) {
                        grid[newY][newX] = null;
                    } else {
                        blockTest.number -= 1;
                    }
                    break;
                }
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
    this.objectType = "block";
    
    function draw(ctx,canvas) {
        ctx.fillStyle = "hsl(" + (this.number*20) % 360  + ", 80%, 50%)";
        ctx.fillRect(this.x, this.y, this.len, this.len);
        ctx.font = "12pt Sans Serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.number, this.x + this.len/2, this.y + this.len/2);
    }
}

function Powerup() {
    this.x = 0, this.y = 0;
    this.draw = draw;
    this.objectType = "powerup";
    this.id = 0;
    this.color = 86;
    
    function draw(ctx,canvas) {
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + this.color + ", 80%, 50%)";
        ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fill()
        ctx.closePath();
    }
}
