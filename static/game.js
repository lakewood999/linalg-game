/* Main Game Functions
*/
// start game
function startGame() {
    levelNum = 1;
    effectiveLevel = 1;
    ballsGained = 0;
    roundsSincePowerup = 0;
    numberNewBalls = 0, ballPowerupsOnBoard=0;
    
    numSolved = 0;
    numCorrect = 0;
    
    game_state = "aiming";
    gameFailed = false;
    
    ballsMoving = 0, framesPassed = 0, framesBeforeShots = 5;
    balls = [new Ball()];
    grid = new Array(numBlocksHeight);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(numBlocksWidth);
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j] = null;
        }
    }
    grid = gen_board();
    
    $("#overlay").hide();
    $("#gameCanvas").show();
    
    requestAnimationFrame(draw);
}

// Main game loop
let previousTimestamp = Date.now();
function draw(timestamp) {
    // get the times
    const timeDelta = (timestamp-previousTimestamp)/1000; // convert to seconds
    
    // clear board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // game bottom border line; always draw
    ctx.beginPath();
    ctx.moveTo(0, startY);
    ctx.lineWidth = 1;
    ctx.lineTo(canvas.width, startY);
    ctx.stroke();
    ctx.closePath();
    
    ctx.font = "12pt Sans-Serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.fillText("FPS: " + Math.round(1/timeDelta), 10, canvas.height - 10);
    
    ctx.textAlign = "right";
    ctx.fillText("Score: " + levelNum, canvas.width-10, canvas.height - 10);
    
    for (var j = 0; j < grid.length; j++) {
        for (var k = 0; k < grid[j].length; k++) {
            if (grid[j][k] !== null) {
                var currentBlock = grid[j][k];
                currentBlock.x = k * blockSize + blockMargin * (k+1);
                currentBlock.y = j * blockSize + blockMargin * (j+1);
                if (currentBlock.objectType === "powerup" || currentBlock.objectType === "tracer") {
                    currentBlock.x += blockSize/2;
                    currentBlock.y += blockSize/2;
                }
                currentBlock.draw(ctx,canvas);
            }
        }
    }
    
    if (game_state === "lost") {
        var overlay = document.getElementById("overlay");
        canvas.style.display = "none";
        overlay.style.width = "" + canvas.width + "px";
        overlay.style.height = "" + canvas.height + "px";
        overlay.style.display = "block";
        overlay.style.margin = "auto";
        overlay.style.border = "1px solid black";
        $("#goScore").text(levelNum-1);
        $("#goNumSolved").text(numSolved);
        $("#goNumCorrect").text(numCorrect);
        return; // done with the game!
    }
    
    if (game_state === "aiming") {
        ctx.beginPath();
        ctx.arc(startX, startY, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        ctx.textAlign = "center";
        ctx.fillText(""+balls.length+" ball(s)", startX, startY + 30);
    }
    
    if (Math.abs(timeDelta-targetElapsed) < 0.01) {
        if (isMouseMoving && mouseDy > 0 && game_state === "aiming") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineWidth = Math.min(4,Math.sqrt(mouseDistance)/40);
            var xLength = canvas.width/2;
            var lineY = startY - Math.sin(mouseAngle)*xLength;
            if (mouseDx < 0) {
                var lineX = startX + xLength*Math.cos(mouseAngle);
            } else {
                var lineX = startX - xLength * Math.cos(mouseAngle);
            }
            ctx.lineTo(lineX, lineY);
            ctx.stroke();
            ctx.closePath();
        } else if (game_state === "shooting") {
            for (var i = 0; i < balls.length; i++) {
                var currentBall = balls[i];
                if (currentBall.started == false && (i === 0 || framesPassed === framesBeforeShots)) {
                    currentBall.started = true;
                    currentBall.done = false;
                    var xMultiplier = mouseDx < 0 ? 1 : -1;
                    var speed = Math.min(5*Math.sqrt(mouseDistance)+250,600);
                    currentBall.xVelocity = xMultiplier*speed*Math.cos(mouseAngle);
                    currentBall.yVelocity = -1*speed*Math.sin(mouseAngle);
                    ballsMoving++;
                    framesPassed = 0;
                }
                currentBall.draw(ctx,canvas,timeDelta);
            }
            framesPassed++;
            if (ballsMoving == 0) {
                game_state = "resetting";
            }
        } else if (game_state === "resetting") {
            for (var i = 0; i < balls.length; i++) {
                var currentBall = balls[i];
                currentBall.started = false;
                currentBall.done = true;
                currentBall.xVelocity = 0;
                currentBall.yVelocity = 0;
                currentBall.x = startX;
                currentBall.y = startY;
            }
            for (var j = 0; j < grid.length; j++) {
                for (var k = 0; k < grid[j].length; k++) {
                    if (grid[j][k] !== null) {
                        var currentBlock = grid[j][k];
                        if (currentBlock.objectType === "tracer") {
                            grid[j][k] = null;
                        }
                    }
                }
            }
            framesPassed = 0;
            firstMousePos = null;
            mouseDistance = 0;
            mouseAngle = 0;
            game_state = "aiming";
            levelNum++;
            effectiveLevel++;
            if (levelNum % 5 === 0) {
                balls.push(new Ball()); // force new ball every 5 levels
            }
            for (i = 0; i < ballsGained; i++) {
                balls.push(new Ball());
            }
            ballsGained = 0;
            gen_board();
            if (gameFailed) {
                game_state = "lost";
            }
            if (!gameFailed && numberNewBalls > 0) {
                game_state = "solving";  
            }
        } else if (game_state === "solving") {
            var problemOverlay = document.getElementById("problemOverlay");
            if (numberNewBalls === 0) {
                canvas.style.display = "inline";
                problemOverlay.style.display = "none";
                game_state = "aiming";  
            } else {
                if (problemOverlay.style.display === "none") {
                    canvas.style.display = "none";
                    problemOverlay.style.width = "" + canvas.width + "px";
                    problemOverlay.style.height = "" + canvas.height + "px";
                    problemOverlay.style.display = "block";
                    problemOverlay.style.margin = "auto";
                    problemOverlay.style.border = "1px solid black";
                    startProblem();
                }
            }
        }
    }
    // update time
    previousTimestamp = timestamp;

    // draw next frame
    requestAnimationFrame(draw);
}

startGame();
