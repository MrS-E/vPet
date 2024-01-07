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

        this.meowType = {
            happy: 'meow_happy.mp3',
            needy: 'meow_needy.mp3',
            normal: 'meow.mp3',
            sad: 'meow_sad.mp3',
        }

        //TODO replace listeners and intervals with brainsAI
        this.setMovementInterval()

        setInterval(() => {
            this.feelings.hunger += 1;
            this.feelings.boredom += 5;
            this.feelings.sleepiness += 2;
        }, 6000);

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
        this.meow("happy")
        window.ipcRenderer.send('eatFile');
        this.feelings.hunger = 0;
    }

    play(){
        this.removeMovementInterval()
        const x = getRandomInt(0, 500);
        const y = getRandomInt(-500, 500);

        this.meow("happy")

        document.getElementById("image-container").style.transform = "scaleX(1)";

        setTimeout(()=> {
            window.ipcRenderer.sendSync('steelCursor', [x, y]);
            this.setMovementInterval()
        }, 50);

        this.feelings.hunger += 10;
        this.feelings.boredom = 0;
    }

    hunt(){
        this.meow("needy")
        window.ipcRenderer.sendSync('huntCursor');
        this.feelings.boredom = 0;
        this.feelings.sleepiness += 20;
    }

    sleep(){
        document.getElementById("image-container").src = "assets/cat_sleep.gif";
        this.meow("sad")
        this.removeMovementInterval()
        this.feelings.sleepiness = 0;
        setTimeout(() => {
            document.getElementById("image-container").src = "assets/cat.png";
            this.setMovementInterval()
        }, 100000);
    }

    move() {
        document.getElementById("image-container").src = "assets/cat_move.gif";

        const x = getRandomInt(-200, 200);
        const y = getRandomInt(-200, 200);

        if (x >= 0) document.getElementById("image-container").style.transform = "scaleX(1)";
        if (x < 0) document.getElementById("image-container").style.transform = "scaleX(-1)";

        setTimeout(()=>{ //somehow requestAnimationFrame is not working
            window.ipcRenderer.sendSync('moveWindow', [x, y])
            document.getElementById("image-container").src = "assets/cat.png";
        }, 50);

        return true;
    }
    setMovementInterval(){
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
