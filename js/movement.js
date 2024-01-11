const path = require("path");

function moveWindowSmoothly(window, targetX=1000, targetY=1000) {
    //good speed = 148/1000 => 148px/second

    return new Promise((resolve, reject) => {

        const currentPosition = window.getPosition();
        let deltaX = targetX - currentPosition[0];
        let deltaY = targetY - currentPosition[1];

        if(deltaX%2!==0) deltaX+=1;
        if(deltaY%2!==0) deltaY+=1;

        function updateWindowPosition(progress){
            const currentPosition = window.getPosition();
            let moveX = deltaX>0?(2*progress<deltaX?2:0):(-2*progress>deltaX?-2:0);
            let moveY = deltaY>0?(2*progress<deltaY?2:0):(-2*progress>deltaY?-2:0);

            const newX = currentPosition[0] + moveX;
            const newY = currentPosition[1] + moveY;

            window.setPosition(newX, newY);

            if (moveY!==0 || moveX!==0) {
                setTimeout(updateWindowPosition, 16, progress+1); // 60 frames per second
            }else{
                resolve();
            }
        }

        updateWindowPosition(1);

    });
}

/*function moveCursorSmoothly(mouse, targetX=1000, targetY=1000 ) {

    return new Promise((resolve, reject) => {

        mouse.setMouseDelay(2);

        const currentPosition = mouse.getMousePos();
        const deltaX = targetX - currentPosition.x;
        const deltaY = targetY - currentPosition.y;

        function updateCursorPosition(progress) {
            const currentPosition = mouse.getMousePos();

            let moveX = deltaX>0?(2*progress<deltaX?2:0):(-2*progress>deltaX?-2:0);
            let moveY = deltaY>0?(2*progress<deltaY?2:0):(-2*progress>deltaY?-2:0);

            const newX = currentPosition.x + moveX;
            const newY = currentPosition.y + moveY;

            mouse.moveMouse(newX, newY);

            if (moveY!==0 || moveX!==0) {
                setTimeout(updateCursorPosition, 16, progress+1); // 60 frames per second
            }else{
                resolve();
            }
        }

        updateCursorPosition(1);
    });
}*/

function steelCursorSmoothly(mouse, window, targetX=1000, targetY=1000, offsetX=1870 / 2469, offsetY=290 / 631 ) {
    return new Promise((resolve) => {

        mouse.setMouseDelay(2);

        const currentPosition = window.getPosition();
        let deltaX = targetX - currentPosition[0];
        let deltaY = targetY - currentPosition[1];

        if(deltaX%2!==0) deltaX+=1;
        if(deltaY%2!==0) deltaY+=1;

        function updateWindowPosition(progress){
            const currentPosition = window.getPosition();
            let moveX = deltaX>0?(2*progress<deltaX?1:0):(-2*progress>deltaX?-1:0);
            let moveY = deltaY>0?(2*progress<deltaY?1:0):(-2*progress>deltaY?-1:0);

            const newX = currentPosition[0] + moveX;
            const newY = currentPosition[1] + moveY;

            window.setPosition(newX, newY);
            mouse.moveMouse(newX + ( offsetX* window.getSize()[0]), newY + (offsetY * window.getSize()[1]));

            if (moveY!==0 || moveX!==0) {
                setTimeout(updateWindowPosition, 8, progress+1); // 120 frames per second
            }else{
                resolve();
            }
        }

        updateWindowPosition(1);

    });
}

function huntCursor(robot, window) {
    return new Promise(async (resolve) => {
        new Promise((resolve,) => {
            function updateWindowPosition(progress) {
                const currentPosition = window.getPosition();
                const {x, y} = robot.getMousePos()

                const deltaX = x - (currentPosition[0] + (1 / 2 * window.getSize()[0]));
                const deltaY = y - (currentPosition[1] + (80 / 119 * window.getSize()[1]));

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

                window.setPosition(newX, newY);

                if (!((moveX < 6 && moveX > -6) && (moveY < 6 && moveY > -6))) {
                    setTimeout(updateWindowPosition, 16, progress + 1); // 60 frames per second
                } else {
                    resolve();
                }
            }

            updateWindowPosition(1);
        })

            .then(() => window.getPosition())
            .then((pos) => steelCursorSmoothly(robot, window, pos[0] + Math.floor(Math.random() * (500 + 1)), pos[1] + Math.floor(Math.random() * (500 - -500 + 1)) + -500, 1 / 2, 80 / 119))
            .then(() => resolve());
    });

}

module.exports = {moveWindowSmoothly, huntCursor, steelCursorSmoothly};
