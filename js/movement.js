
function moveWindowSmoothly(window, targetX=1000, targetY=1000, duration=5000) {
    //good speed = 148/1000 => 148px/second

    const currentPosition = window.getPosition();
    const deltaX = targetX - currentPosition[0];
    const deltaY = targetY - currentPosition[1];

    const startTime = Date.now();

    function updateWindowPosition() {
        const currentTime = Date.now();
        const currentTimeDiff = currentTime - startTime;
        const progress = Math.min(1, (currentTime - startTime) / duration);

        const newX = currentPosition[0] + deltaX * progress;
        const newY = currentPosition[1] + deltaY * progress;

        window.setPosition(Math.round(newX), Math.round(newY));

        if (progress < 1) {
            setTimeout(updateWindowPosition, 16); // 60 frames per second
        }
    }

    updateWindowPosition();
}

function moveCursorSmoothly(mouse, targetX=1000, targetY=1000, duration=5000) {

    mouse.setMouseDelay(2);

    const currentPosition = mouse.getMousePos();
    const deltaX = targetX - currentPosition.x;
    const deltaY = targetY - currentPosition.y;

    const startTime = Date.now();

    function updateCursorPosition() {
        const currentTime = Date.now();
        const currentTimeDiff = currentTime - startTime;
        const progress = Math.min(1, (currentTime - startTime) / duration);

        const newX = currentPosition.x + deltaX * progress;
        const newY = currentPosition.y + deltaY * progress;

        mouse.moveMouse(Math.round(newX), Math.round(newY));

        if (progress < 1) {
            setTimeout(updateCursorPosition, 16); // 60 frames per second
        }
    }

    updateCursorPosition();
}


module.exports = {moveWindowSmoothly, moveCursorSmoothly};
