
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

function huntCursor(robot, window) {
    return new Promise((resolve) => {
        new Promise((resolve,) => {
            function updateWindowPosition(progress) {
                const currentPosition = window.getPosition();
                const {x, y} = robot.getMousePos()

                const deltaX = x - (currentPosition[0] + (1870 / 2469 * window.getSize()[0]));
                const deltaY = y - (currentPosition[1] + (290 / 631 * window.getSize()[1]));

                let moveX;
                let moveY;

                if ((deltaX > 0 && deltaX < 6) || (deltaX < 0 && deltaX > -6)) moveX = deltaX;
                else if (deltaX > 0) moveX = 6;
                else moveX = -6;

                if ((deltaY > 0 && deltaY < 6) || (deltaY < 0 && deltaY > -6)) moveY = deltaY;
                else if (deltaY > 0) moveY = 6;
                else moveY = -6;

                const newX = Math.round(currentPosition[0] + moveX);
                const newY = Math.round(currentPosition[1] + moveY);

                //console.log(moveX, moveY);

                window.setPosition(newX, newY);

                if (moveY > 6 || moveX > 6) {
                    setTimeout(updateWindowPosition, 16, progress + 1); // 60 frames per second
                } else {
                    resolve();
                }
            }
            updateWindowPosition(1);
        })
        .then(() => steelCursorSmoothly(robot, window, Math.floor(Math.random() * (100 - -100 + 1)) + -100, Math.floor(Math.random() * (100 - -100 + 1)) + -100))
        .then(() => resolve());
    });

}

module.exports = {moveWindowSmoothly, huntCursor, steelCursorSmoothly};
