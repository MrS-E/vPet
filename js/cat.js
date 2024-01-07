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

        this.meowType = { //TODO change sounds
            normal: 'meow.mp3',
            needy: 'meow.mp3',
            happy: 'meow.mp3',
            sad: 'meow.mp3',
            angry: 'meow.mp3',
            fearful: 'meow.mp3',
        }

        //TODO replace listeners and intervals with brainsAI
        this.setMovemntInterval()

        setInterval(() => {
            this.feelings.hunger += 2;
            this.feelings.boredom += 5;
            this.feelings.sleepiness += 1;
        }, 5000);

        setInterval(() => {
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
                this.sleep();
            }
        }
    }
    meow(type="normal"){
        console.log("meow");
        window.ipcRenderer.send('meow', this.meowType[type]);
    }

    eat(){
        window.ipcRenderer.send('eatFile');
    }

    play(){
        this.removeMovementInterval()
        const x = getRandomInt(0, 500);
        const y = getRandomInt(-500, 500);

        document.getElementById("image-container").style.transform = "scaleX(1)";

        setTimeout(()=> {
            window.ipcRenderer.sendSync('steelCursor', [x, y]);
            this.setMovemntInterval()
        }, 50);

        this.feelings.hunger += 10;
        this.feelings.boredom = 0;
    }

    hunt(){
        window.ipcRenderer.sendSync('huntCursor');
        this.feelings.boredom = 0;
        this.feelings.sleepiness += 20;
    }

    sleep(){
        document.getElementById("image-container").src = "assets/cat_sleep.gif";
        this.removeMovementInterval()
        this.feelings.sleepiness = 0;
    }

    move() {
        document.getElementById("image-container").src = "assets/cat_move.gif";

        const x = getRandomInt(-200, 200);
        const y = getRandomInt(-200, 200);

        if (x >= 0) document.getElementById("image-container").style.transform = "scaleX(1)";
        if (x < 0) document.getElementById("image-container").style.transform = "scaleX(-1)";

        setTimeout(()=>{ //somehow requestAnimationFrame is not working
            window.ipcRenderer.sendSync('moveWindow', [x, y]);
            document.getElementById("image-container").src = "assets/cat.png";
        }, 50);

        return true;
    }
    setMovemntInterval(){
        this.movement = setInterval(async () => {
            this.move();
        }, 500);
    }
    removeMovementInterval(){
        clearInterval(this.movement)
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
