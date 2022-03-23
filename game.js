/* Main Game Loop
*/

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
                currentBlock.x = k * blockSize + blockMargin * k;
                currentBlock.y = j * blockSize + blockMargin * j;
                currentBlock.draw(ctx,canvas);
            }
        }
    }
    
    if (game_state === "aiming") {
        ctx.beginPath();
        ctx.arc(startX, startY, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    
    if (Math.abs(timeDelta-targetElapsed) < 0.01) {
        if (isMouseMoving && mouseDy > 0 && game_state === "aiming") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineWidth = Math.min(4,Math.sqrt(mouseDistance)/40);
            var xLength = canvas.width/4;
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
                    var speed = Math.min(5*Math.sqrt(mouseDistance)+300,700);
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
            framesPassed = 0;
            firstMousePos = null;
            mouseDistance = 0;
            mouseAngle = 0;
            game_state = "aiming";
            levelNum++;
            gen_board();
        }
    }
    
    // update time
    previousTimestamp = timestamp;
    
    // draw next frame
    requestAnimationFrame(draw);
}
