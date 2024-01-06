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

        this.meow = { //TODO change sounds
            normal: 'meow.mp3',
            needy: 'meow.mp3',
            happy: 'meow.mp3',
            sad: 'meow.mp3',
            angry: 'meow.mp3',
            fearful: 'meow.mp3',
        }

        //increase hunger and boredom
        setInterval(() => {
            this.feelings.hunger = 5;
            this.feelings.boredom += 10;
            his.feelings.sleepiness += 1;
        }, 5000);

        setInterval(() => {
            if(getRandomInt(1, 20)>=15){
                this.meow();
            }
        }, 1000);

        setInterval( () => {
            this.move();
        }, 1000);

        //boredom listener TODO replace listeners with brainsAI
        this.feelings.boredomListener = (val)=>{
            if(val > 100){
                this.meow();
                this.play();
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
        window.sound.play(this.meow[type]);
    }

    eat(){
        window.dialog.showOpenDialog({properties: ['openFile']})
            .then((result) => {
                if(result === undefined) return;
                if(!window.fs.existsSync(result.filePaths[0])) return;
                window.fs.unlinkSync(result.filePaths[0]);
                this.feelings.hunger = 0;
            });
    }

    play(){
        const x = getRandomInt(-100, 100);
        const y = getRandomInt(-100, 100);
        this.feelings.boredom = 0;
        window.ipcRenderer.send('steelCursor', [x,y]);
    }

    sleep(){ //TODO change image
        this.feelings.sleepiness = 0;
    }

    move() {
        const x = getRandomInt(-100, 100);
        const y = getRandomInt(-100, 100);
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        setTimeout(() => window.ipcRenderer.send('moveWindow', [x, y, distance]), distance + 1000);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
