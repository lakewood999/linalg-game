/* Main Game Loop
*/

let previousTimestamp = Date.now();
function draw(timestamp) {
    // clear board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.arc(startX, startY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    
    // get the times
    const timeDelta = (timestamp-previousTimestamp)/1000; // convert to seconds
    
    if (Math.abs(timeDelta-targetElapsed) < 0.01) {
        if (isMouseMoving && mouseDy > 0 && game_state === "aiming") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineWidth = Math.min(8,Math.sqrt(mouseDistance)/50);
            var xLength = canvas.width/4;
            var lineY = startY-Math.tan(mouseAngle)*xLength;
            if (mouseDx < 0) {
                var lineX = canvas.width - xLength;
            } else {
                var lineX = 0 + xLength;
            }
            ctx.lineTo(lineX, lineY);
            ctx.stroke();
        } else if (game_state === "shooting") {
            for (var i = 0; i < balls.length; i++) {
                var currentBall = balls[i];
                if (currentBall.started == false) {
                    console.log("shooting ball");
                    currentBall.started = true;
                    currentBall.done = false;
                    console.log(mouseDx + " " + mouseDy);
                    currentBall.xVelocity = -1*100*mouseDx/10;
                    currentBall.yVelocity = -1*100*mouseDy/10;
                    ballsMoving++;
                }
                currentBall.draw(ctx,canvas,timeDelta);
            }
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
            firstMousePos = null;
            mouseDistance = 0;
            mouseAngle = 0;
            console.log("reset!");
            game_state = "aiming";
        }
    }
    
    // update time
    previousTimestamp = timestamp;
    
    // draw next frame
    requestAnimationFrame(draw);
}
