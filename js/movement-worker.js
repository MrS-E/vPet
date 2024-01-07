function move() {
    self.postMessage({type:"src",value:"assets/cat_move.gif"})

    const x = getRandomInt(-200, 200);
    const y = getRandomInt(-200, 200);

   if (x >= 0) self.postMessage({type:"css",value:"scaleX(1)"})
   if (x < 0) self.postMessage({type:"css",value:"scaleX(-1)"})

    setTimeout(()=>{
        self.postMessage({type:"move",value:[x,y]})
    }, 50);

    return true;
}


self.onmessage = async function (e) {
    console.log("move");
    self.postMessage({type: "src", value: "assets/cat.png"})
    setTimeout(move, 500)
}


move();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
