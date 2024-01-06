document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded")
    window.ipcRenderer.send('moveWindow', [50,50]);
    // Speed up the mouse.
    window.robot.setMouseDelay(2);

    var twoPI = Math.PI * 2.0;
    var screenSize = window.robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++)
    {
        y = height * Math.sin((twoPI * x) / width) + height;
        window.robot.moveMouse(x, y);
    }
});
