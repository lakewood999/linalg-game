/* Handle mouse inputs for aiming
*/

var isMouseDown = false, isMouseMoving = false;
var minMouseMovingRadius = 2*2;
var firstMousePos, mouseDx, mouseDy;
var mouseAngle, mouseDistance;
function getXY(e) {
    return {x: e.clientX, y: e.clientY}
}
canvas.onmousedown = function(e) {
    if (game_state !== "aiming") return;
    console.log("registered click");
    firstMousePos = getXY(e);
    isMouseDown = true, isMouseMoving = false;
}
window.addEventListener("mousemove", function(e) {
    if (game_state !== "aiming" || !isMouseDown) return;
    var pos = getXY(e);
    mouseDx = -1*(firstMousePos.x - pos.x), mouseDy = -1*(firstMousePos.y - pos.y);
    mouseDistance = mouseDx * mouseDx + mouseDy * mouseDy;
    console.log(mouseDistance);
    if (mouseDistance >= minMouseMovingRadius && mouseDy >= 0) isMouseMoving = true;
    if (isMouseMoving) {
        mouseAngle = Math.atan(Math.abs(mouseDy)/Math.abs(mouseDx));
    }
});
window.addEventListener("mouseup", function(e) {
    if (game_state !== "aiming" || !isMouseDown) return;
    if (isMouseMoving) game_state = "shooting";
    isMouseDown = false, isMouseMoving = false;
    if (!isMouseMoving) {
    }
});
