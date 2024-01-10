onmessage = function(e) {
    switch(e.data[0]) {
        case "move":
            movement(e.data[1]);
            break;

    }
};

function movement(data){
    setTimeout(()=>{
        let x = data.x;
        let y = data.y;
        let progress = data.progress;
        const args = [
            x>0?(2*progress<x?2:0):(-2*progress>x?-2:0),
            y>0?(2*progress<y?2:0):(-2*progress>y?-2:0)
        ];

        if(args[0]!==0 || args[1]!==0) {
            postMessage(["move", args, progress]);
        }else {
            finishMovement();
        }
    }, 16)
}

function finishMovement(){
    setTimeout(()=>{
        postMessage(["done"]);
    }, 500);
}
