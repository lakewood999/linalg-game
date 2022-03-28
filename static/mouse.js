/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

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
    firstMousePos = getXY(e);
    isMouseDown = true, isMouseMoving = false;
}
window.addEventListener("mousemove", function(e) {
    if (game_state !== "aiming" || !isMouseDown) return;
    var pos = getXY(e);
    mouseDx = -1*(firstMousePos.x - pos.x), mouseDy = -1*(firstMousePos.y - pos.y);
    mouseDistance = mouseDx * mouseDx + mouseDy * mouseDy;
    if (mouseDistance >= minMouseMovingRadius && mouseDy >= 0) isMouseMoving = true;
    if (mouseDy < 0) isMouseMoving = false;
    if (isMouseMoving) {
        mouseAngle = Math.atan(Math.abs(mouseDy)/Math.abs(mouseDx));
        e.preventDefault();
    }
});
window.addEventListener("mouseup", function(e) {
    if (game_state !== "aiming" || !isMouseDown) return;
    if (isMouseMoving) game_state = "shooting";
    isMouseDown = false, isMouseMoving = false;
    if (!isMouseMoving) {
    }
});
