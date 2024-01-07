function move(ipcRenderer) {
    //document.getElementById("image-container").src = "assets/cat_move.gif";

    const x = getRandomInt(-200, 200);
    const y = getRandomInt(-200, 200);

   // if (x >= 0) document.getElementById("image-container").style.transform = "scaleX(1)";
   // if (x < 0) document.getElementById("image-container").style.transform = "scaleX(-1)";

    setTimeout(()=>{ //somehow requestAnimationFrame is not working
        ipcRenderer.sendSync('moveWindow', [x, y]);
        //document.getElementById("image-container").src = "assets/cat.png";
    }, 50);

    return true;
}


self.onmessage = function(e) {
    setInterval(move, 500, e.data);
}


