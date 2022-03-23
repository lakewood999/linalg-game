/* Objects used to draw the game board
*/
function Ball() {
    this.radius = 7.5;
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
        var currentX = Math.floor((this.x+dx)/blockSize);
        var currentY = Math.floor((this.y+dy)/blockSize);
        for (var i = Math.max(0,currentY-2); i <= Math.min(currentY+2, numBlocksHeight-1); i++) {
            for (var j = Math.max(0,currentX-2); j <= Math.min(currentX+2,numBlocksWidth-1); j++) {
                var blockTest = grid[i][j];
                if (blockTest !== null) {
                    var testX = this.x, testY = this.y, isLeft = true, isAbove = true;
                    // determine edges to use in collision detection
                    if (this.x+dx < blockTest.x) testX = blockTest.x; // left edge
                    else if (this.x+dx > blockTest.x+blockTest.len) testX = blockTest.x+blockTest.len; isLeft = false; // right edge
                    if (this.y < blockTest.y) testY = blockTest.y // top edge
                    else if (this.y+dy > blockTest.y+blockTest.len) testY = blockTest.y+blockTest.len; isAbove = false; // bottom edge
                    // calculate distance
                    var distX = (this.x+dx)-testX, distY =(this.y+dy)-testY;
                    var objectDistance = Math.sqrt( (distX*distX) + (distY*distY) );
                    if (objectDistance <= this.radius) {
                        if (blockTest.number - 1 === 0) {
                            grid[i][j] = null;
                        } else {
                            blockTest.number -= 1;
                        }
                        if ((isLeft && blockTest.x - (this.x+dx) <= this.radius) || (!isLeft && (this.x+dx) - blockTest.x - blockTest.len <= this.radius)) { // collision on side means change x
                            this.xVelocity = -this.xVelocity;
                        }
                        console.log(isAbove);
                        console.log((this.y+dy) + " is sphere and rect: " + blockTest.y);
                        if ((isAbove && blockTest.y - (this.y+dy) <= this.radius) || (!isAbove && (this.y+dy)-blockTest.y-blockTest.len <= this.radius)) { // collision on bottom means change y only
                            console.log("Direction change");
                            this.yVelocity = -this.yVelocity;
                        }
                    }
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
    
    function draw(ctx,canvas) {
        ctx.fillStyle = "hsl(" + (this.number*20) % 360  + ", 80%, 50%)";
        ctx.fillRect(this.x, this.y, this.len, this.len);
        ctx.font = "12pt Sans Serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.number, this.x + this.len/2, this.y + this.len/2);
    }
}
