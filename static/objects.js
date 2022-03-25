/* Objects used to draw the game board
*/
var popSound = new Audio("static/pop.mp3");
function Ball() {
    this.radius = ballRadius;
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
        if (grid[currentY][currentX] !== null) {
            if (grid[currentY][currentX].objectType === "powerup") {
                powerups.add(grid[currentY][currentX].boost);
                popSound.play();
                popSound.currentTime = 0;
                if (grid[currentY][currentX].boost === "newBall") ballPowerupsOnBoard--;
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
                        if (Math.abs(sides.y+1.2*dy) <= this.radius + blockTest.len/2 + 6) { // vertical collision
                            this.yVelocity = -this.yVelocity;
                            collided = true;
                        } else {
                        }
                    } else if (Math.abs(sides.x) > Math.abs(sides.y)) {
                        if (Math.abs(sides.x+1.2*dx) <= this.radius + blockTest.len/2 + 6) { // horizontal collision
                            this.xVelocity = -this.xVelocity;
                            collided = true;
                        } else {
                        }
                    } else {
                        if (sides.y > 0) {
                        }
                    }
                }
                if (collided) {
                    if (blockTest.number - 1 === 0) {
                        grid[newY][newX] = null;
                    } else {
                        blockTest.number -= 1;
                    }
                    popSound.play();
                    popSound.currentTime = 0;
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

function PowerupBank() {
    this.d = {"newBall":0};
    this.total = 0;
    this.apply = apply;
    this.next = next;
    this.keyEnglish = keyEnglish;
    this.add = add;

    function add(t) {
        this.d[t]++;
        this.total++;
    }

    function apply(t, success) {
        this.d[t] = this.d[t] - 1;
        this.total--;
        if (success) {
            if (t === "newBall") {
                balls.push(new Ball());
            }
        }
    }

    function next() {
        while (true) {
            var randomPowerup = Math.floor(Math.random()*Object.keys(this.d).length);
            var randomKey = Object.keys(this.d)[randomPowerup];
            if (this.d[randomKey] > 0) {
                return randomKey;
            }
        }
    }

    function keyEnglish(k) {
        if (k == "newBall") {
            return "get 1 extra ball";
        }
    }
}

function Powerup() {
    this.x = 0, this.y = 0;
    this.draw = draw;
    this.objectType = "powerup";
    this.boost = "newBall";
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
