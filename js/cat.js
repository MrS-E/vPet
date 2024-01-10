class Cat{
    constructor(name){
        this.name = name;
        this.feelings = {
            _boredom: 0,
            boredomListener: (val)=>{},
            set boredom(val){
                this._boredom = val;
                this.boredomListener(val);
            },
            get boredom(){
                return this._boredom;
            },
            _hunger: 0,
            hungerListener: (val)=>{},
            set hunger(val){
                this._hunger = val;
                this.hungerListener(val);
            },
            get hunger(){
                return this._hunger;
            },
            happyness: 0,
            _sleepiness: 0,
            sleepinessListener: (val)=>{},
            set sleepiness(val){
                this._sleepiness = val;
                this.sleepinessListener(val);
            },
            get sleepiness(){
                return this._sleepiness;
            },
        };
        this.controller = new AbortController();
        this.signal = this.controller.signal;

        this.meowType = {
            happy: 'meow_happy.mp3',
            needy: 'meow_needy.mp3',
            normal: 'meow.mp3',
            sad: 'meow_sad.mp3',
        }

        setTimeout(()=>{
            this.restartMovement();
        }, 100)

        //TODO replace listeners and intervals with brainsAI
        this.feelingsInterval = setInterval(() => {
            this.feelings.hunger += 2;
            this.feelings.boredom += 5;
            this.feelings.sleepiness += 10;
        }, 6000);

        this.meowInterval = setInterval(() => {
            if(getRandomInt(1, 20)>=15){
                this.meow();
            }
        }, 3000);

        this.feelings.boredomListener = async (val)=>{
            if(val > 100){
                this.meow();
                this.hunt();
            }
        }

        this.feelings.hungerListener =(val)=>{
            if(val > 100){
                this.meow("needy");
                this.eat();
            }
        }

        this.feelings.sleepinessListener = (val)=>{
            if(val > 100){
                this.meow("sad");
                //this.sleep(); //need fixing
                this.feelings.sleepiness = 0;
            }
        }
    }
    meow(type="normal"){
        console.log("meow");
        window.ipcRenderer.send('meow', this.meowType[type]);
    }

    eat(){
        this.meow("happy")
        window.ipcRenderer.invoke('eatFile')
            .then((result) => {
                if(result === "death"){
                    this.controller.abort()
                    clearInterval(this.feelingsInterval)
                    clearInterval(this.meowInterval)
                    this.play = ()=>{}
                    this.meow = ()=>{}
                    this.hunt = ()=>{}
                    this.sleep = ()=>{}
                    this.move = ()=>{}
                    setTimeout(()=>{
                        document.getElementById("image-container").style.transform = "scaleX(1)";
                        document.getElementById("image-container").src="assets/death.png"
                    }, 10000)
                }
            });
        this.feelings.hunger = 0;
    }

    play(){
        this.controller.abort();
        const x = getRandomInt(0, 500);
        const y = getRandomInt(-500, 500);
        //document.getElementById("image-container").src = "assets/cat_move.gif";
        document.getElementById("image-container").style.transform = "scaleX(1)";

        setTimeout(()=> {
            window.ipcRenderer.sendSync('steelCursor', [x, y]);
            this.restartMovement();
            //document.getElementById("image-container").src = "assets/cat.png";
        }, 50);

        this.feelings.hunger += 10;
        this.feelings.boredom = 0;
        this.feelings.sleepiness += 10;
    }

    hunt(){
        this.meow("needy")
        document.getElementById("image-container").src = "assets/hunt.png";
        setTimeout(()=> {
            window.ipcRenderer.sendSync('huntCursor');
            this.feelings.boredom = 0;
            this.feelings.sleepiness += 20;
            document.getElementById("image-container").src = "assets/cat_move.gif";
        }, 55);
    }

    sleep(){ //TODO replace sleep image //FIXME not working correctly
        document.getElementById("image-container").src = "assets/cat_sleep.gif";
        this.meow("sad")
        this.controller.abort();
        this.feelings.sleepiness = 0;
        setTimeout(() => {
            document.getElementById("image-container").src = "assets/cat_move.gif";
            this.restartMovement();
        }, 90000);
    }

    async move(abort = this.signal) { //FIXME the cat ends up in the bottom right corner
        let x = getRandomInt(-200, 200);
        let y = getRandomInt(-200, 200);
        console.log(x, y);
        let progress = 1;

        if(x%2!==0) x+=1;
        if(y%2!==0) y+=1;

        document.getElementById("image-container").src = "assets/cat_move.gif";
        if (x >= 0) {
            document.getElementById("image-container").style.transform = "scaleX(1)";
        }else {
            document.getElementById("image-container").style.transform = "scaleX(-1)";
        }

        while (2 * progress < x || 2 * progress < y) {
            if (abort.aborted) {
                this.controller = new AbortController();
                this.signal = this.controller.signal;
                return;
            }
            await new Promise((resolve) => {
                setTimeout(() => {
                    let args = [
                        x>0?(2*progress<x?2:0):(-2*progress>x?-2:0),
                        y>0?(2*progress<y?2:0):(-2*progress>y?-2:0)
                    ];

                    window.ipcRenderer.invoke('step', args)
                        .then(r => {
                            if (r) {
                                //this.controller.abort();
                                //this.play();
                                //console.log("play");
                            }
                            resolve();
                        });
                }, 16);
            });
            progress++;
        }

        //document.getElementById("image-container").src = "assets/cat.png";
        setTimeout(() => {
            this.move();
        }, 50);
    }

    restartMovement(){
        this.controller.abort();
        this.controller = new AbortController();
        this.signal = this.controller.signal;
        this.move();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
